package com.igtoolkit.app.ui.screens

import androidx.compose.foundation.background
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
    val providerHealth by viewModel.providerHealth.collectAsStateWithLifecycle()
    val generatedCaptions by viewModel.generatedCaptions.collectAsStateWithLifecycle()
    val selectedCaption by viewModel.selectedCaption.collectAsStateWithLifecycle()
    val showDebugPanel by viewModel.showDebugPanel.collectAsStateWithLifecycle()
    val currentResearch by viewModel.currentResearch.collectAsStateWithLifecycle()
    
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
                }
                Text(if (uiState.isLoading) "Researching..." else "Generate Captions")
            }
            
            // Error display
            uiState.error?.let { error ->
                Text(
                    text = error,
                    color = MaterialTheme.colorScheme.error,
                    style = MaterialTheme.typography.bodySmall,
                    modifier = Modifier.padding(top = 8.dp)
                )
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

@Composable
fun ResearchModeChip(mode: ResearchMode) {
    val (color, text) = when (mode) {
        ResearchMode.ONLINE -> MaterialTheme.colorScheme.primary to "ONLINE"
        ResearchMode.CACHE -> MaterialTheme.colorScheme.tertiary to "CACHE"
        ResearchMode.MEMORY -> MaterialTheme.colorScheme.secondary to "MEMORY"
        ResearchMode.OFFLINE -> MaterialTheme.colorScheme.error to "OFFLINE"
    }
    
    Surface(
        color = color.copy(alpha = 0.2f),
        shape = RoundedCornerShape(16.dp)
    ) {
        Text(
            text = text,
            color = color,
            style = MaterialTheme.typography.labelSmall,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
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
                "Research Quality: ${research.qualityLevel.name}",
                style = MaterialTheme.typography.labelMedium,
                color = color
            )
            Text(
                "Provider: ${research.provider} • Score: ${research.qualityScore}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        
        if (research.qualityScore > 0) {
            Text(
                "${research.qualityScore}",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }
    }
}

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
                    Icon(
                        Icons.Default.Wifi,
                        "Research used",
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                } else {
                    Icon(
                        Icons.Default.WifiOff,
                        "Local only",
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.outline
                    )
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
    
    ModalBottomSheet(onDismissRequest = onDismiss) {
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
            
            // Mode
            Text("Mode: ${debugInfo.mode.name}", style = MaterialTheme.typography.bodyLarge)
            Text("Last Provider: ${debugInfo.lastProvider ?: "none"}", style = MaterialTheme.typography.bodyMedium)
            Text("Quality Threshold: ${debugInfo.qualityThreshold}", style = MaterialTheme.typography.bodyMedium)
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Provider Health
            Text("Provider Health", style = MaterialTheme.typography.titleMedium)
            providerHealth.forEach { (key, health) ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        if (health.isHealthy) Icons.Default.CheckCircle else Icons.Default.Error,
                        null,
                        tint = if (health.isHealthy) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.error
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(key, modifier = Modifier.weight(1f))
                    Text(
                        if (health.apiKeyConfigured) "🔑" else "⚠️",
                        style = MaterialTheme.typography.bodySmall
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("${health.successRate}%", style = MaterialTheme.typography.bodySmall)
                }
                health.lastError?.let { error ->
                    Text(
                        "  Error: $error",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.error
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}
