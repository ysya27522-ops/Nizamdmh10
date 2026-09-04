package com.example.nizam.ui.screens

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.CloudUpload
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.ExpandLess
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.Gavel
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Share
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.nizam.data.model.ConstitutionalSection
import com.example.nizam.data.model.NizamConstitutionalReportData
import com.example.nizam.ui.theme.Amber400
import com.example.nizam.ui.theme.Blue500
import com.example.nizam.ui.theme.Emerald400
import com.example.nizam.ui.theme.Emerald500
import com.example.nizam.ui.theme.Emerald950
import com.example.nizam.ui.theme.Stone300
import com.example.nizam.ui.theme.Stone400
import com.example.nizam.ui.theme.Stone700
import com.example.nizam.ui.theme.Stone800
import com.example.nizam.ui.theme.Stone850
import com.example.nizam.ui.theme.Stone900
import com.example.nizam.ui.theme.Stone950
import com.example.nizam.ui.theme.Teal400

@Composable
fun NizamReportScreen(
    onExportToDrive: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    var selectedSectionId by remember { mutableStateOf<String?>(null) }
    var inReportSearch by remember { mutableStateOf("") }
    var copyStatus by remember { mutableStateOf<String?>(null) }

    // Map tracking expanded state of sections (default all expanded)
    val expandedStates = remember {
        mutableStateMapOf<String, Boolean>().apply {
            NizamConstitutionalReportData.SECTIONS.forEach { this[it.id] = true }
        }
    }

    val filteredSections = remember(selectedSectionId, inReportSearch) {
        var list = NizamConstitutionalReportData.SECTIONS
        if (selectedSectionId != null) {
            list = list.filter { it.id == selectedSectionId }
        }
        if (inReportSearch.isNotBlank()) {
            val q = inReportSearch.trim().lowercase()
            list = list.filter { sec ->
                sec.title.lowercase().contains(q) ||
                sec.subtitle.lowercase().contains(q) ||
                sec.content.lowercase().contains(q) ||
                sec.bullets.any { it.title.lowercase().contains(q) || it.description.lowercase().contains(q) } ||
                sec.tableData.any { it.role.lowercase().contains(q) || it.description.lowercase().contains(q) }
            }
        }
        list
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(Stone950)
    ) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 1. Hero Document Header Card
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Stone900),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Emerald500.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(Emerald950)
                                    .padding(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = NizamConstitutionalReportData.CLASSIFICATION,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Emerald400,
                                    fontWeight = FontWeight.Bold
                                )
                            }

                            Text(
                                text = NizamConstitutionalReportData.VERSION,
                                style = MaterialTheme.typography.labelSmall,
                                color = Stone400
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(
                            text = NizamConstitutionalReportData.TITLE,
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            lineHeight = 32.sp
                        )

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = NizamConstitutionalReportData.SUMMARY,
                            style = MaterialTheme.typography.bodyLarge,
                            color = Stone300,
                            lineHeight = 24.sp
                        )

                        Spacer(modifier = Modifier.height(16.dp))
                        Divider(color = Stone800)
                        Spacer(modifier = Modifier.height(12.dp))

                        // Action Buttons Bar
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Button(
                                onClick = onExportToDrive,
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Emerald500,
                                    contentColor = Color.White
                                ),
                                modifier = Modifier.testTag("export_to_drive_button")
                            ) {
                                Icon(Icons.Default.CloudUpload, contentDescription = null, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text("تصدير إلى Drive")
                            }

                            Button(
                                onClick = {
                                    val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
                                    val clip = ClipData.newPlainText("النظام الدستوري", NizamConstitutionalReportData.generateMarkdown())
                                    clipboard.setPrimaryClip(clip)
                                    copyStatus = "تم النسخ!"
                                },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Stone800,
                                    contentColor = Color.White
                                ),
                                modifier = Modifier.testTag("copy_markdown_button")
                            ) {
                                Icon(Icons.Default.ContentCopy, contentDescription = null, tint = Emerald400, modifier = Modifier.size(18.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(copyStatus ?: "نسخ Markdown")
                            }
                        }
                    }
                }
            }

            // 2. In-Report Search Bar
            item {
                OutlinedTextField(
                    value = inReportSearch,
                    onValueChange = { inReportSearch = it },
                    placeholder = { Text("ابحث في نصوص الوثيقة الدستورية...", color = Stone400) },
                    leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = Emerald400) },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedContainerColor = Stone900,
                        unfocusedContainerColor = Stone900,
                        focusedBorderColor = Emerald500,
                        unfocusedBorderColor = Stone800,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("report_search_input")
                )
            }

            // 3. Section Filter Tabs
            item {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .horizontalScroll(rememberScrollState())
                ) {
                    FilterChip(
                        selected = selectedSectionId == null,
                        onClick = { selectedSectionId = null },
                        label = { Text("جميع الأقسام (${NizamConstitutionalReportData.SECTIONS.size})") },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Emerald500,
                            selectedLabelColor = Color.White,
                            containerColor = Stone900,
                            labelColor = Color.LightGray
                        )
                    )

                    NizamConstitutionalReportData.SECTIONS.forEachIndexed { index, sec ->
                        FilterChip(
                            selected = selectedSectionId == sec.id,
                            onClick = { selectedSectionId = sec.id },
                            label = { Text("${index + 1}. ${sec.id}") },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Emerald500,
                                selectedLabelColor = Color.White,
                                containerColor = Stone900,
                                labelColor = Color.LightGray
                            )
                        )
                    }
                }
            }

            // 4. Render Section Cards
            items(filteredSections, key = { it.id }) { section ->
                val isExpanded = expandedStates[section.id] ?: true

                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = Stone900),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Stone800),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("section_card_${section.id}")
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        // Header with Icon & Collapse Toggle
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { expandedStates[section.id] = !isExpanded }
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(40.dp)
                                    .clip(CircleShape)
                                    .background(Emerald500.copy(alpha = 0.15f))
                            ) {
                                Icon(
                                    imageVector = getSectionIcon(section.iconName),
                                    contentDescription = null,
                                    tint = Emerald400,
                                    modifier = Modifier.size(22.dp)
                                )
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = section.title,
                                    style = MaterialTheme.typography.titleLarge,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                                Text(
                                    text = section.subtitle,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Emerald400
                                )
                            }

                            IconButton(onClick = { expandedStates[section.id] = !isExpanded }) {
                                Icon(
                                    imageVector = if (isExpanded) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                                    contentDescription = if (isExpanded) "طي" else "توسيع",
                                    tint = Stone400
                                )
                            }
                        }

                        // Collapsible Body
                        AnimatedVisibility(visible = isExpanded) {
                            Column(modifier = Modifier.padding(top = 12.dp)) {
                                Divider(color = Stone800)
                                Spacer(modifier = Modifier.height(10.dp))

                                Text(
                                    text = section.content,
                                    style = MaterialTheme.typography.bodyLarge,
                                    color = Stone300,
                                    lineHeight = 22.sp
                                )

                                Spacer(modifier = Modifier.height(12.dp))

                                // Bullets
                                section.bullets.forEach { bullet ->
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(vertical = 4.dp)
                                            .background(Stone850, RoundedCornerShape(8.dp))
                                            .padding(12.dp)
                                    ) {
                                        Column {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Box(
                                                    modifier = Modifier
                                                        .size(6.dp)
                                                        .clip(CircleShape)
                                                        .background(Emerald400)
                                                )
                                                Spacer(modifier = Modifier.width(8.dp))
                                                Text(
                                                    text = bullet.title,
                                                    style = MaterialTheme.typography.titleMedium,
                                                    fontWeight = FontWeight.Bold,
                                                    color = Emerald400
                                                )
                                            }
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Text(
                                                text = bullet.description,
                                                style = MaterialTheme.typography.bodyMedium,
                                                color = Color.LightGray,
                                                lineHeight = 20.sp
                                            )
                                        }
                                    }
                                }

                                // Table (for Authorities Section)
                                if (section.tableData.isNotEmpty()) {
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Column(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .background(Stone850, RoundedCornerShape(10.dp))
                                            .padding(12.dp),
                                        verticalArrangement = Arrangement.spacedBy(10.dp)
                                    ) {
                                        section.tableData.forEach { row ->
                                            Column(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .background(Stone900, RoundedCornerShape(6.dp))
                                                    .padding(10.dp)
                                            ) {
                                                Text(
                                                    text = row.role,
                                                    style = MaterialTheme.typography.titleMedium,
                                                    fontWeight = FontWeight.Bold,
                                                    color = Amber400
                                                )
                                                Spacer(modifier = Modifier.height(4.dp))
                                                Text(
                                                    text = row.description,
                                                    style = MaterialTheme.typography.bodyMedium,
                                                    color = Color.White
                                                )
                                                Spacer(modifier = Modifier.height(4.dp))
                                                Text(
                                                    text = row.notes,
                                                    style = MaterialTheme.typography.labelSmall,
                                                    color = Stone400
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
}

fun getSectionIcon(name: String): ImageVector {
    return when (name) {
        "Scale" -> Icons.Default.Gavel
        "Layers" -> Icons.Default.MenuBook
        "BookOpen" -> Icons.Default.Book
        "ShieldCheck" -> Icons.Default.Shield
        "AutoAwesome" -> Icons.Default.AutoAwesome
        else -> Icons.Default.Bookmark
    }
}
