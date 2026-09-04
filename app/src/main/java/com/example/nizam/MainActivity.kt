package com.example.nizam

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.DrawerValue
import androidx.compose.material3.ModalDrawerSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarDuration
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.rememberDrawerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.nizam.data.local.AppDatabase
import com.example.nizam.data.model.DriveViewSection
import com.example.nizam.data.repository.DriveRepository
import com.example.nizam.ui.components.AdvancedSearchSheet
import com.example.nizam.ui.components.AppNavbar
import com.example.nizam.ui.components.AppSidebar
import com.example.nizam.ui.components.DocumentReaderDialog
import com.example.nizam.ui.components.NewDocumentDialog
import com.example.nizam.ui.components.NewFolderDialog
import com.example.nizam.ui.components.RenameDialog
import com.example.nizam.ui.screens.DriveHomeScreen
import com.example.nizam.ui.screens.NizamReportScreen
import com.example.nizam.ui.theme.NizamTheme
import com.example.nizam.ui.theme.Stone950
import com.example.nizam.viewmodel.DriveViewModel
import com.example.nizam.viewmodel.DriveViewModelFactory
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        val database = AppDatabase.getDatabase(applicationContext)
        val repository = DriveRepository(database.driveFileDao())
        val viewModelFactory = DriveViewModelFactory(repository)

        setContent {
            NizamTheme {
                // Set RTL layout direction for authentic Arabic constitutional application
                CompositionLocalProvider(LocalLayoutDirection provides LayoutDirection.Rtl) {
                    val viewModel: DriveViewModel = viewModel(factory = viewModelFactory)
                    MainApp(viewModel = viewModel)
                }
            }
        }
    }
}

@Composable
fun MainApp(viewModel: DriveViewModel) {
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val scope = rememberCoroutineScope()
    val snackbarHostState = remember { SnackbarHostState() }

    val currentSection by viewModel.currentSection.collectAsState()
    val files by viewModel.files.collectAsState()
    val breadcrumbs by viewModel.breadcrumbs.collectAsState()
    val filterType by viewModel.filterType.collectAsState()
    val searchFilters by viewModel.searchFilters.collectAsState()
    val sortField by viewModel.sortField.collectAsState()
    val sortOrder by viewModel.sortOrder.collectAsState()
    val viewLayoutMode by viewModel.viewLayoutMode.collectAsState()
    val aboutInfo by viewModel.aboutInfo.collectAsState()

    val selectedFileForReader by viewModel.selectedFileForReader.collectAsState()
    val fileToRename by viewModel.fileToRename.collectAsState()
    val showNewFolderDialog by viewModel.showNewFolderDialog.collectAsState()
    val showNewDocumentDialog by viewModel.showNewDocumentDialog.collectAsState()
    val showSearchSheet by viewModel.showSearchSheet.collectAsState()

    // Handle snackbar events from ViewModel
    LaunchedEffect(Unit) {
        viewModel.snackbarMessage.collectLatest { message ->
            snackbarHostState.showSnackbar(
                message = message,
                duration = SnackbarDuration.Short
            )
        }
    }

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            ModalDrawerSheet {
                AppSidebar(
                    currentSection = currentSection,
                    aboutInfo = aboutInfo,
                    onSelectSection = { section ->
                        viewModel.selectSection(section)
                        scope.launch { drawerState.close() }
                    },
                    onNewFolder = {
                        scope.launch { drawerState.close() }
                        viewModel.setShowNewFolderDialog(true)
                    },
                    onNewDocument = {
                        scope.launch { drawerState.close() }
                        viewModel.setShowNewDocumentDialog(true)
                    }
                )
            }
        }
    ) {
        Scaffold(
            snackbarHost = { SnackbarHost(snackbarHostState) },
            topBar = {
                AppNavbar(
                    searchQuery = searchFilters.query,
                    searchFilters = searchFilters,
                    layoutMode = viewLayoutMode,
                    onSearchChange = { viewModel.updateSearchQuery(it) },
                    onToggleLayoutMode = { viewModel.toggleViewMode() },
                    onOpenSearchSheet = { viewModel.setShowSearchSheet(true) },
                    onOpenDrawer = { scope.launch { drawerState.open() } }
                )
            },
            containerColor = Stone950
        ) { paddingValues ->
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .background(Stone950)
            ) {
                if (currentSection == DriveViewSection.NIZAM_REPORT) {
                    NizamReportScreen(
                        onExportToDrive = { viewModel.exportNizamReportToDrive() }
                    )
                } else {
                    DriveHomeScreen(
                        files = files,
                        currentSection = currentSection,
                        breadcrumbs = breadcrumbs,
                        activeFilterType = filterType,
                        sortField = sortField,
                        sortOrder = sortOrder,
                        layoutMode = viewLayoutMode,
                        onFileClick = { file ->
                            if (file.isFolder) {
                                viewModel.openFolder(file)
                            } else {
                                viewModel.openFileForReading(file)
                            }
                        },
                        onToggleStar = { viewModel.toggleStar(it) },
                        onRename = { viewModel.openRenameDialog(it) },
                        onMoveToTrash = { viewModel.moveToTrash(it) },
                        onRestore = { viewModel.restoreFile(it) },
                        onDeletePermanently = { viewModel.deletePermanently(it) },
                        onEmptyTrash = { viewModel.emptyTrash() },
                        onSelectFilterType = { viewModel.setFilterType(it) },
                        onSortChange = { viewModel.setSort(it) },
                        onBreadcrumbClick = { viewModel.navigateToBreadcrumb(it) },
                        onNavigateUp = { viewModel.navigateUp() },
                        onNewFolderClick = { viewModel.setShowNewFolderDialog(true) },
                        onNewDocumentClick = { viewModel.setShowNewDocumentDialog(true) }
                    )
                }
            }
        }
    }

    // Modal Dialogs
    if (showNewFolderDialog) {
        NewFolderDialog(
            onDismiss = { viewModel.setShowNewFolderDialog(false) },
            onConfirm = { viewModel.createFolder(it) }
        )
    }

    if (showNewDocumentDialog) {
        NewDocumentDialog(
            onDismiss = { viewModel.setShowNewDocumentDialog(false) },
            onConfirm = { title, content, asDoc -> viewModel.createDocument(title, content, asDoc) }
        )
    }

    if (fileToRename != null) {
        RenameDialog(
            file = fileToRename!!,
            onDismiss = { viewModel.closeRenameDialog() },
            onConfirm = { viewModel.renameFile(fileToRename!!, it) }
        )
    }

    if (selectedFileForReader != null) {
        DocumentReaderDialog(
            file = selectedFileForReader!!,
            onDismiss = { viewModel.closeReader() }
        )
    }

    if (showSearchSheet) {
        AdvancedSearchSheet(
            initialFilters = searchFilters,
            onApplyFilters = { viewModel.updateSearchFilters(it) },
            onResetFilters = { viewModel.clearSearchFilters() },
            onDismiss = { viewModel.setShowSearchSheet(false) }
        )
    }
}
