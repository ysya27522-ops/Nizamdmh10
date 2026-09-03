import { useState, useEffect, useCallback, useMemo } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  logout,
  getAccessToken,
  setAccessToken,
} from './lib/firebase';
import {
  listDriveFiles,
  getDriveAbout,
  createDriveFolder,
  uploadDriveFile,
  createDriveDocument,
  updateDriveFile,
  deleteDriveFilePermanently,
  emptyDriveTrash,
  isFolder,
} from './lib/driveApi';
import {
  DriveAbout,
  DriveFile,
  DriveViewSection,
  FileFilterType,
  FolderBreadcrumb,
  SortField,
  SortOrder,
  AdvancedSearchFilters,
} from './types';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Breadcrumbs } from './components/Breadcrumbs';
import { Toolbar } from './components/Toolbar';
import { FileCard } from './components/FileCard';
import { FileRow } from './components/FileRow';
import { FileInspector } from './components/FileInspector';
import { NewFolderModal } from './components/NewFolderModal';
import { RenameModal } from './components/RenameModal';
import { UploadModal } from './components/UploadModal';
import { NewDocumentModal } from './components/NewDocumentModal';
import { DocumentReaderModal } from './components/DocumentReaderModal';
import { NizamReportView } from './components/NizamReportView';
import { SignInView } from './components/SignInView';
import { AdvancedSearchPanel } from './components/AdvancedSearchPanel';
import {
  Loader2,
  FolderOpen,
  AlertCircle,
  FolderPlus,
  UploadCloud,
  CheckCircle2,
  FileText,
  RotateCcw,
} from 'lucide-react';

