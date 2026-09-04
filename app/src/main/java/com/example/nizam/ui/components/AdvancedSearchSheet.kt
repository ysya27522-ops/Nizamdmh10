package com.example.nizam.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Divider
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.nizam.data.model.DatePreset
import com.example.nizam.data.model.FileFilterType
import com.example.nizam.data.model.OwnerFilter
import com.example.nizam.data.model.SearchFilters
import com.example.nizam.ui.theme.Emerald400
import com.example.nizam.ui.theme.Emerald500
import com.example.nizam.ui.theme.Stone700
import com.example.nizam.ui.theme.Stone800
import com.example.nizam.ui.theme.Stone850
import com.example.nizam.ui.theme.Stone900

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun AdvancedSearchSheet(
    initialFilters: SearchFilters,
    onApplyFilters: (SearchFilters) -> Unit,
    onResetFilters: () -> Unit,
    onDismiss: () -> Unit
) {
    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)

    var query by remember { mutableStateOf(initialFilters.query) }
    var selectedType by remember { mutableStateOf(initialFilters.fileType) }
    var selectedOwner by remember { mutableStateOf(initialFilters.ownerType) }
    var selectedDate by remember { mutableStateOf(initialFilters.datePreset) }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = sheetState,
        containerColor = Stone900
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 12.dp)
        ) {
            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "تصفية متقدمة والبحث في الملفات",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                IconButton(onClick = onDismiss) {
                    Icon(Icons.Default.Close, contentDescription = "إغلاق", tint = Color.LightGray)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Query Input
            OutlinedTextField(
                value = query,
                onValueChange = { query = it },
                label = { Text("الكلمة المفتاحية في العنوان أو المحتوى", color = Color.LightGray) },
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = Stone850,
                    unfocusedContainerColor = Stone850,
                    focusedBorderColor = Emerald500,
                    unfocusedBorderColor = Stone700,
                    focusedTextColor = Color.White,
                    unfocusedTextColor = Color.White
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("filter_sheet_query")
            )

            Spacer(modifier = Modifier.height(16.dp))

            // File Type Chips
            Text(
                text = "نوع الملف:",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = Emerald400
            )
            Spacer(modifier = Modifier.height(6.dp))
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                FileFilterType.values().forEach { type ->
                    FilterChip(
                        selected = selectedType == type,
                        onClick = { selectedType = type },
                        label = { Text(type.titleArabic) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Emerald500,
                            selectedLabelColor = Color.White,
                            containerColor = Stone800,
                            labelColor = Color.LightGray
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Owner Filter
            Text(
                text = "المالك:",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = Emerald400
            )
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                OwnerFilter.values().forEach { owner ->
                    FilterChip(
                        selected = selectedOwner == owner,
                        onClick = { selectedOwner = owner },
                        label = { Text(owner.labelArabic) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Emerald500,
                            selectedLabelColor = Color.White,
                            containerColor = Stone800,
                            labelColor = Color.LightGray
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Date Preset
            Text(
                text = "تاريخ آخر تعديل:",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold,
                color = Emerald400
            )
            Spacer(modifier = Modifier.height(6.dp))
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(6.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                DatePreset.values().forEach { date ->
                    FilterChip(
                        selected = selectedDate == date,
                        onClick = { selectedDate = date },
                        label = { Text(date.labelArabic) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Emerald500,
                            selectedLabelColor = Color.White,
                            containerColor = Stone800,
                            labelColor = Color.LightGray
                        )
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Footer Actions
            Row(
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                TextButton(
                    onClick = {
                        query = ""
                        selectedType = FileFilterType.ALL
                        selectedOwner = OwnerFilter.ANY
                        selectedDate = DatePreset.ANY
                        onResetFilters()
                        onDismiss()
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = Color.LightGray)
                ) {
                    Text("إعادة تعيين")
                }

                Button(
                    onClick = {
                        onApplyFilters(
                            SearchFilters(
                                query = query,
                                fileType = selectedType,
                                ownerType = selectedOwner,
                                datePreset = selectedDate
                            )
                        )
                        onDismiss()
                    },
                    shape = RoundedCornerShape(10.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Emerald500,
                        contentColor = Color.White
                    ),
                    modifier = Modifier.testTag("apply_filters_button")
                ) {
                    Text("تطبيق الفلاتر")
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}
