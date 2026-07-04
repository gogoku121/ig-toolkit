package com.igtoolkit.app

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.lifecycle.ViewModelProvider
import com.igtoolkit.app.ui.MainViewModel
import com.igtoolkit.app.ui.screens.MainScreen
import com.igtoolkit.app.ui.theme.IGTOOLKITTheme

class MainActivity : ComponentActivity() {
    
    private lateinit var viewModel: MainViewModel
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        viewModel = ViewModelProvider(this)[MainViewModel::class.java]
        
        setContent {
            IGTOOLKITTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    MainScreen(
                        viewModel = viewModel,
                        onShare = { text -> shareText(text) },
                        onExport = { text -> exportText(text) }
                    )
                }
            }
        }
    }
    
    private fun shareText(text: String) {
        val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, text)
        }
        startActivity(Intent.createChooser(shareIntent, "Share via"))
    }
    
    private fun exportText(text: String) {
        // For now, just copy to clipboard
        val clipboard = getSystemService(CLIPBOARD_SERVICE) as android.content.ClipboardManager
        val clip = android.content.ClipData.newPlainText("Caption", text)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(this, "Copied to clipboard!", Toast.LENGTH_SHORT).show()
    }
}