const initialSearchFilters: AdvancedSearchFilters = {
  query: '',
  ownerType: 'any',
  ownerEmail: '',
  datePreset: 'any',
  dateField: 'modifiedTime',
  startDate: '',
  endDate: '',
  fileType: 'all',
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);

  // Drive state
  const [about, setAbout] = useState<DriveAbout | null>(null);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Navigation & Filter state
  const [currentSection, setCurrentSection] = useState<DriveViewSection>('my-drive');
  const [currentTypeFilter, setCurrentTypeFilter] = useState<FileFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<AdvancedSearchFilters>(initialSearchFilters);
  const [breadcrumbs, setBreadcrumbs] = useState<FolderBreadcrumb[]>([
    { id: 'root', name: 'ملفاتي (My Drive)' },
  ]);

  const hasActiveSearchFilters = useMemo(() => {
    return Boolean(
      searchFilters.query.trim() ||
        searchFilters.ownerType !== 'any' ||
        searchFilters.datePreset !== 'any' ||
        searchFilters.startDate ||
        searchFilters.endDate ||
        searchFilters.fileType !== 'all'
    );
  }, [searchFilters]);

  // View & Sort
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortField, setSortField] = useState<SortField>('modifiedTime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Modals & Drawers
  const [selectedFile, setSelectedFile] = useState<DriveFile | null>(null);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isNewDocOpen, setIsNewDocOpen] = useState(false);
  const [readingFile, setReadingFile] = useState<DriveFile | null>(null);
  const [isExportingNizam, setIsExportingNizam] = useState(false);
  const [renameTarget, setRenameTarget] = useState<DriveFile | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(
    null
  );

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentFolder = breadcrumbs[breadcrumbs.length - 1];

  // 1. Initialize Auth on Mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, accessToken) => {
        setUser(currentUser);
        setToken(accessToken);
        setNeedsAuth(false);
        setAuthChecking(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
        setAuthChecking(false);
      }
    );

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Fetch user storage quota & about info
  const fetchAbout = useCallback(async (authToken: string) => {
    try {
      const data = await getDriveAbout(authToken);
      setAbout(data);
    } catch (err) {
      console.warn('Could not fetch storage quota:', err);
    }
  }, []);

  // Search Handlers
  const handleSearchQueryChange = (q: string) => {
    setSearchQuery(q);
    setSearchFilters((prev) => ({ ...prev, query: q }));
    if (q.trim() && currentSection !== 'search') {
      setCurrentSection('search');
    }
  };

  const handleAdvancedFilterChange = (newFilters: AdvancedSearchFilters) => {
    setSearchFilters(newFilters);
    setSearchQuery(newFilters.query);
    if (currentSection !== 'search') {
      setCurrentSection('search');
    }
  };

  const handleResetSearchFilters = () => {
    setSearchFilters(initialSearchFilters);
    setSearchQuery('');
  };

  // Fetch files for current folder / section / filter / search
  const fetchFiles = useCallback(
    async (authToken: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const isSearch =
          currentSection === 'search' ||
          hasActiveSearchFilters ||
          Boolean(searchQuery.trim());

        const res = await listDriveFiles(authToken, {
          folderId: currentFolder?.id || 'root',
          section: currentSection,
          typeFilter: currentTypeFilter,
          searchQuery,
          advancedFilters: isSearch ? searchFilters : undefined,
          pageSize: 100,
        });

        setFiles(res.files || []);
      } catch (err: any) {
        console.error('Error fetching files:', err);
        setError(err?.message || 'تعذر تحميل الملفات من Google Drive');
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentFolder?.id,
      currentSection,
      currentTypeFilter,
      searchQuery,
      searchFilters,
      hasActiveSearchFilters,
    ]
  );

  // Refetch when dependencies change
  useEffect(() => {
    if (token && !needsAuth) {
      fetchFiles(token);
      fetchAbout(token);
    }
  }, [token, needsAuth, fetchFiles, fetchAbout]);

  const handleSignInSuccess = (signedInUser: User, accessToken: string) => {
    setUser(signedInUser);
    setToken(accessToken);
    setAccessToken(accessToken);
    setNeedsAuth(false);
    showToast('تم تسجيل الدخول بنجاح! مرحباً بك في النظام.');
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setFiles([]);
    setAbout(null);
    setNeedsAuth(true);
    showToast('تم تسجيل الخروج بنجاح');
  };

  // Folder navigation
  const handleOpenFolder = (folderId: string, folderName: string) => {
    setBreadcrumbs((prev) => [...prev, { id: folderId, name: folderName }]);
    setSearchQuery('');
  };

  const handleNavigateBreadcrumb = (index: number) => {
    setBreadcrumbs((prev) => prev.slice(0, index + 1));
  };

  const handleGoBack = () => {
    if (breadcrumbs.length > 1) {
      setBreadcrumbs((prev) => prev.slice(0, -1));
    }
  };

  // File Operations
  const handleCreateFolder = async (folderName: string) => {
    if (!token) return;
    const parentId = currentSection === 'my-drive' ? currentFolder.id : 'root';
    await createDriveFolder(token, folderName, parentId);
    showToast(`تم إنشاء المجلد "${folderName}" بنجاح`);
    fetchFiles(token);
  };

  const handleUpload = async (uploadedFiles: File[]) => {
    if (!token) return;
    const parentId = currentSection === 'my-drive' ? currentFolder.id : 'root';

    for (const file of uploadedFiles) {
      await uploadDriveFile(token, file, parentId);
    }

    showToast(`تم رفع ${uploadedFiles.length} ${uploadedFiles.length === 1 ? 'ملف' : 'ملفات'} بنجاح!`);
    fetchFiles(token);
    fetchAbout(token);
  };

  const handleRename = async (fileId: string, newName: string) => {
    if (!token) return;
    await updateDriveFile(token, fileId, { name: newName });
    showToast('تم تعديل الاسم بنجاح');
    fetchFiles(token);
    if (selectedFile?.id === fileId) {
      setSelectedFile((prev) => (prev ? { ...prev, name: newName } : null));
    }
  };

  const handleCreateDocument = async (
    title: string,
    content: string,
    asGoogleDoc: boolean
  ) => {
    if (!token) throw new Error('الرجاء تسجيل الدخول أولاً');
    const parentId = currentSection === 'my-drive' && currentFolder.id !== 'root' ? currentFolder.id : undefined;
    await createDriveDocument(token, title, content, parentId, asGoogleDoc);
    showToast(`تم حفظ المستند "${title}" بنجاح في Google Drive!`);
    fetchFiles(token);
    fetchAbout(token);
  };

  const handleExportNizamToDrive = async (title: string, htmlContent: string) => {
    if (!token) {
      showToast('الرجاء تسجيل الدخول أولاً لحفظ التقرير في Google Drive', 'error');
      return;
    }
    try {
      setIsExportingNizam(true);
      const parentId = currentSection === 'my-drive' && currentFolder.id !== 'root' ? currentFolder.id : undefined;
      await createDriveDocument(token, title, htmlContent, parentId, true);
      showToast('تم إنشاء وحفظ تقرير وثيقة «النظام» بنجاح في Google Drive الخاص بك!');
      fetchFiles(token);
      fetchAbout(token);
    } catch (err: any) {
      console.error('Error exporting constitutional report:', err);
      showToast(err?.message || 'تعذر حفظ المستند في Google Drive', 'error');
    } finally {
      setIsExportingNizam(false);
    }
  };

  const handleToggleStar = async (file: DriveFile) => {
    if (!token) return;
    const newStarred = !file.starred;
    // Optimistic update
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, starred: newStarred } : f))
    );
    if (selectedFile?.id === file.id) {
      setSelectedFile((prev) => (prev ? { ...prev, starred: newStarred } : null));
    }

    try {
      await updateDriveFile(token, file.id, { starred: newStarred });
      showToast(newStarred ? 'تمت إضافة العنصر للمميزة بنجمة' : 'تمت الإزالة من النجمة');
    } catch {
      // Revert on error
      fetchFiles(token);
      showToast('تعذر تحديث حالة التفضيل', 'error');
    }
  };

  const handleMoveToTrash = async (file: DriveFile) => {
    if (!token) return;
    try {
      await updateDriveFile(token, file.id, { trashed: true });
      showToast(`تم نقل "${file.name}" إلى سلة المهملات`);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
      }
      fetchAbout(token);
    } catch (err: any) {
      showToast(err?.message || 'تعذر نقل العنصر للمهملات', 'error');
    }
  };

  const handleRestore = async (file: DriveFile) => {
    if (!token) return;
    try {
      await updateDriveFile(token, file.id, { trashed: false });
      showToast(`تم استعادة "${file.name}" بنجاح`);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
      }
      fetchAbout(token);
    } catch (err: any) {
      showToast(err?.message || 'تعذر استعادة العنصر', 'error');
    }
  };

  const handleDeletePermanently = async (file: DriveFile) => {
    if (!token) return;
    if (!confirm(`هل أنت متأكد من رغبتك في حذف "${file.name}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`)) {
      return;
    }
    try {
      await deleteDriveFilePermanently(token, file.id);
      showToast(`تم حذف "${file.name}" نهائياً`);
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      if (selectedFile?.id === file.id) {
        setSelectedFile(null);
      }
      fetchAbout(token);
    } catch (err: any) {
      showToast(err?.message || 'تعذر حذف العنصر', 'error');
    }
  };

  const handleEmptyTrash = async () => {
    if (!token) return;
    if (!confirm('هل أنت متأكد من تفريغ سلة المهملات بالكامل؟ سيتم حذف جميع الملفات نهائياً.')) {
      return;
    }
    try {
      await emptyDriveTrash(token);
      showToast('تم إفراغ سلة المهملات بالكامل');
      setFiles([]);
      fetchAbout(token);
    } catch (err: any) {
      showToast(err?.message || 'تعذر إفراغ سلة المهملات', 'error');
    }
  };

  // Sorted and prepared files (folders always stay at top unless sorted by size)
  const sortedFiles = useMemo(() => {
    const list = [...files];
    list.sort((a, b) => {
      const aIsFolder = isFolder(a.mimeType);
      const bIsFolder = isFolder(b.mimeType);

      // Keep folders at top unless sorting explicitly by size
      if (sortField !== 'size') {
        if (aIsFolder && !bIsFolder) return -1;
        if (!aIsFolder && bIsFolder) return 1;
      }

      if (sortField === 'name') {
        const comp = a.name.localeCompare(b.name, 'ar');
        return sortOrder === 'asc' ? comp : -comp;
      }

      if (sortField === 'modifiedTime') {
        const aTime = a.modifiedTime ? new Date(a.modifiedTime).getTime() : 0;
        const bTime = b.modifiedTime ? new Date(b.modifiedTime).getTime() : 0;
        return sortOrder === 'asc' ? aTime - bTime : bTime - aTime;
      }

      if (sortField === 'size') {
        const aSize = a.size ? parseInt(a.size, 10) : 0;
        const bSize = b.size ? parseInt(b.size, 10) : 0;
        return sortOrder === 'asc' ? aSize - bSize : bSize - aSize;
      }

      return 0;
    });
    return list;
  }, [files, sortField, sortOrder]);

  // If initial auth check is ongoing
  if (authChecking) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center text-stone-300 gap-4" dir="rtl">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        <p className="text-sm font-medium">جارٍ تهيئة النظام والتحقق من صلاحيات Google Drive...</p>
      </div>
    );
  }

  // If user is not authenticated or access token is missing
  if (needsAuth || !token) {
    return <SignInView onSuccess={handleSignInSuccess} />;
  }

  const isTrash = currentSection === 'trash';
  const sectionTitles: Record<DriveViewSection, string> = {
    'my-drive': 'ملفاتي (My Drive)',
    'shared-with-me': 'المشتركة معي',
    starred: 'المميزة بنجمة',
    trash: 'سلة المهملات',
    'type-filter': 'تصنيف الملفات',
    search: 'البحث المتقدم وتصفية النتائج',
    'nizam-report': 'تقرير وثيقة «النظام الدستوري العربي الإسلامي»',
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 left-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-medium backdrop-blur animate-in fade-in slide-in-from-bottom duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/90 border-rose-500/40 text-rose-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        user={user}
        about={about}
        searchQuery={searchQuery}
        onSearchChange={handleSearchQueryChange}
        onOpenAdvancedSearch={() => setCurrentSection('search')}
        hasActiveFilters={hasActiveSearchFilters}
        onRefresh={() => token && fetchFiles(token)}
        isRefreshing={isLoading}
        onLogout={handleLogout}
      />

      {/* Main App Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={(sec) => {
            setCurrentSection(sec);
            if (sec !== 'search') {
              setSearchQuery('');
              setSearchFilters(initialSearchFilters);
            }
            if (sec === 'my-drive') {
              setBreadcrumbs([{ id: 'root', name: 'ملفاتي (My Drive)' }]);
            }
          }}
          currentTypeFilter={currentTypeFilter}
          onSelectTypeFilter={(filter) => {
            setCurrentTypeFilter(filter);
            setSearchQuery('');
          }}
          onOpenNewFolderModal={() => setIsNewFolderOpen(true)}
          onOpenUploadModal={() => setIsUploadOpen(true)}
          onOpenNewDocModal={() => setIsNewDocOpen(true)}
          about={about}
        />

        {/* Content Area */}
        <main className="flex-1 flex flex-col bg-stone-900/30 overflow-hidden relative">
          {currentSection === 'nizam-report' ? (
            /* Dedicated Nizam Constitutional Report & Document Section */
            <NizamReportView
              onExportToDrive={handleExportNizamToDrive}
              isExporting={isExportingNizam}
            />
          ) : (
            <>
              {/* Breadcrumbs (only for My Drive when not searching) */}
              {currentSection === 'my-drive' && !searchQuery && !hasActiveSearchFilters && (
                <Breadcrumbs
                  breadcrumbs={breadcrumbs}
                  onNavigate={handleNavigateBreadcrumb}
                  onGoBack={handleGoBack}
                  sectionTitle={sectionTitles[currentSection]}
                />
              )}

              {/* Advanced Search Panel when in 'search' section or when actively searching */}
              {(currentSection === 'search' || searchQuery || hasActiveSearchFilters) && (
                <div className="px-6 pt-5 pb-0">
                  <AdvancedSearchPanel
                    filters={searchFilters}
                    onFilterChange={handleAdvancedFilterChange}
                    onResetFilters={handleResetSearchFilters}
                    totalResults={sortedFiles.length}
                    isLoading={isLoading}
                  />
                </div>
              )}

              {/* Toolbar */}
              <Toolbar
                section={currentSection}
                totalCount={sortedFiles.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                sortField={sortField}
                sortOrder={sortOrder}
                onSortChange={(field, order) => {
                  setSortField(field);
                  setSortOrder(order);
                }}
                onEmptyTrash={handleEmptyTrash}
                onNewFolder={() => setIsNewFolderOpen(true)}
                onUpload={() => setIsUploadOpen(true)}
                onNewDocument={() => setIsNewDocOpen(true)}
              />

              {/* Main Files Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="h-64 flex flex-col items-center justify-center text-stone-400 gap-3">
                    <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    <span className="text-xs">جارٍ جلب الملفات من Google Drive...</span>
                  </div>
                ) : error ? (
                  <div className="max-w-lg mx-auto p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-center my-12">
                    <AlertCircle className="w-10 h-10 mx-auto text-rose-400 mb-3" />
                    <h4 className="text-sm font-bold mb-1">تعذر تحميل المحتوى</h4>
                    <p className="text-xs text-rose-400/90 mb-4">{error}</p>
                    <button
                      onClick={() => token && fetchFiles(token)}
                      className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold cursor-pointer"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                ) : sortedFiles.length === 0 ? (
                  /* Empty State */
                  <div className="h-96 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-500 mb-4">
                      <FolderOpen className="w-8 h-8 text-stone-400" />
                    </div>
                    <h3 className="text-base font-bold text-stone-200 mb-1">
                      {currentSection === 'search' || searchQuery || hasActiveSearchFilters
                        ? 'لم يتم العثور على ملفات مطابقة لمعايير البحث'
                        : isTrash
                        ? 'سلة المهملات فارغة'
                        : 'هذا المجلد فارغ حالياً'}
                    </h3>
                    <p className="text-xs text-stone-500 max-w-sm mb-6">
                      {currentSection === 'search' || searchQuery || hasActiveSearchFilters
                        ? 'جرب تعديل كلمة البحث، أو توسيع النطاق الزمني، أو اختيار "أي مالك" لعرض المزيد من النتائج.'
                        : isTrash
                        ? 'العناصر التي تحذفها ستظهر هنا قبل حذفها نهائياً.'
                        : 'يمكنك البدء برفع ملفاتك أو إنشاء مستندات ومجلدات جديدة لتنظيم المحتوى.'}
                    </p>

                    {(currentSection === 'search' || searchQuery || hasActiveSearchFilters) && (
                      <button
                        onClick={handleResetSearchFilters}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>إعادة ضبط جميع معايير البحث</span>
                      </button>
                    )}

                    {!isTrash && !searchQuery && !hasActiveSearchFilters && currentSection !== 'search' && (
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          onClick={() => setIsNewDocOpen(true)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          <span>إنشاء مستند جديد</span>
                        </button>
                        <button
                          onClick={() => setIsUploadOpen(true)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                        >
                          <UploadCloud className="w-4 h-4" />
                          <span>رفع ملف</span>
                        </button>
                        <button
                          onClick={() => setIsNewFolderOpen(true)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-all cursor-pointer"
                        >
                          <FolderPlus className="w-4 h-4 text-amber-400" />
                          <span>إنشاء مجلد</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : viewMode === 'grid' ? (
                  /* Grid View */
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {sortedFiles.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        isTrash={isTrash}
                        onOpenFolder={handleOpenFolder}
                        onSelectFile={(f) => setSelectedFile(f)}
                        onToggleStar={handleToggleStar}
                        onRename={(f) => setRenameTarget(f)}
                        onMoveToTrash={handleMoveToTrash}
                        onRestore={handleRestore}
                        onDeletePermanently={handleDeletePermanently}
                      />
                    ))}
                  </div>
                ) : (
                  /* List View */
                  <div className="bg-stone-900/50 border border-stone-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="border-b border-stone-800 text-[11px] text-stone-400 font-medium bg-stone-950/40">
                          <th className="w-10 px-3 py-3 text-center"></th>
                          <th className="px-3 py-3">الاسم</th>
                          <th className="px-3 py-3 hidden sm:table-cell">المالك</th>
                          <th className="px-3 py-3 hidden md:table-cell">آخر تعديل</th>
                          <th className="px-3 py-3 text-left dir-ltr">الحجم</th>
                          <th className="px-3 py-3 text-left w-20">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedFiles.map((file) => (
                          <FileRow
                            key={file.id}
                            file={file}
                            isTrash={isTrash}
                            onOpenFolder={handleOpenFolder}
                            onSelectFile={(f) => setSelectedFile(f)}
                            onToggleStar={handleToggleStar}
                            onRename={(f) => setRenameTarget(f)}
                            onMoveToTrash={handleMoveToTrash}
                            onRestore={handleRestore}
                            onDeletePermanently={handleDeletePermanently}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {/* File Details Drawer */}
        {selectedFile && (
          <FileInspector
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            onToggleStar={handleToggleStar}
            onRename={(f) => setRenameTarget(f)}
            onMoveToTrash={handleMoveToTrash}
            onRestore={handleRestore}
            onReadDocument={(f) => setReadingFile(f)}
          />
        )}
      </div>

      {/* Modals */}
      <NewFolderModal
        isOpen={isNewFolderOpen}
        onClose={() => setIsNewFolderOpen(false)}
        onCreate={handleCreateFolder}
      />

      <NewDocumentModal
        isOpen={isNewDocOpen}
        onClose={() => setIsNewDocOpen(false)}
        onCreate={handleCreateDocument}
        currentFolderName={currentFolder.name}
      />

      <RenameModal
        file={renameTarget}
        onClose={() => setRenameTarget(null)}
        onRename={handleRename}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUpload}
        currentFolderName={currentFolder.name}
      />

      <DocumentReaderModal
        file={readingFile}
        token={token}
        onClose={() => setReadingFile(null)}
      />
    </div>
  );
}
