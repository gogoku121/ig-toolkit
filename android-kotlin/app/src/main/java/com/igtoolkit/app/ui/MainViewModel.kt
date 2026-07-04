package com.igtoolkit.app.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.igtoolkit.app.domain.engine.*
import com.igtoolkit.app.domain.model.*
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

class MainViewModel : ViewModel() {
    
    private val researchEngine = ResearchEngine()
    private val captionGenerator = CaptionGenerator()
    
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
                
                // PHASE 2: Generate captions from research
                _researchPhase.value = "Generating captions..."
                
                val request = GenerationRequest(
                    topic = state.topic,
                    personality = state.personality,
                    goal = state.goal,
                    versions = state.versions
                )
                
                // Pass research to generator - it should use it!
                val captions = captionGenerator.generateMultiple(request, research, state.versions)
                _generatedCaptions.value = captions
                
                // Select first caption
                _selectedCaption.value = captions.firstOrNull()
                
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
