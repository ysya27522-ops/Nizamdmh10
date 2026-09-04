package com.example.nizam.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDownward
import androidx.compose.material.icons.filled.ArrowUpward
import androidx.compose.material.icons.filled.CreateNewFolder
import androidx.compose.material.icons.filled.DeleteSweep
import androidx.compose.material.icons.filled.FolderOpen
import androidx.compose.material.icons.filled.NoteAdd
import androidx.compose.material.icons.filled.Sort
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.example.nizam.data.model.DriveFile
import com.example.nizam.data.model.DriveViewSection
import com.example.nizam.data.model.FileFilterType
import com.example.nizam.data.model.FolderBreadcrumb
import com.example.nizam.data.model.SortField
import com.example.nizam.data.model.SortOrder
import com.example.nizam.ui.components.BreadcrumbsBar
import com.example.nizam.ui.components.FileCard
import com.example.nizam.ui.components.FileRow
import com.example.nizam.ui.theme.Emerald400
import com.example.nizam.ui.theme.Emerald500
import com.example.nizam.ui.theme.Rose500
import com.example.nizam.ui.theme.Sky500
import com.example.nizam.ui.theme.Stone400
import com.example.nizam.ui.theme.Stone700
import com.example.nizam.ui.theme.Stone800
import com.example.nizam.ui.theme.Stone850
import com.example.nizam.ui.theme.Stone950
import com.example.nizam.viewmodel.ViewLayoutMode

