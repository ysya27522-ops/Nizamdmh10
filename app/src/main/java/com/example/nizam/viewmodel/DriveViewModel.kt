package com.example.nizam.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.nizam.data.model.DriveAbout
import com.example.nizam.data.model.DriveFile
import com.example.nizam.data.model.DriveViewSection
import com.example.nizam.data.model.FileFilterType
import com.example.nizam.data.model.FolderBreadcrumb
import com.example.nizam.data.model.NizamConstitutionalReportData
import com.example.nizam.data.model.SearchFilters
import com.example.nizam.data.model.SortField
import com.example.nizam.data.model.SortOrder
import com.example.nizam.data.repository.DriveRepository
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

enum class ViewLayoutMode {
    GRID,
    LIST
}

class DriveViewModel(private val repository: DriveRepository) : ViewModel() {

    private val _currentSection = MutableStateFlow(DriveViewSection.MY_DRIVE)
    val currentSection: StateFlow<DriveViewSection> = _currentSection.asStateFlow()

    private val _currentFolderId = MutableStateFlow("root")
    val currentFolderId: StateFlow<String> = _currentFolderId.asStateFlow()

    private val _breadcrumbs = MutableStateFlow(listOf(FolderBreadcrumb("root", "ملفاتي (My Drive)")))
    val breadcrumbs: StateFlow<List<FolderBreadcrumb>> = _breadcrumbs.asStateFlow()

    private val _filterType = MutableStateFlow(FileFilterType.ALL)
    val filterType: StateFlow<FileFilterType> = _filterType.asStateFlow()

    private val _searchFilters = MutableStateFlow(SearchFilters())
    val searchFilters: StateFlow<SearchFilters> = _searchFilters.asStateFlow()

    private val _sortField = MutableStateFlow(SortField.NAME)
    val sortField: StateFlow<SortField> = _sortField.asStateFlow()

    private val _sortOrder = MutableStateFlow(SortOrder.ASC)
    val sortOrder: StateFlow<SortOrder> = _sortOrder.asStateFlow()

    private val _viewLayoutMode = MutableStateFlow(ViewLayoutMode.GRID)
    val viewLayoutMode: StateFlow<ViewLayoutMode> = _viewLayoutMode.asStateFlow()

    private val _aboutInfo = MutableStateFlow(repository.getAboutInfo())
    val aboutInfo: StateFlow<DriveAbout> = _aboutInfo.asStateFlow()

    private val _selectedFileForReader = MutableStateFlow<DriveFile?>(null)
    val selectedFileForReader: StateFlow<DriveFile?> = _selectedFileForReader.asStateFlow()

    private val _fileToRename = MutableStateFlow<DriveFile?>(null)
    val fileToRename: StateFlow<DriveFile?> = _fileToRename.asStateFlow()

    private val _showNewFolderDialog = MutableStateFlow(false)
    val showNewFolderDialog: StateFlow<Boolean> = _showNewFolderDialog.asStateFlow()

    private val _showNewDocumentDialog = MutableStateFlow(false)
    val showNewDocumentDialog: StateFlow<Boolean> = _showNewDocumentDialog.asStateFlow()

    private val _showSearchSheet = MutableStateFlow(false)
    val showSearchSheet: StateFlow<Boolean> = _showSearchSheet.asStateFlow()

    private val _snackbarMessage = MutableSharedFlow<String>()
    val snackbarMessage: SharedFlow<String> = _snackbarMessage.asSharedFlow()

    init {
        viewModelScope.launch {
            repository.checkAndSeedDatabase()
        }
    }

    @OptIn(ExperimentalCoroutinesApi::class)
    val files: StateFlow<List<DriveFile>> = combine(
        _currentFolderId,
        _currentSection,
        _filterType,
        _searchFilters,
        _sortField,
        _sortOrder
    ) { folderId, section, filter, search, field, order ->
        FilterState(folderId, section, filter, search, field, order)
    }.flatMapLatest { state ->
        repository.getFilesStream(
            currentFolderId = state.folderId,
            section = state.section,
            filterType = state.filter,
            searchFilters = state.search,
            sortField = state.field,
            sortOrder = state.order
        )
    }.stateIn(
        scope = viewModelScope,
        started = SharingStarted.WhileSubscribed(5000),
        initialValue = emptyList()
    )

    private data class FilterState(
        val folderId: String,
        val section: DriveViewSection,
        val filter: FileFilterType,
        val search: SearchFilters,
        val field: SortField,
        val order: SortOrder
    )

    fun selectSection(section: DriveViewSection) {
        _currentSection.value = section
        if (section == DriveViewSection.MY_DRIVE) {
            // keep current folder or return to root
        }
    }

    fun openFolder(folder: DriveFile) {
        _currentFolderId.value = folder.id
        _breadcrumbs.value = _breadcrumbs.value + FolderBreadcrumb(folder.id, folder.name)
    }

