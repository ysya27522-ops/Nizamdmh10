package com.example.nizam.ui.components

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.DeleteForever
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Image
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.PictureAsPdf
import androidx.compose.material.icons.filled.RestoreFromTrash
import androidx.compose.material.icons.filled.Slideshow
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.filled.TableChart
import androidx.compose.material.icons.outlined.StarBorder
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nizam.data.model.DriveFile
import com.example.nizam.ui.theme.Amber400
import com.example.nizam.ui.theme.Blue500
import com.example.nizam.ui.theme.Emerald400
import com.example.nizam.ui.theme.Emerald500
import com.example.nizam.ui.theme.Rose500
import com.example.nizam.ui.theme.Stone400
import com.example.nizam.ui.theme.Stone700
import com.example.nizam.ui.theme.Stone800
import com.example.nizam.ui.theme.Stone850
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun FileCard(
    file: DriveFile,
    onClick: () -> Unit,
    onToggleStar: () -> Unit,
    onRename: () -> Unit,
    onMoveToTrash: () -> Unit,
    onRestore: () -> Unit,
    onDeletePermanently: () -> Unit,
    modifier: Modifier = Modifier
) {
    var menuExpanded by remember { mutableStateOf(false) }

    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Stone850),
        border = androidx.compose.foundation.BorderStroke(1.dp, Stone800),
        modifier = modifier
            .fillMaxWidth()
            .combinedClickable(
                onClick = onClick,
                onLongClick = { menuExpanded = true }
            )
            .testTag("file_card_${file.id}")
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            // Header: Icon, Star, Menu
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(getFileBadgeColor(file).copy(alpha = 0.15f))
                ) {
                    Icon(
                        imageVector = getFileIcon(file),
                        contentDescription = null,
                        tint = getFileBadgeColor(file),
                        modifier = Modifier.size(20.dp)
                    )
                }

                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (!file.trashed) {
                        IconButton(
                            onClick = onToggleStar,
                            modifier = Modifier
                                .size(32.dp)
                                .testTag("star_btn_${file.id}")
                        ) {
                            Icon(
                                imageVector = if (file.starred) Icons.Filled.Star else Icons.Outlined.StarBorder,
                                contentDescription = if (file.starred) "إزالة من المميزة" else "إضافة للمميزة",
                                tint = if (file.starred) Amber400 else Stone700,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    Box {
                        IconButton(
                            onClick = { menuExpanded = true },
                            modifier = Modifier
                                .size(32.dp)
                                .testTag("menu_btn_${file.id}")
                        ) {
                            Icon(
                                imageVector = Icons.Default.MoreVert,
                                contentDescription = "خيارات الملف",
                                tint = Stone400,
                                modifier = Modifier.size(18.dp)
                            )
                        }

                        FileContextMenu(
                            file = file,
                            expanded = menuExpanded,
                            onDismiss = { menuExpanded = false },
                            onToggleStar = onToggleStar,
                            onRename = onRename,
                            onMoveToTrash = onMoveToTrash,
                            onRestore = onRestore,
                            onDeletePermanently = onDeletePermanently
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // File Name
            Text(
                text = file.name,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = Color.White,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Metadata: Date & Size
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = formatDate(file.modifiedTime),
                    style = MaterialTheme.typography.labelSmall,
                    color = Stone400,
                    fontSize = 11.sp
                )
                if (!file.isFolder && file.size > 0) {
                    Text(
                        text = formatFileSize(file.size),
                        style = MaterialTheme.typography.labelSmall,
                        color = Stone400,
                        fontSize = 11.sp
                    )
                }
            }
        }
    }
}

@Composable
fun FileContextMenu(
    file: DriveFile,
    expanded: Boolean,
    onDismiss: () -> Unit,
    onToggleStar: () -> Unit,
    onRename: () -> Unit,
    onMoveToTrash: () -> Unit,
    onRestore: () -> Unit,
    onDeletePermanently: () -> Unit
) {
    DropdownMenu(
        expanded = expanded,
        onDismissRequest = onDismiss,
        modifier = Modifier.background(Stone800)
    ) {
        if (!file.trashed) {
            DropdownMenuItem(
                text = { Text(if (file.starred) "إزالة من المميزة" else "إضافة للمميزة", color = Color.White) },
                leadingIcon = { Icon(Icons.Default.Star, contentDescription = null, tint = Amber400) },
                onClick = {
                    onDismiss()
                    onToggleStar()
                }
            )
            DropdownMenuItem(
                text = { Text("تعديل الاسم", color = Color.White) },
                leadingIcon = { Icon(Icons.Default.Edit, contentDescription = null, tint = Emerald400) },
                onClick = {
                    onDismiss()
                    onRename()
                }
            )
            DropdownMenuItem(
                text = { Text("نقل إلى سلة المهملات", color = Rose500) },
                leadingIcon = { Icon(Icons.Default.Delete, contentDescription = null, tint = Rose500) },
                onClick = {
                    onDismiss()
                    onMoveToTrash()
                }
            )
        } else {
            DropdownMenuItem(
                text = { Text("استعادة الملف", color = Emerald400) },
                leadingIcon = { Icon(Icons.Default.RestoreFromTrash, contentDescription = null, tint = Emerald400) },
                onClick = {
                    onDismiss()
                    onRestore()
                }
            )
            DropdownMenuItem(
                text = { Text("حذف نهائياً", color = Rose500) },
                leadingIcon = { Icon(Icons.Default.DeleteForever, contentDescription = null, tint = Rose500) },
                onClick = {
                    onDismiss()
                    onDeletePermanently()
                }
            )
        }
    }
}

fun getFileIcon(file: DriveFile): ImageVector {
    return when {
        file.isFolder -> Icons.Default.Folder
        file.mimeType.contains("presentation") -> Icons.Default.Slideshow
        file.mimeType.contains("spreadsheet") -> Icons.Default.TableChart
        file.mimeType.contains("pdf") -> Icons.Default.PictureAsPdf
        file.mimeType.contains("image") -> Icons.Default.Image
        else -> Icons.Default.Description
    }
}

fun getFileBadgeColor(file: DriveFile): Color {
    return when {
        file.isFolder -> Emerald400
        file.mimeType.contains("presentation") -> Amber400
        file.mimeType.contains("spreadsheet") -> Emerald500
        file.mimeType.contains("pdf") -> Rose500
        file.mimeType.contains("image") -> Blue500
        else -> Blue500
    }
}

fun formatDate(timeMillis: Long): String {
    val sdf = SimpleDateFormat("dd MMM yyyy", Locale("ar"))
    return sdf.format(Date(timeMillis))
}

fun formatFileSize(bytes: Long): String {
    val kb = bytes / 1024.0
    val mb = kb / 1024.0
    return when {
        mb >= 1.0 -> String.format(Locale.getDefault(), "%.1f ميغابايت", mb)
        kb >= 1.0 -> String.format(Locale.getDefault(), "%.0f كيلوبايت", kb)
        else -> "$bytes بايت"
    }
}
