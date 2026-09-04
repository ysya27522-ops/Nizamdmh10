package com.example.nizam.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material.icons.filled.GridView
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.ViewList
import androidx.compose.material3.Badge
import androidx.compose.material3.BadgedBox
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nizam.data.model.SearchFilters
import com.example.nizam.ui.theme.Emerald400
import com.example.nizam.ui.theme.Emerald500
import com.example.nizam.ui.theme.Stone700
import com.example.nizam.ui.theme.Stone800
import com.example.nizam.ui.theme.Stone900
import com.example.nizam.viewmodel.ViewLayoutMode

@Composable
fun AppNavbar(
    searchQuery: String,
    searchFilters: SearchFilters,
    layoutMode: ViewLayoutMode,
    onSearchChange: (String) -> Unit,
    onToggleLayoutMode: () -> Unit,
    onOpenSearchSheet: () -> Unit,
    onOpenDrawer: () -> Unit,
    modifier: Modifier = Modifier
) {
    Surface(
        color = Stone900,
        tonalElevation = 4.dp,
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 6.dp)
        ) {
            IconButton(
                onClick = onOpenDrawer,
                modifier = Modifier.testTag("menu_button")
            ) {
                Icon(
                    imageVector = Icons.Default.Menu,
                    contentDescription = "القائمة الجانبية",
                    tint = Color.White
                )
            }

            // Logo & Title
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(end = 8.dp)
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(Emerald500)
                ) {
                    Text(
                        text = "ن",
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "النظام",
                    style = MaterialTheme.typography.titleLarge,
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            }

            // Search Bar
            OutlinedTextField(
                value = searchQuery,
                onValueChange = onSearchChange,
                placeholder = {
                    Text(
                        text = "ابحث في الملفات...",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "بحث",
                        tint = Emerald400
                    )
                },
                trailingIcon = {
                    if (searchQuery.isNotEmpty()) {
                        IconButton(onClick = { onSearchChange("") }) {
                            Icon(
                                imageVector = Icons.Default.Close,
                                contentDescription = "مسح البحث",
                                tint = Color.LightGray
                            )
                        }
                    }
                },
                singleLine = true,
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                keyboardActions = KeyboardActions(onSearch = {}),
                shape = RoundedCornerShape(24.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Stone800,
                    unfocusedContainerColor = Stone800,
                    focusedBorderColor = Emerald500,
                    unfocusedBorderColor = Stone700,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                modifier = Modifier
                    .weight(1f)
                    .height(48.dp)
                    .padding(horizontal = 4.dp)
                    .testTag("search_input")
            )

            // Filter button with badge if active
            IconButton(
                onClick = onOpenSearchSheet,
                modifier = Modifier.testTag("filter_button")
            ) {
                if (searchFilters.isActive) {
                    BadgedBox(
                        badge = {
                            Badge(
                                containerColor = Emerald500,
                                modifier = Modifier.size(8.dp)
                            )
                        }
                    ) {
                        Icon(
                            imageVector = Icons.Default.FilterList,
                            contentDescription = "مرشحات متقدمة",
                            tint = Emerald400
                        )
                    }
                } else {
                    Icon(
                        imageVector = Icons.Default.FilterList,
                        contentDescription = "مرشحات متقدمة",
                        tint = Color.White
                    )
                }
            }

            // View toggle (Grid / List)
            IconButton(
                onClick = onToggleLayoutMode,
                modifier = Modifier.testTag("layout_toggle_button")
            ) {
                Icon(
                    imageVector = if (layoutMode == ViewLayoutMode.GRID) Icons.Default.ViewList else Icons.Default.GridView,
                    contentDescription = if (layoutMode == ViewLayoutMode.GRID) "عرض القائمة" else "عرض الشبكة",
                    tint = Color.White
                )
            }
        }
    }
}
