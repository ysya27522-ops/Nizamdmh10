import {
  Folder,
  Users,
  Star,
  Trash2,
  FileText,
  FileSpreadsheet,
  Presentation,
  FileCheck,
  Image,
  Video,
  FileArchive,
  Plus,
  FolderPlus,
  Upload,
  HardDrive,
  Layers,
  Scale,
  Sparkles,
  Search,
} from 'lucide-react';
import { DriveAbout, DriveViewSection, FileFilterType } from '../types';
import { formatBytes } from '../lib/driveApi';

interface SidebarProps {
  currentSection: DriveViewSection;
  onSelectSection: (section: DriveViewSection) => void;
  currentTypeFilter: FileFilterType;
  onSelectTypeFilter: (filter: FileFilterType) => void;
  onOpenNewFolderModal: () => void;
  onOpenUploadModal: () => void;
  onOpenNewDocModal: () => void;
  about: DriveAbout | null;
}

export function Sidebar({
  currentSection,
  onSelectSection,
  currentTypeFilter,
  onSelectTypeFilter,
  onOpenNewFolderModal,
  onOpenUploadModal,
  onOpenNewDocModal,
  about,
}: SidebarProps) {
  // Storage usage calculation
  const usageBytes = about?.storageQuota?.usage ? parseInt(about.storageQuota.usage, 10) : 0;
  const limitBytes = about?.storageQuota?.limit ? parseInt(about.storageQuota.limit, 10) : 0;
  const percentUsed = limitBytes > 0 ? Math.min(100, Math.round((usageBytes / limitBytes) * 100)) : 0;

  return (
    <aside className="w-64 border-l border-stone-800 bg-stone-950/40 p-4 flex flex-col justify-between flex-shrink-0 select-none">
      <div className="space-y-6">
        {/* Quick Action Buttons */}
        <div className="space-y-2">
          {/* New Document Button (Hero Action) */}
          <button
            id="new-document-btn"
            onClick={onOpenNewDocModal}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 active:scale-[0.98] text-white text-xs font-bold shadow-lg shadow-blue-950/40 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>مستند جديد (Google Doc)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              id="upload-file-btn"
              onClick={onOpenUploadModal}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 active:scale-[0.98] text-white text-xs font-semibold shadow transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع ملف</span>
            </button>
            <button
              id="new-folder-btn"
              onClick={onOpenNewFolderModal}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 active:scale-[0.98] text-stone-100 text-xs font-semibold border border-stone-700/60 transition-all cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>مجلد جديد</span>
            </button>
          </div>
        </div>

        {/* Primary Navigation */}
        <div>
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider px-3 mb-1.5">
            الأقسام الرئيسية
          </div>
          <nav className="space-y-0.5">
            {/* Featured Dossier: تقرير ملف النظام */}
            <button
              id="nav-nizam-report"
              onClick={() => {
                onSelectSection('nizam-report');
                onSelectTypeFilter('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentSection === 'nizam-report'
                  ? 'bg-emerald-500/20 text-emerald-200 font-bold border border-emerald-500/40 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>تقرير وثيقة «النظام»</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-emerald-500/30 text-emerald-300 font-bold">
                موثق
              </span>
            </button>

            <button
              id="nav-my-drive"
              onClick={() => {
                onSelectSection('my-drive');
                onSelectTypeFilter('all');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                currentSection === 'my-drive' && currentTypeFilter === 'all'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>ملفاتي (My Drive)</span>
            </button>

            <button
              id="nav-search"
              onClick={() => {
                onSelectSection('search');
                onSelectTypeFilter('all');
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                currentSection === 'search'
                  ? 'bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/30'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-sky-400" />
                <span>البحث المتقدم</span>
              </div>
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-sky-500/20 text-sky-300 font-mono">
                فلترة
              </span>
            </button>

            <button
              id="nav-shared-with-me"
              onClick={() => {
                onSelectSection('shared-with-me');
                onSelectTypeFilter('all');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                currentSection === 'shared-with-me'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>المشتركة معي</span>
            </button>

            <button
              id="nav-starred"
              onClick={() => {
                onSelectSection('starred');
                onSelectTypeFilter('all');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                currentSection === 'starred'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              <span>المميزة بنجمة</span>
            </button>

            <button
              id="nav-trash"
              onClick={() => {
                onSelectSection('trash');
                onSelectTypeFilter('all');
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                currentSection === 'trash'
                  ? 'bg-emerald-500/15 text-emerald-300 font-semibold'
                  : 'text-stone-300 hover:bg-stone-800/60 hover:text-white'
              }`}
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>سلة المهملات</span>
            </button>
          </nav>
        </div>

        {/* File Type Filters */}
        <div>
          <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider px-3 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>تصنيفات الملفات</span>
          </div>
          <nav className="space-y-0.5">
            <button
              onClick={() => onSelectTypeFilter('all')}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                currentTypeFilter === 'all' && currentSection === 'my-drive'
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <span>جميع الأنواع</span>
            </button>

            <button
              onClick={() => onSelectTypeFilter('folders')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                currentTypeFilter === 'folders'
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span>المجلدات فقط</span>
            </button>

            <button
              onClick={() => onSelectTypeFilter('documents')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                currentTypeFilter === 'documents'
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>المستندات</span>
            </button>

            <button
              onClick={() => onSelectTypeFilter('spreadsheets')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                currentTypeFilter === 'spreadsheets'
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>جداول البيانات</span>
            </button>

            <button
              onClick={() => onSelectTypeFilter('presentations')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                currentTypeFilter === 'presentations'
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-amber-500" />
              <span>العروض التقديمية</span>
            </button>

            <button
              onClick={() => onSelectTypeFilter('pdfs')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                currentTypeFilter === 'pdfs'
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-rose-500" />
              <span>ملفات PDF</span>
            </button>

            <button
              onClick={() => onSelectTypeFilter('images')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                currentTypeFilter === 'images'
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <Image className="w-3.5 h-3.5 text-purple-400" />
              <span>الصور</span>
            </button>

            <button
              onClick={() => onSelectTypeFilter('videos')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                currentTypeFilter === 'videos'
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-pink-400" />
              <span>الفيديوهات</span>
            </button>

            <button
              onClick={() => onSelectTypeFilter('archives')}
              className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                currentTypeFilter === 'archives'
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/40'
              }`}
            >
              <FileArchive className="w-3.5 h-3.5 text-yellow-500" />
              <span>الملفات المضغوطة</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Storage Quota Card */}
      {about?.storageQuota && (
        <div className="pt-4 mt-4 border-t border-stone-800/80">
          <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800/70">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-stone-400 font-medium">سعة التخزين</span>
              <span className="text-emerald-400 font-semibold">{percentUsed}%</span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-l from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-stone-500 font-mono">
              <span>{formatBytes(usageBytes)} مستخدم</span>
              {limitBytes > 0 && <span>من {formatBytes(limitBytes)}</span>}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
