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
    
    data class UiState(
        val topic: String = "",
        val personality: Personality = Personality.VIRAL_CREATOR,
        val goal: Goal = Goal.ENGAGE,
        val versions: Int = 3,
        val isLoading: Boolean = false,
        val error: String? = null,
        val copiedCaption: Boolean = false
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
    
    fun generate() {
        val state = _uiState.value
        if (state.topic.isBlank()) {
            _uiState.update { it.copy(error = "Please enter a topic") }
            return
        }
        
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }
            
            try {
                // Research phase
                val research = researchEngine.research(state.topic)
                _currentResearch.value = research
                
                // Generate captions
                val request = GenerationRequest(
                    topic = state.topic,
                    personality = state.personality,
                    goal = state.goal,
                    versions = state.versions
                )
                
                val captions = captionGenerator.generateMultiple(request, research, state.versions)
                _generatedCaptions.value = captions
                
                // Select first caption
                _selectedCaption.value = captions.firstOrNull()
                
                _uiState.update { it.copy(isLoading = false) }
                
            } catch (e: Exception) {
                _uiState.update { 
                    it.copy(
                        isLoading = false, 
                        error = e.message ?: "Generation failed"
                    )
                }
            }
        }
    }
    
    fun selectCaption(caption: GenerationResult) {
        _selectedCaption.value = caption
    }
    
    fun copyCaption(caption: GenerationResult) {
        // In real app, would use ClipboardManager
        _uiState.update { it.copy(copiedCaption = true) }
    }
    
    fun copyHashtags(hashtags: List<String>) {
        // In real app, would use ClipboardManager
    }
    
    fun clearError() {
        _uiState.update { it.copy(error = null) }
    }
    
    fun getDebugInfo(): ResearchEngine.DebugInfo {
        return researchEngine.getDebugInfo()
    }
}