@Composable
fun DriveHomeScreen(
    files: List<DriveFile>,
    currentSection: DriveViewSection,
    breadcrumbs: List<FolderBreadcrumb>,
    activeFilterType: FileFilterType,
    sortField: SortField,
    sortOrder: SortOrder,
    layoutMode: ViewLayoutMode,
    onFileClick: (DriveFile) -> Unit,
    onToggleStar: (DriveFile) -> Unit,
    onRename: (DriveFile) -> Unit,
    onMoveToTrash: (DriveFile) -> Unit,
    onRestore: (DriveFile) -> Unit,
    onDeletePermanently: (DriveFile) -> Unit,
    onEmptyTrash: () -> Unit,
    onSelectFilterType: (FileFilterType) -> Unit,
    onSortChange: (SortField) -> Unit,
    onBreadcrumbClick: (Int) -> Unit,
    onNavigateUp: () -> Unit,
    onNewFolderClick: () -> Unit,
    onNewDocumentClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    var sortMenuExpanded by remember { mutableStateOf(false) }
    var showEmptyTrashConfirm by remember { mutableStateOf(false) }
    var fabMenuExpanded by remember { mutableStateOf(false) }

    Box(modifier = modifier.fillMaxSize().background(Stone950)) {
        Column(modifier = Modifier.fillMaxSize()) {
            // 1. Breadcrumbs (if in MY_DRIVE)
            if (currentSection == DriveViewSection.MY_DRIVE) {
                BreadcrumbsBar(
                    breadcrumbs = breadcrumbs,
                    onBreadcrumbClick = onBreadcrumbClick,
                    onNavigateUp = onNavigateUp,
                    canNavigateUp = breadcrumbs.size > 1
                )
            } else {
                // Section Title Banner
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween,
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(Stone850)
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                ) {
                    Text(
                        text = currentSection.titleArabic,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    if (currentSection == DriveViewSection.TRASH && files.isNotEmpty()) {
                        Button(
                            onClick = { showEmptyTrashConfirm = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Rose500),
                            shape = RoundedCornerShape(8.dp),
                            modifier = Modifier.testTag("empty_trash_button")
                        ) {
                            Icon(Icons.Default.DeleteSweep, contentDescription = null, modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("تفريغ سلة المهملات")
                        }
                    }
                }
            }

            // 2. Filter chips & Sorting toolbar
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                // Horizontal scroll for filter chips
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    modifier = Modifier
                        .weight(1f)
                        .horizontalScroll(rememberScrollState())
                ) {
                    FileFilterType.values().forEach { filter ->
                        FilterChip(
                            selected = activeFilterType == filter,
                            onClick = { onSelectFilterType(filter) },
                            label = { Text(filter.titleArabic) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = Emerald500,
                                selectedLabelColor = Color.White,
                                containerColor = Stone800,
                                labelColor = Color.LightGray
                            )
                        )
                    }
                }

                // Sort Dropdown button
                Box {
                    IconButton(
                        onClick = { sortMenuExpanded = true },
                        modifier = Modifier.testTag("sort_button")
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Sort, contentDescription = "ترتيب", tint = Color.LightGray)
                            Icon(
                                imageVector = if (sortOrder == SortOrder.ASC) Icons.Default.ArrowUpward else Icons.Default.ArrowDownward,
                                contentDescription = null,
                                tint = Emerald400,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }

                    DropdownMenu(
                        expanded = sortMenuExpanded,
                        onDismissRequest = { sortMenuExpanded = false },
                        modifier = Modifier.background(Stone800)
                    ) {
                        SortField.values().forEach { field ->
                            DropdownMenuItem(
                                text = {
                                    Text(
                                        text = "${field.titleArabic} ${if (sortField == field) "✓" else ""}",
                                        color = if (sortField == field) Emerald400 else Color.White
                                    )
                                },
                                onClick = {
                                    sortMenuExpanded = false
                                    onSortChange(field)
                                }
                            )
                        }
                    }
                }
            }

            // 3. File List or Grid
            if (files.isEmpty()) {
                // Empty state
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(32.dp)
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.FolderOpen,
                            contentDescription = null,
                            tint = Stone700,
                            modifier = Modifier.size(72.dp)
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = if (currentSection == DriveViewSection.TRASH) "سلة المهملات فارغة" else "لا توجد ملفات هنا",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (currentSection == DriveViewSection.TRASH)
                                "الملفات التي تنقلها إلى سلة المهملات ستظهر هنا"
                            else
                                "انقر على زر الإضافة لإنشاء مجلد جديد أو مستند في هذا المسار",
                            style = MaterialTheme.typography.bodyMedium,
                            color = Stone400,
                            textAlign = TextAlign.Center
                        )
                    }
                }
            } else {
                if (layoutMode == ViewLayoutMode.GRID) {
                    LazyVerticalGrid(
                        columns = GridCells.Adaptive(minSize = 160.dp),
                        contentPadding = PaddingValues(12.dp),
                        horizontalArrangement = Arrangement.spacedBy(10.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                        modifier = Modifier
                            .fillMaxSize()
                            .testTag("file_grid")
                    ) {
                        items(files, key = { it.id }) { file ->
                            FileCard(
                                file = file,
                                onClick = { onFileClick(file) },
                                onToggleStar = { onToggleStar(file) },
                                onRename = { onRename(file) },
                                onMoveToTrash = { onMoveToTrash(file) },
                                onRestore = { onRestore(file) },
                                onDeletePermanently = { onDeletePermanently(file) }
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier
                            .fillMaxSize()
                            .testTag("file_list")
                    ) {
                        items(files, key = { it.id }) { file ->
                            FileRow(
                                file = file,
                                onClick = { onFileClick(file) },
                                onToggleStar = { onToggleStar(file) },
                                onRename = { onRename(file) },
                                onMoveToTrash = { onMoveToTrash(file) },
                                onRestore = { onRestore(file) },
                                onDeletePermanently = { onDeletePermanently(file) }
                            )
                        }
                    }
                }
            }
        }

        // Floating Action Button (+ جديد)
        if (currentSection == DriveViewSection.MY_DRIVE) {
            Box(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(24.dp)
            ) {
                FloatingActionButton(
                    onClick = { fabMenuExpanded = true },
                    containerColor = Emerald500,
                    contentColor = Color.White,
                    shape = CircleShape,
                    modifier = Modifier.testTag("main_fab_new")
                ) {
                    Icon(Icons.Default.Add, contentDescription = "إضافة جديد")
                }

                DropdownMenu(
                    expanded = fabMenuExpanded,
                    onDismissRequest = { fabMenuExpanded = false },
                    modifier = Modifier.background(Stone850)
                ) {
                    DropdownMenuItem(
                        text = { Text("مجلد جديد", color = Color.White) },
                        leadingIcon = {
                            Icon(Icons.Default.CreateNewFolder, contentDescription = null, tint = Emerald400)
                        },
                        onClick = {
                            fabMenuExpanded = false
                            onNewFolderClick()
                        }
                    )
                    DropdownMenuItem(
                        text = { Text("مستند جديد", color = Color.White) },
                        leadingIcon = {
                            Icon(Icons.Default.NoteAdd, contentDescription = null, tint = Sky500)
                        },
                        onClick = {
                            fabMenuExpanded = false
                            onNewDocumentClick()
                        }
                    )
                }
            }
        }

        // Empty Trash Confirmation Dialog
        if (showEmptyTrashConfirm) {
            AlertDialog(
                onDismissRequest = { showEmptyTrashConfirm = false },
                containerColor = Stone850,
                title = { Text("تأكيد تفريغ سلة المهملات", color = Color.White) },
                text = {
                    Text(
                        "سيتم حذف جميع العناصر الموجودة في سلة المهملات نهائياً ولا يمكن استعادتها. هل أنت متأكد؟",
                        color = Color.LightGray
                    )
                },
                confirmButton = {
                    Button(
                        onClick = {
                            showEmptyTrashConfirm = false
                            onEmptyTrash()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Rose500)
                    ) {
                        Text("تفريغ نهائي")
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showEmptyTrashConfirm = false }) {
                        Text("إلغاء", color = Color.LightGray)
                    }
                }
            )
        }
    }
}