    fun navigateToBreadcrumb(index: Int) {
        val currentList = _breadcrumbs.value
        if (index in currentList.indices) {
            val target = currentList[index]
            _currentFolderId.value = target.id
            _breadcrumbs.value = currentList.subList(0, index + 1)
        }
    }

    fun navigateUp(): Boolean {
        val currentList = _breadcrumbs.value
        if (currentList.size > 1) {
            val newList = currentList.dropLast(1)
            _breadcrumbs.value = newList
            _currentFolderId.value = newList.last().id
            return true
        }
        return false
    }

    fun toggleViewMode() {
        _viewLayoutMode.value = if (_viewLayoutMode.value == ViewLayoutMode.GRID) {
            ViewLayoutMode.LIST
        } else {
            ViewLayoutMode.GRID
        }
    }

    fun setSort(field: SortField) {
        if (_sortField.value == field) {
            _sortOrder.value = if (_sortOrder.value == SortOrder.ASC) SortOrder.DESC else SortOrder.ASC
        } else {
            _sortField.value = field
            _sortOrder.value = SortOrder.ASC
        }
    }

    fun setFilterType(type: FileFilterType) {
        _filterType.value = type
    }

    fun updateSearchQuery(query: String) {
        _searchFilters.value = _searchFilters.value.copy(query = query)
    }

    fun updateSearchFilters(filters: SearchFilters) {
        _searchFilters.value = filters
    }

    fun clearSearchFilters() {
        _searchFilters.value = SearchFilters()
    }

    fun toggleStar(file: DriveFile) {
        viewModelScope.launch {
            repository.toggleStar(file.id, file.starred)
            val msg = if (file.starred) "تمت الإزالة من المميزة بنجمة" else "تمت الإضافة للمميزة بنجمة"
            _snackbarMessage.emit(msg)
        }
    }

    fun moveToTrash(file: DriveFile) {
        viewModelScope.launch {
            repository.moveToTrash(file.id)
            _snackbarMessage.emit("تم نقل «${file.name}» إلى سلة المهملات")
        }
    }

    fun restoreFile(file: DriveFile) {
        viewModelScope.launch {
            repository.restoreFile(file.id)
            _snackbarMessage.emit("تمت استعادة «${file.name}»")
        }
    }

    fun deletePermanently(file: DriveFile) {
        viewModelScope.launch {
            repository.deletePermanently(file.id)
            _snackbarMessage.emit("تم حذف «${file.name}» نهائياً")
        }
    }

    fun emptyTrash() {
        viewModelScope.launch {
            repository.emptyTrash()
            _snackbarMessage.emit("تم تفريغ سلة المهملات بالكامل")
        }
    }

    fun createFolder(name: String) {
        if (name.isBlank()) return
        viewModelScope.launch {
            repository.createFolder(name.trim(), _currentFolderId.value)
            _showNewFolderDialog.value = false
            _snackbarMessage.emit("تم إنشاء المجلد «$name» بنجاح")
        }
    }

    fun createDocument(title: String, content: String, asGoogleDoc: Boolean) {
        if (title.isBlank()) return
        viewModelScope.launch {
            repository.createDocument(title.trim(), content, _currentFolderId.value, asGoogleDoc)
            _showNewDocumentDialog.value = false
            _snackbarMessage.emit("تم إنشاء المستند «$title» وحفظه في Drive")
        }
    }

    fun exportNizamReportToDrive() {
        viewModelScope.launch {
            val docName = "تقرير وثيقة النظام الدستوري العربي الإسلامي - نسخة Drive.gdoc"
            repository.createDocument(
                title = docName,
                content = NizamConstitutionalReportData.generateMarkdown(),
                parentId = _currentFolderId.value,
                asGoogleDoc = true
            )
            _snackbarMessage.emit("تم تصدير تقرير وثيقة «النظام الدستوري» إلى ملفاتي بنجاح!")
        }
    }

    fun renameFile(file: DriveFile, newName: String) {
        if (newName.isBlank()) return
        viewModelScope.launch {
            repository.renameFile(file.id, newName.trim())
            _fileToRename.value = null
            _snackbarMessage.emit("تم تغيير اسم الملف إلى «$newName»")
        }
    }

    fun openFileForReading(file: DriveFile) {
        _selectedFileForReader.value = file
    }

    fun closeReader() {
        _selectedFileForReader.value = null
    }

    fun openRenameDialog(file: DriveFile) {
        _fileToRename.value = file
    }

    fun closeRenameDialog() {
        _fileToRename.value = null
    }

    fun setShowNewFolderDialog(show: Boolean) {
        _showNewFolderDialog.value = show
    }

    fun setShowNewDocumentDialog(show: Boolean) {
        _showNewDocumentDialog.value = show
    }

    fun setShowSearchSheet(show: Boolean) {
        _showSearchSheet.value = show
    }
}
