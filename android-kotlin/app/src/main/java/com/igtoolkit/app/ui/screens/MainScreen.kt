package com.igtoolkit.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.igtoolkit.app.domain.engine.ResearchEngine
import com.igtoolkit.app.domain.model.*
import com.igtoolkit.app.ui.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    viewModel: MainViewModel,
    onShare: (String) -> Unit,
    onExport: (String) -> Unit
) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val researchMode by viewModel.researchMode.collectAsStateWithLifecycle()
    val researchStatus by viewModel.researchStatus.collectAsStateWithLifecycle()
    val providerHealth by viewModel.providerHealth.collectAsStateWithLifecycle()
    val generatedCaptions by viewModel.generatedCaptions.collectAsStateWithLifecycle()
    val selectedCaption by viewModel.selectedCaption.collectAsStateWithLifecycle()
    val currentResearch by viewModel.currentResearch.collectAsStateWithLifecycle()
    val researchPhase by viewModel.researchPhase.collectAsStateWithLifecycle()
    
    var showDebugSheet by remember { mutableStateOf(false) }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("IG Toolkit") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer
                ),
                actions = {
                    // Research Mode Indicator
                    ResearchModeChip(mode = researchMode)
                    
                    // Debug toggle
                    IconButton(onClick = { showDebugSheet = true }) {
                        Icon(Icons.Default.BugReport, "Debug")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            // RESEARCH STATUS BAR - Always visible
            ResearchStatusBar(
                researchMode = researchMode,
                researchStatus = researchStatus,
                providerHealth = providerHealth,
                modeExplanation = uiState.modeExplanation
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Topic Input
            OutlinedTextField(
                value = uiState.topic,
                onValueChange = { viewModel.updateTopic(it) },
                label = { Text("Topic") },
                placeholder = { Text("Enter your post topic...") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Personality Selector
            Text("Personality", style = MaterialTheme.typography.labelMedium)
            PersonalitySelector(
                selected = uiState.personality,
                onSelect = { viewModel.updatePersonality(it) }
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Versions Slider
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Versions: ${uiState.versions}", style = MaterialTheme.typography.labelMedium)
                Slider(
                    value = uiState.versions.toFloat(),
                    onValueChange = { viewModel.updateVersions(it.toInt()) },
                    valueRange = 1f..5f,
                    steps = 3,
                    modifier = Modifier.weight(1f).padding(horizontal = 8.dp)
                )
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            // Generate Button
            Button(
                onClick = { viewModel.generate() },
                enabled = !uiState.isLoading && uiState.topic.isNotBlank(),
                modifier = Modifier.fillMaxWidth()
            ) {
                if (uiState.isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(20.dp),
                        color = MaterialTheme.colorScheme.onPrimary
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(researchPhase)
                } else {
                    Icon(Icons.Default.Search, null, modifier = Modifier.size(20.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Research & Generate")
                }
            }
            
            // Error display
            uiState.error?.let { error ->
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.errorContainer
                    ),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Error,
                            null,
                            tint = MaterialTheme.colorScheme.error
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            error,
                            color = MaterialTheme.colorScheme.onErrorContainer,
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Research Quality Indicator
            currentResearch?.let { research ->
                ResearchQualityIndicator(research = research)
                Spacer(modifier = Modifier.height(8.dp))
            }
            
            // Generated Captions
            if (generatedCaptions.isNotEmpty()) {
                Text(
                    "Generated Captions",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(8.dp))
                
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(generatedCaptions) { caption ->
                        CaptionCard(
                            caption = caption,
                            isSelected = selectedCaption == caption,
                            onSelect = { viewModel.selectCaption(caption) },
                            onCopy = { viewModel.copyCaption(caption) },
                            onShare = { onShare(caption.caption + "\n\n" + caption.hashtags.joinToString(" ")) }
                        )
                    }
                }
                
                // Selected Caption Actions
                selectedCaption?.let { caption ->
                    Spacer(modifier = Modifier.height(8.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        OutlinedButton(
                            onClick = { onShare(caption.hashtags.joinToString(" ")) },
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.Tag, null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Copy Hashtags")
                        }
                        Button(
                            onClick = { onExport(caption.caption) },
                            modifier = Modifier.weight(1f)
                        ) {
                            Icon(Icons.Default.Share, null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Share")
                        }
                    }
                }
            }
        }
    }
    
    // Debug Bottom Sheet
    if (showDebugSheet) {
        DebugBottomSheet(
            viewModel = viewModel,
            onDismiss = { showDebugSheet = false }
        )
    }
}

/**
 * Research Status Bar - Shows current research state
 */
@Composable
fun ResearchStatusBar(
    researchMode: ResearchMode,
    researchStatus: ResearchEngine.ResearchStatus,
    providerHealth: Map<String, ProviderHealth>,
    modeExplanation: String
) {
    val (bgColor, borderColor, icon, statusText) = when (researchMode) {
        ResearchMode.ONLINE -> Quadruple(
            MaterialTheme.colorScheme.primaryContainer,
            MaterialTheme.colorScheme.primary,
            Icons.Default.Wifi,
            "LIVE RESEARCH"
        )
        ResearchMode.CACHE -> Quadruple(
            MaterialTheme.colorScheme.tertiaryContainer,
            MaterialTheme.colorScheme.tertiary,
            Icons.Default.Storage,
            "CACHED"
        )
        ResearchMode.MEMORY -> Quadruple(
            MaterialTheme.colorScheme.secondaryContainer,
            MaterialTheme.colorScheme.secondary,
            Icons.Default.Memory,
            "MEMORY"
        )
        ResearchMode.OFFLINE -> Quadruple(
            MaterialTheme.colorScheme.errorContainer,
            MaterialTheme.colorScheme.error,
            Icons.Default.CloudOff,
            "OFFLINE MODE"
        )
    }
    
    Card(
        colors = CardDefaults.cardColors(containerColor = bgColor),
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, borderColor, RoundedCornerShape(12.dp))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(icon, null, tint = borderColor)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    statusText,
                    style = MaterialTheme.typography.labelLarge,
                    color = borderColor,
                    fontWeight = FontWeight.Bold
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Mode explanation
            if (modeExplanation.isNotEmpty()) {
                Text(
                    modeExplanation,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Spacer(modifier = Modifier.height(4.dp))
            }
            
            // Research phase if active
            if (researchStatus.isResearching) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        strokeWidth = 2.dp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        researchStatus.currentPhase,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
            }
            
            // Provider info if researching
            researchStatus.providerInUse?.let { provider ->
                Text(
                    "Provider: $provider • Latency: ${researchStatus.qualityScore}ms",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            // Stats if research complete
            if (researchStatus.resultsCount > 0) {
                Text(
                    "Results: ${researchStatus.resultsCount} • Entities: ${researchStatus.entitiesCount} • Insights: ${researchStatus.insightsCount}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            
            // Fallback reason if offline
            researchStatus.fallbackReason?.let { reason ->
                Text(
                    "Reason: $reason",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}

data class Quadruple<A, B, C, D>(val first: A, val second: B, val third: C, val fourth: D)

@Composable
fun ResearchModeChip(mode: ResearchMode) {
    val (color, text, icon) = when (mode) {
        ResearchMode.ONLINE -> Triple(MaterialTheme.colorScheme.primary, "ONLINE", Icons.Default.Wifi)
        ResearchMode.CACHE -> Triple(MaterialTheme.colorScheme.tertiary, "CACHE", Icons.Default.Storage)
        ResearchMode.MEMORY -> Triple(MaterialTheme.colorScheme.secondary, "MEMORY", Icons.Default.Memory)
        ResearchMode.OFFLINE -> Triple(MaterialTheme.colorScheme.error, "OFFLINE", Icons.Default.CloudOff)
    }
    
    Surface(
        color = color.copy(alpha = 0.2f),
        shape = RoundedCornerShape(16.dp)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(icon, null, tint = color, modifier = Modifier.size(14.dp))
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text,
                color = color,
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PersonalitySelector(
    selected: Personality,
    onSelect: (Personality) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    
    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = !expanded }
    ) {
        OutlinedTextField(
            value = selected.displayName,
            onValueChange = {},
            readOnly = true,
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = expanded) },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor()
        )
        
        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            Personality.entries.forEach { personality ->
                DropdownMenuItem(
                    text = {
                        Column {
                            Text(personality.displayName)
                            Text(
                                personality.description,
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    },
                    onClick = {
                        onSelect(personality)
                        expanded = false
                    },
                    contentPadding = ExposedDropdownMenuDefaults.ItemContentPadding
                )
            }
        }
    }
}

@Composable
fun ResearchQualityIndicator(research: ResearchResult) {
    val color = when (research.qualityLevel) {
        QualityLevel.EXCELLENT -> MaterialTheme.colorScheme.primary
        QualityLevel.GOOD -> MaterialTheme.colorScheme.tertiary
        QualityLevel.ADEQUATE -> MaterialTheme.colorScheme.secondary
        QualityLevel.POOR -> MaterialTheme.colorScheme.error
        QualityLevel.OFFLINE -> MaterialTheme.colorScheme.outline
    }
    
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .background(color.copy(alpha = 0.1f), RoundedCornerShape(8.dp))
            .padding(12.dp)
    ) {
        Icon(
            when (research.qualityLevel) {
                QualityLevel.EXCELLENT -> Icons.Default.Verified
                QualityLevel.OFFLINE -> Icons.Default.CloudOff
                else -> Icons.Default.Analytics
            },
            contentDescription = null,
            tint = color
        )
        
        Spacer(modifier = Modifier.width(12.dp))
        
        Column(modifier = Modifier.weight(1f)) {
            Text(
                "Research: ${research.qualityLevel.name}",
                style = MaterialTheme.typography.labelMedium,
                color = color
            )
            Text(
                "${research.results.size} results • ${research.entities.size} entities • ${research.insights.size} insights",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        Text(
            "${research.qualityScore}",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.Bold,
            color = color
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CaptionCard(
    caption: GenerationResult,
    isSelected: Boolean,
    onSelect: () -> Unit,
    onCopy: () -> Unit,
    onShare: () -> Unit
) {
    Card(
        onClick = onSelect,
        colors = CardDefaults.cardColors(
            containerColor = if (isSelected) 
                MaterialTheme.colorScheme.primaryContainer 
            else 
                MaterialTheme.colorScheme.surfaceVariant
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    "Version ${caption.version}",
                    style = MaterialTheme.typography.labelMedium,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.weight(1f))
                if (caption.researchUsed) {
                    Surface(
                        color = MaterialTheme.colorScheme.primaryContainer,
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            "RESEARCH",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                } else {
                    Surface(
                        color = MaterialTheme.colorScheme.errorContainer,
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            "OFFLINE",
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.error,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                caption.caption.take(200) + if (caption.caption.length > 200) "..." else "",
                style = MaterialTheme.typography.bodyMedium
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Hashtags preview
            Text(
                caption.hashtags.take(5).joinToString(" "),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.primary
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Row {
                IconButton(onClick = onCopy, modifier = Modifier.size(32.dp)) {
                    Icon(Icons.Default.ContentCopy, "Copy", modifier = Modifier.size(16.dp))
                }
                IconButton(onClick = onShare, modifier = Modifier.size(32.dp)) {
                    Icon(Icons.Default.Share, "Share", modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DebugBottomSheet(
    viewModel: MainViewModel,
    onDismiss: () -> Unit
) {
    val debugInfo = remember { viewModel.getDebugInfo() }
    val providerHealth by viewModel.providerHealth.collectAsStateWithLifecycle()
    val debugLog by viewModel.debugLog.collectAsStateWithLifecycle()
    
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Text(
                "🔬 Research Debug Panel",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Current Status
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = when (debugInfo.mode) {
                        ResearchMode.ONLINE -> MaterialTheme.colorScheme.primaryContainer
                        ResearchMode.CACHE -> MaterialTheme.colorScheme.tertiaryContainer
                        ResearchMode.MEMORY -> MaterialTheme.colorScheme.secondaryContainer
                        ResearchMode.OFFLINE -> MaterialTheme.colorScheme.errorContainer
                    }
                )
            ) {
                Column(modifier = Modifier.padding(12.dp)) {
                    Text(
                        "Mode: ${debugInfo.mode.name}",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    Text("Last Provider: ${debugInfo.lastProvider ?: "none"}")
                    Text("Latency: ${debugInfo.lastProviderLatency}ms")
                    Text("Quality Threshold: ${debugInfo.qualityThreshold}")
                    debugInfo.researchStatus.fallbackReason?.let {
                        Text("Fallback: $it", color = MaterialTheme.colorScheme.error)
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Provider Health
            Text(
                "Provider Health",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            
            providerHealth.forEach { (key, health) ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                if (health.isHealthy) Icons.Default.CheckCircle else Icons.Default.Error,
                                null,
                                tint = when {
                                    health.isHealthy -> MaterialTheme.colorScheme.primary
                                    else -> MaterialTheme.colorScheme.error
                                }
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(key, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.weight(1f))
                            Text(health.status.name)
                        }
                        Divider(modifier = Modifier.padding(vertical = 8.dp))
                        Row {
                            Column(modifier = Modifier.weight(1f)) {
                                Text("API Key", style = MaterialTheme.typography.labelSmall)
                                Text(if (health.apiKeyConfigured) "✅ Configured" else "❌ Missing")
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Success Rate", style = MaterialTheme.typography.labelSmall)
                                Text("${health.successRate}%")
                            }
                            Column(modifier = Modifier.weight(1f)) {
                                Text("Latency", style = MaterialTheme.typography.labelSmall)
                                Text("${health.latencyMs}ms")
                            }
                        }
                        health.lastError?.let { error ->
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                "Error: $error",
                                color = MaterialTheme.colorScheme.error,
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Debug Log
            Text(
                "Debug Log",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            Spacer(modifier = Modifier.height(8.dp))
            
            Card(
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .padding(8.dp)
                ) {
                    debugLog.takeLast(20).forEach { entry ->
                        val color = when (entry.type) {
                            ResearchEngine.LogType.SUCCESS -> MaterialTheme.colorScheme.primary
                            ResearchEngine.LogType.WARN -> MaterialTheme.colorScheme.tertiary
                            ResearchEngine.LogType.ERROR -> MaterialTheme.colorScheme.error
                            else -> MaterialTheme.colorScheme.onSurfaceVariant
                        }
                        val prefix = when (entry.type) {
                            ResearchEngine.LogType.SUCCESS -> "✅"
                            ResearchEngine.LogType.WARN -> "⚠️"
                            ResearchEngine.LogType.ERROR -> "❌"
                            else -> "ℹ️"
                        }
                        Text(
                            "$prefix ${entry.message}",
                            style = MaterialTheme.typography.bodySmall,
                            color = color,
                            maxLines = 1
                        )
                    }
                }
            }
            
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}
