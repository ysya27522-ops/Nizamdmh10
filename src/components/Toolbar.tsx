import {
  LayoutGrid,
  List,
  ArrowUpDown,
  Trash2,
  FolderPlus,
  Upload,
  FileText,
} from 'lucide-react';
import { DriveViewSection, SortField, SortOrder } from '../types';

interface ToolbarProps {
  section: DriveViewSection;
  totalCount: number;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField, order: SortOrder) => void;
  onEmptyTrash?: () => void;
  onNewFolder: () => void;
  onUpload: () => void;
  onNewDocument?: () => void;
}

export function Toolbar({
  section,
  totalCount,
  viewMode,
  onViewModeChange,
  sortField,
  sortOrder,
  onSortChange,
  onEmptyTrash,
  onNewFolder,
  onUpload,
  onNewDocument,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-stone-800/80 bg-stone-900/30">
      {/* Items count & summary */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-stone-400">
          إجمالي العناصر: <strong className="text-stone-200 font-mono">{totalCount}</strong>
        </span>

        {section === 'trash' && totalCount > 0 && onEmptyTrash && (
          <button
            onClick={onEmptyTrash}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>إفراغ سلة المهملات</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* New Actions */}
        {section !== 'trash' && (
          <div className="flex items-center gap-1.5 ml-2">
            {onNewDocument && (
              <button
                onClick={onNewDocument}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow-sm transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>مستند جديد</span>
              </button>
            )}
            <button
              onClick={onUpload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>رفع</span>
            </button>
            <button
              onClick={onNewFolder}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700/60 transition-all cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>مجلد</span>
            </button>
          </div>
        )}

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-xl px-2 py-1 text-xs text-stone-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
          <select
            value={`${sortField}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-') as [SortField, SortOrder];
              onSortChange(field, order);
            }}
            className="bg-transparent text-xs text-stone-300 focus:outline-none cursor-pointer pr-1"
          >
            <option value="modifiedTime-desc" className="bg-stone-900 text-stone-200">
              الأحدث تعديلاً
            </option>
            <option value="modifiedTime-asc" className="bg-stone-900 text-stone-200">
              الأقدم تعديلاً
            </option>
            <option value="name-asc" className="bg-stone-900 text-stone-200">
              الاسم (أ - ي)
            </option>
            <option value="name-desc" className="bg-stone-900 text-stone-200">
              الاسم (ي - أ)
            </option>
            <option value="size-desc" className="bg-stone-900 text-stone-200">
              الأكبر حجماً
            </option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-0.5">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-stone-800 text-emerald-400'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="عرض كشبكة"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-stone-800 text-emerald-400'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="عرض كقائمة"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
