package com.example.nizam.ui.components

import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.nizam.data.model.FolderBreadcrumb
import com.example.nizam.ui.theme.Emerald400
import com.example.nizam.ui.theme.Stone700
import com.example.nizam.ui.theme.Stone900

@Composable
fun BreadcrumbsBar(
    breadcrumbs: List<FolderBreadcrumb>,
    onBreadcrumbClick: (Int) -> Unit,
    onNavigateUp: () -> Unit,
    canNavigateUp: Boolean,
    modifier: Modifier = Modifier
) {
    Surface(
        color = Stone900.copy(alpha = 0.6f),
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 4.dp)
                .horizontalScroll(rememberScrollState())
        ) {
            if (canNavigateUp) {
                IconButton(
                    onClick = onNavigateUp,
                    modifier = Modifier.testTag("navigate_up_button")
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "الرجوع للمجلد السابق",
                        tint = Emerald400
                    )
                }
                Spacer(modifier = Modifier.width(4.dp))
            } else {
                Icon(
                    imageVector = Icons.Default.Folder,
                    contentDescription = null,
                    tint = Emerald400,
                    modifier = Modifier.padding(horizontal = 6.dp)
                )
            }

            breadcrumbs.forEachIndexed { index, crumb ->
                val isLast = index == breadcrumbs.size - 1

                TextButton(
                    onClick = { onBreadcrumbClick(index) },
                    enabled = !isLast,
                    modifier = Modifier.testTag("breadcrumb_$index")
                ) {
                    Text(
                        text = crumb.name,
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = if (isLast) FontWeight.Bold else FontWeight.Normal,
                        color = if (isLast) Color.White else Emerald400
                    )
                }

                if (!isLast) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.KeyboardArrowLeft,
                        contentDescription = null,
                        tint = Stone700
                    )
                }
            }
        }
    }
}
