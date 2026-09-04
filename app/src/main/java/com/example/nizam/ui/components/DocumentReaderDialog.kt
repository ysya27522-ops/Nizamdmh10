package com.example.nizam.ui.components

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.OpenInBrowser
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import com.example.nizam.data.model.DriveFile
import com.example.nizam.ui.theme.Emerald400
import com.example.nizam.ui.theme.Emerald500
import com.example.nizam.ui.theme.Emerald950
import com.example.nizam.ui.theme.Stone400
import com.example.nizam.ui.theme.Stone700
import com.example.nizam.ui.theme.Stone800
import com.example.nizam.ui.theme.Stone850
import com.example.nizam.ui.theme.Stone900
import com.example.nizam.ui.theme.Stone950

@Composable
fun DocumentReaderDialog(
    file: DriveFile,
    onDismiss: () -> Unit
) {
    val context = LocalContext.current
    var copyStatus by remember { mutableStateOf<String?>(null) }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            color = Stone950,
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Stone900, RoundedCornerShape(16.dp))
                    .padding(16.dp)
            ) {
                // Header: Title & Close
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(
                            imageVector = getFileIcon(file),
                            contentDescription = null,
                            tint = getFileBadgeColor(file),
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = file.name,
                                style = MaterialTheme.typography.titleLarge,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = "تاريخ التعديل: ${formatDate(file.modifiedTime)} • ${formatFileSize(file.size)}",
                                style = MaterialTheme.typography.labelSmall,
                                color = Stone400
                            )
                        }
                    }

                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier.testTag("close_reader_btn")
                    ) {
                        Icon(
                            imageVector = Icons.Default.Close,
                            contentDescription = "إغلاق",
                            tint = Color.White
                        )
                    }
                }

                Divider(color = Stone800, modifier = Modifier.padding(vertical = 12.dp))

                // Actions Bar
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Button(
                        onClick = {
                            val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                            val clip = ClipData.newPlainText(file.name, file.content)
                            clipboard.setPrimaryClip(clip)
                            copyStatus = "تم النسخ للحافظة!"
                        },
                        shape = RoundedCornerShape(8.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Stone800,
                            contentColor = Color.White
                        ),
                        modifier = Modifier.testTag("copy_content_btn")
                    ) {
                        Icon(Icons.Default.ContentCopy, contentDescription = null, tint = Emerald400, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(copyStatus ?: "نسخ النص")
                    }

                    val wordCount = file.content.split("\\s+".toRegex()).filter { it.isNotBlank() }.size
                    Box(
                        modifier = Modifier
                            .background(Stone800, RoundedCornerShape(8.dp))
                            .padding(horizontal = 12.dp, vertical = 8.dp)
                    ) {
                        Text(
                            text = "$wordCount كلمة",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Stone400
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Scrollable Content
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Stone850),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Stone800),
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth()
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(16.dp)
                            .verticalScroll(rememberScrollState())
                    ) {
                        if (file.content.isNotBlank()) {
                            Text(
                                text = file.content,
                                style = MaterialTheme.typography.bodyLarge,
                                color = Color(0xFFE4E4E7),
                                lineHeight = 26.sp
                            )
                        } else {
                            Text(
                                text = "هذا الملف لا يحتوي على نص قابل للعرض مباشرة أو أنه ملف ثنائي.",
                                style = MaterialTheme.typography.bodyMedium,
                                color = Stone400
                            )
                        }
                    }
                }
            }
        }
    }
}
