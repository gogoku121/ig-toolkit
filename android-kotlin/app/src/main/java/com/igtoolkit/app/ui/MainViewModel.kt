package com.igtoolkit.app.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.igtoolkit.app.data.local.DraftDao
import com.igtoolkit.app.data.local.DraftEntity
import com.igtoolkit.app.domain.engine.*
import com.igtoolkit.app.domain.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class MainViewModel @Inject constructor(
    private val researchEngine: ResearchEngine,
    private val captionGenerator: CaptionGenerator,
    private val llmCaptionClient: LlmCaptionClient,
    private val draftDao: DraftDao
) : ViewModel() {

    // Persisted drafts (survives process death/app restart), newest first.
    val drafts: StateFlow<List<DraftEntity>> = draftDao.observeAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Configure the app-level shared secret for our backend proxy (not the
    // real SerpAPI key — that stays server-side, see backend/README.md).
    init {
        val backendAppKey = com.igtoolkit.app.BuildConfig.RESEARCH_BACKEND_APP_KEY
        if (backendAppKey.isNotEmpty()) {
            researchEngine.setApiKey("serpapi", backendAppKey)
        }
        println("MAINVIEWMODEL_DEBUG: backend proxy configured: ${backendAppKey.isNotEmpty()}")
    }
    
    // UI State
    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()
    
    // Research mode
    val researchMode: StateFlow<ResearchMode> = researchEngine.currentMode
    
    // Research status (detailed)
    val researchStatus: StateFlow<ResearchEngine.ResearchStatus> = researchEngine.researchStatus
    
    // Provider health
    val providerHealth: StateFlow<Map<String, ProviderHealth>> = researchEngine.providerHealth
    
    // Debug log
    val debugLog: StateFlow<List<ResearchEngine.DebugLogEntry>> = researchEngine.debugLog
    
    // Current research data
    private val _currentResearch = MutableStateFlow<ResearchResult?>(null)
    val currentResearch: StateFlow<ResearchResult?> = _currentResearch.asStateFlow()
    
    // Generated captions
    private val _generatedCaptions = MutableStateFlow<List<GenerationResult>>(emptyList())
    val generatedCaptions: StateFlow<List<GenerationResult>> = _generatedCaptions.asStateFlow()
    
    // Selected caption for editing
    private val _selectedCaption = MutableStateFlow<GenerationResult?>(null)
    val selectedCaption: StateFlow<GenerationResult?> = _selectedCaption.asStateFlow()
    
    // Show debug panel
    private val _showDebugPanel = MutableStateFlow(false)
    val showDebugPanel: StateFlow<Boolean> = _showDebugPanel.asStateFlow()
    
    // Research phase text for UI
    private val _researchPhase = MutableStateFlow("Ready")
    val researchPhase: StateFlow<String> = _researchPhase.asStateFlow()
    
    data class UiState(
        val topic: String = "",
        val personality: Personality = Personality.VIRAL_CREATOR,
        val goal: Goal = Goal.ENGAGE,
        val versions: Int = 3,
        val isLoading: Boolean = false,
        val error: String? = null,
        val copiedCaption: Boolean = false,
        val modeExplanation: String = "" // Why are we in this mode?
    )
    
    fun updateTopic(topic: String) {
        _uiState.update { it.copy(topic = topic) }
    }
    
    fun updatePersonality(personality: Personality) {
        _uiState.update { it.copy(personality = personality) }
    }
    
    fun updateGoal(goal: Goal) {
        _uiState.update { it.copy(goal = goal) }
    }
    
    fun updateVersions(versions: Int) {
        _uiState.update { it.copy(versions = versions) }
    }
    
    fun toggleDebugPanel() {
        _showDebugPanel.value = !_showDebugPanel.value
    }
    
    /**
     * Generate captions - research is ALWAYS performed first unless offline
     */
    fun generate() {
        val state = _uiState.value
        if (state.topic.isBlank()) {
            _uiState.update { it.copy(error = "Please enter a topic") }
            return
        }
        
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null, modeExplanation = "") }
            
            try {
                // PHASE 1: Research is MANDATORY unless offline
                _researchPhase.value = "Researching..."
                
                val research = researchEngine.research(state.topic)
                _currentResearch.value = research
                
                // Update UI with mode explanation
                val modeExplanation = when (research.source) {
                    "live_research" -> "Using live research from ${research.provider}"
                    "cached_research" -> "Using cached research (live failed)"
                    else -> "OFFLINE: ${researchEngine.researchStatus.value.fallbackReason ?: "No research available"}"
                }
                
                _uiState.update { it.copy(modeExplanation = modeExplanation) }
                
                // PHASE 2: Generate captions - try the real LLM first, fall back
                // to offline templates if the backend isn't configured or fails
                // (network error, rate limit, etc.)
                _researchPhase.value = "Generating captions..."

                val request = GenerationRequest(
                    topic = state.topic,
                    personality = state.personality,
                    goal = state.goal,
                    versions = state.versions
                )

                val captions = if (llmCaptionClient.isConfigured) {
                    try {
                        llmCaptionClient.generate(request, research)
                    } catch (e: Exception) {
                        _uiState.update { it.copy(modeExplanation = "$modeExplanation (AI generation failed, using offline templates: ${e.message})") }
                        captionGenerator.generateMultiple(request, research, state.versions)
                    }
                } else {
                    captionGenerator.generateMultiple(request, research, state.versions)
                }
                _generatedCaptions.value = captions

                // Select first caption
                _selectedCaption.value = captions.firstOrNull()

                // Persist every generated version as a draft so it survives
                // process death / app restart (see data/local/DraftEntity.kt)
                captions.forEach { result ->
                    draftDao.insert(
                        DraftEntity(
                            topic = state.topic,
                            personality = state.personality.displayName,
                            goal = state.goal.displayName,
                            caption = result.caption,
                            hashtags = result.hashtags,
                            quality = result.quality,
                            researchUsed = result.researchUsed,
                            aiGenerated = result.aiGenerated
                        )
                    )
                }
                
                _uiState.update { it.copy(isLoading = false) }
                _researchPhase.value = "Complete"
                
            } catch (e: Exception) {
                _uiState.update { 
                    it.copy(
                        isLoading = false, 
                        error = e.message ?: "Generation failed",
                        modeExplanation = "Error: ${e.message}"
                    )
                }
                _researchPhase.value = "Error"
            }
        }
    }
    
    fun selectCaption(caption: GenerationResult) {
        _selectedCaption.value = caption
    }
    
    fun copyCaption(caption: GenerationResult) {
        _uiState.update { it.copy(copiedCaption = true) }
    }
    
    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
    
    fun getDebugInfo(): ResearchEngine.DebugInfo {
        return researchEngine.getDebugInfo()
    }
    
    /**
     * Set API key for a provider
     */
    fun setApiKey(providerKey: String, apiKey: String) {
        researchEngine.setApiKey(providerKey, apiKey)
    }
}
