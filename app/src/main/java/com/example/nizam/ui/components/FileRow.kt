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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.StarBorder
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nizam.data.model.DriveFile
import com.example.nizam.ui.theme.Amber400
import com.example.nizam.ui.theme.Stone400
import com.example.nizam.ui.theme.Stone700
import com.example.nizam.ui.theme.Stone800
import com.example.nizam.ui.theme.Stone850

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun FileRow(
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

    Surface(
        color = Stone850,
        shape = RoundedCornerShape(8.dp),
        modifier = modifier
            .fillMaxWidth()
            .combinedClickable(
                onClick = onClick,
                onLongClick = { menuExpanded = true }
            )
            .testTag("file_row_${file.id}")
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 10.dp)
        ) {
            // Icon
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

            Spacer(modifier = Modifier.width(12.dp))

            // Name and details
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = file.name,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium,
                    color = Color.White,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Text(
                        text = formatDate(file.modifiedTime),
                        style = MaterialTheme.typography.labelSmall,
                        color = Stone400,
                        fontSize = 11.sp
                    )
                    if (!file.isFolder && file.size > 0) {
                        Text(
                            text = "•",
                            color = Stone700
                        )
                        Text(
                            text = formatFileSize(file.size),
                            style = MaterialTheme.typography.labelSmall,
                            color = Stone400,
                            fontSize = 11.sp
                        )
                    }
                }
            }

            // Star action
            if (!file.trashed) {
                IconButton(
                    onClick = onToggleStar,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = if (file.starred) Icons.Filled.Star else Icons.Outlined.StarBorder,
                        contentDescription = if (file.starred) "إزالة من المميزة" else "إضافة للمميزة",
                        tint = if (file.starred) Amber400 else Stone700,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }

            // Context Menu
            Box {
                IconButton(
                    onClick = { menuExpanded = true },
                    modifier = Modifier.size(36.dp)
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
}
