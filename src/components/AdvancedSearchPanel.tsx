import { useState } from 'react';
import {
  Search,
  Calendar,
  UserCheck,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Clock,
  User,
  Users,
  FileCheck,
  Folder,
  FileText,
  FileSpreadsheet,
  Presentation,
  Image,
  Video,
  FileArchive,
  Sparkles,
} from 'lucide-react';
import {
  AdvancedSearchFilters,
  DatePresetType,
  DateTargetField,
  FileFilterType,
  OwnerFilterType,
} from '../types';

interface AdvancedSearchPanelProps {
  filters: AdvancedSearchFilters;
  onFilterChange: (filters: AdvancedSearchFilters) => void;
  onResetFilters: () => void;
  totalResults?: number;
  isLoading?: boolean;
}

export function AdvancedSearchPanel({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
  isLoading,
}: AdvancedSearchPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const activeFiltersCount = [
    Boolean(filters.query.trim()),
    filters.ownerType !== 'any',
    filters.datePreset !== 'any' || Boolean(filters.startDate) || Boolean(filters.endDate),
    filters.fileType !== 'all',
  ].filter(Boolean).length;

  const handleQueryChange = (query: string) => {
    onFilterChange({ ...filters, query });
  };

  const handleOwnerTypeChange = (ownerType: OwnerFilterType) => {
    onFilterChange({ ...filters, ownerType });
  };

  const handleOwnerEmailChange = (ownerEmail: string) => {
    onFilterChange({ ...filters, ownerEmail });
  };

  const handleDatePresetChange = (datePreset: DatePresetType) => {
    if (datePreset !== 'custom') {
      onFilterChange({ ...filters, datePreset, startDate: '', endDate: '' });
    } else {
      onFilterChange({ ...filters, datePreset });
    }
  };

  const handleDateFieldChange = (dateField: DateTargetField) => {
    onFilterChange({ ...filters, dateField });
  };

  const handleStartDateChange = (startDate: string) => {
    onFilterChange({ ...filters, startDate, datePreset: 'custom' });
  };

  const handleEndDateChange = (endDate: string) => {
    onFilterChange({ ...filters, endDate, datePreset: 'custom' });
  };

  const handleFileTypeChange = (fileType: FileFilterType) => {
    onFilterChange({ ...filters, fileType });
  };

  // Quick preset shortcuts
  const applyQuickPreset = (presetKey: string) => {
    switch (presetKey) {
      case 'my-recent-docs':
        onFilterChange({
          ...filters,
          ownerType: 'me',
          ownerEmail: '',
          datePreset: '7days',
          dateField: 'modifiedTime',
          startDate: '',
          endDate: '',
          fileType: 'documents',
        });
        break;
      case 'shared-recent':
        onFilterChange({
          ...filters,
          ownerType: 'not-me',
          ownerEmail: '',
          datePreset: '30days',
          dateField: 'modifiedTime',
          startDate: '',
          endDate: '',
          fileType: 'all',
        });
        break;
      case 'today-modified':
        onFilterChange({
          ...filters,
          datePreset: 'today',
          dateField: 'modifiedTime',
          startDate: '',
          endDate: '',
        });
        break;
      case 'my-created-this-year':
        onFilterChange({
          ...filters,
          ownerType: 'me',
          ownerEmail: '',
          datePreset: 'this_year',
          dateField: 'createdTime',
          startDate: '',
          endDate: '',
        });
        break;
    }
  };

  const ownerLabels: Record<OwnerFilterType, string> = {
    any: 'أي مالك',
    me: 'مملوكة لي (أنا)',
    'not-me': 'غير مملوكة لي (مشاركة معي)',
    custom: 'بريد/شخص محدد',
  };

  const datePresetLabels: Record<DatePresetType, string> = {
    any: 'أي وقت',
    today: 'اليوم',
    '7days': 'آخر 7 أيام',
    '30days': 'آخر 30 يوماً',
    '90days': 'آخر 90 يوماً',
    this_year: 'خلال هذا العام',
    custom: 'نطاق مخصص',
  };

  const fileTypeLabels: Record<FileFilterType, string> = {
    all: 'جميع الأنواع',
    documents: 'مستندات',
    folders: 'مجلدات',
    spreadsheets: 'جداول بيانات',
    presentations: 'عروض تقديمية',
    pdfs: 'ملفات PDF',
    images: 'صور',
    videos: 'فيديوهات',
    audio: 'صوتيات',
    archives: 'ملفات مضغوطة',
  };

  return (
    <div className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden mb-6 shadow-xl backdrop-blur transition-all">
      {/* Panel Header */}
      <div className="p-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 bg-stone-950/40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600/30 to-emerald-500/30 border border-sky-500/30 flex items-center justify-center text-sky-300">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-stone-100">البحث المتقدم وتصفية النتائج</h3>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeFiltersCount} {activeFiltersCount === 1 ? 'فلتر مفعل' : 'فلاتر مفعلة'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-stone-400">
              تصفية النتائج بدقة بحسب النطاق الزمني ومالك الملف ونوع المحتوى
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeFiltersCount > 0 && (
            <button
              id="reset-search-filters-btn"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700/80 text-stone-300 hover:text-white text-xs transition-colors border border-stone-700/60 cursor-pointer"
              title="إعادة تعيين كافة خيارات البحث"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة الضبط</span>
            </button>
          )}

          <button
            id="toggle-advanced-search-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800/60 hover:bg-stone-800 text-stone-300 hover:text-white text-xs transition-colors border border-stone-800 cursor-pointer"
          >
            <span>{isExpanded ? 'إخفاء الخيارات' : 'إظهار الخيارات'}</span>
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Filter Controls (Collapsible) */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-5">
          {/* Keyword Search Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-sky-400" />
              <span>اسم الملف أو الكلمة المفتاحية</span>
            </label>
            <div className="relative flex items-center">
              <input
                id="advanced-search-input"
                type="text"
                value={filters.query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="اكتب كلمة للبحث في أسماء الملفات والمستندات..."
                className="w-full bg-stone-950/80 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 transition-all"
              />
              {filters.query && (
                <button
                  onClick={() => handleQueryChange('')}
                  className="absolute left-3 text-stone-400 hover:text-stone-200 p-1 cursor-pointer"
                  title="مسح الكلمة"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Grid of Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. File Owner Filter */}
            <div className="bg-stone-950/40 border border-stone-800/80 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>مالك الملف (File Owner)</span>
                </label>
                {filters.ownerType !== 'any' && (
                  <button
                    onClick={() => handleOwnerTypeChange('any')}
                    className="text-[10px] text-stone-400 hover:text-stone-200 cursor-pointer"
                  >
                    إلغاء
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {(['any', 'me', 'not-me', 'custom'] as OwnerFilterType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleOwnerTypeChange(type)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-right transition-all cursor-pointer truncate ${
                      filters.ownerType === type
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'bg-stone-900/60 text-stone-400 hover:text-stone-200 hover:bg-stone-800/50 border border-stone-800/60'
                    }`}
                  >
                    {ownerLabels[type]}
                  </button>
                ))}
              </div>

              {/* Custom Owner Email Input */}
              {filters.ownerType === 'custom' && (
                <div className="pt-1 animate-in fade-in duration-150">
                  <input
                    id="owner-email-input"
                    type="text"
                    value={filters.ownerEmail}
                    onChange={(e) => handleOwnerEmailChange(e.target.value)}
                    placeholder="أدخل بريد أو اسم المالك..."
                    className="w-full bg-stone-900 border border-stone-700/70 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-emerald-500/60 transition-all"
                  />
                </div>
              )}
            </div>

            {/* 2. Date Range Filter */}
            <div className="bg-stone-950/40 border border-stone-800/80 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>النطاق الزمني (Date Range)</span>
                </label>

                {/* Date Target Field Toggle (Modified vs Created) */}
                <div className="flex items-center bg-stone-900 rounded-lg p-0.5 border border-stone-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => handleDateFieldChange('modifiedTime')}
                    className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                      filters.dateField === 'modifiedTime'
                        ? 'bg-stone-800 text-amber-300 font-semibold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="التصفية حسب تاريخ التعديل"
                  >
                    التعديل
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDateFieldChange('createdTime')}
                    className={`px-1.5 py-0.5 rounded transition-colors cursor-pointer ${
                      filters.dateField === 'createdTime'
                        ? 'bg-stone-800 text-amber-300 font-semibold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="التصفية حسب تاريخ الإنشاء"
                  >
                    الإنشاء
                  </button>
                </div>
              </div>

              {/* Preset Selector */}
              <div className="relative">
                <select
                  id="date-preset-select"
                  value={filters.datePreset}
                  onChange={(e) => handleDatePresetChange(e.target.value as DatePresetType)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-500/60 cursor-pointer"
                >
                  <option value="any" className="bg-stone-900 text-stone-300">
                    أي وقت (الكل)
                  </option>
                  <option value="today" className="bg-stone-900 text-stone-300">
                    اليوم
                  </option>
                  <option value="7days" className="bg-stone-900 text-stone-300">
                    آخر 7 أيام
                  </option>
                  <option value="30days" className="bg-stone-900 text-stone-300">
                    آخر 30 يوماً
                  </option>
                  <option value="90days" className="bg-stone-900 text-stone-300">
                    آخر 90 يوماً
                  </option>
                  <option value="this_year" className="bg-stone-900 text-stone-300">
                    خلال هذا العام
                  </option>
                  <option value="custom" className="bg-stone-900 text-stone-300">
                    نطاق مخصص (من - إلى)
                  </option>
                </select>
              </div>

              {/* Custom Date Inputs (From / To) */}
              {filters.datePreset === 'custom' && (
                <div className="grid grid-cols-2 gap-2 pt-1 animate-in fade-in duration-150">
                  <div>
                    <span className="block text-[10px] text-stone-400 mb-1">من تاريخ</span>
                    <input
                      id="search-start-date"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700/80 rounded-lg px-2 py-1 text-xs text-stone-200 focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                  <div>
                    <span className="block text-[10px] text-stone-400 mb-1">إلى تاريخ</span>
                    <input
                      id="search-end-date"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-700/80 rounded-lg px-2 py-1 text-xs text-stone-200 focus:outline-none focus:border-amber-500/60"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. File Type Filter */}
            <div className="bg-stone-950/40 border border-stone-800/80 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-blue-400" />
                  <span>نوع الملف (File Type)</span>
                </label>
                {filters.fileType !== 'all' && (
                  <button
                    onClick={() => handleFileTypeChange('all')}
                    className="text-[10px] text-stone-400 hover:text-stone-200 cursor-pointer"
                  >
                    إلغاء
                  </button>
                )}
              </div>

              <select
                id="file-type-select"
                value={filters.fileType}
                onChange={(e) => handleFileTypeChange(e.target.value as FileFilterType)}
                className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-blue-500/60 cursor-pointer"
              >
                <option value="all" className="bg-stone-900">
                  جميع أنواع الملفات
                </option>
                <option value="documents" className="bg-stone-900">
                  المستندات وWord
                </option>
                <option value="spreadsheets" className="bg-stone-900">
                  جداول البيانات وExcel
                </option>
                <option value="presentations" className="bg-stone-900">
                  العروض التقديمية وPowerPoint
                </option>
                <option value="pdfs" className="bg-stone-900">
                  ملفات PDF
                </option>
                <option value="images" className="bg-stone-900">
                  الصور والرسومات
                </option>
                <option value="videos" className="bg-stone-900">
                  الفيديوهات
                </option>
                <option value="audio" className="bg-stone-900">
                  الملفات الصوتية
                </option>
                <option value="archives" className="bg-stone-900">
                  المجلدات والملفات المضغوطة (ZIP/RAR)
                </option>
                <option value="folders" className="bg-stone-900">
                  المجلدات فقط
                </option>
              </select>

              <div className="text-[11px] text-stone-500 pt-1">
                البحث يشمل الملفات السحابية والملفات المحملة المتوافقة.
              </div>
            </div>
          </div>

          {/* Quick Presets Shortcuts */}
          <div className="pt-2 border-t border-stone-800/60 flex flex-wrap items-center gap-2">
            <span className="text-xs text-stone-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>اختصارات بحث سريعة:</span>
            </span>

            <button
              type="button"
              onClick={() => applyQuickPreset('my-recent-docs')}
              className="px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs transition-colors border border-stone-700/50 cursor-pointer"
            >
              📄 مستنداتي (آخر 7 أيام)
            </button>

            <button
              type="button"
              onClick={() => applyQuickPreset('shared-recent')}
              className="px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs transition-colors border border-stone-700/50 cursor-pointer"
            >
              👥 المشتركة معي (آخر 30 يوماً)
            </button>

            <button
              type="button"
              onClick={() => applyQuickPreset('today-modified')}
              className="px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs transition-colors border border-stone-700/50 cursor-pointer"
            >
              ⏱️ ملفات عُدلت اليوم
            </button>

            <button
              type="button"
              onClick={() => applyQuickPreset('my-created-this-year')}
              className="px-2.5 py-1 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-300 hover:text-white text-xs transition-colors border border-stone-700/50 cursor-pointer"
            >
              🗓️ أنشأتها هذا العام
            </button>
          </div>
        </div>
      )}

      {/* Active Filter Chips & Results Status */}
      {activeFiltersCount > 0 && (
        <div className="px-4 py-3 bg-stone-950/60 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-stone-400 text-[11px] ml-1">الفلاتر المطبقة:</span>

            {/* Query Chip */}
            {filters.query.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30">
                <span>الكلمة: "{filters.query}"</span>
                <button
                  onClick={() => handleQueryChange('')}
                  className="hover:text-white cursor-pointer"
                  title="حذف الفلتر"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Owner Chip */}
            {filters.ownerType !== 'any' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span>
                  المالك:{' '}
                  {filters.ownerType === 'custom' && filters.ownerEmail
                    ? filters.ownerEmail
                    : ownerLabels[filters.ownerType]}
                </span>
                <button
                  onClick={() => handleOwnerTypeChange('any')}
                  className="hover:text-white cursor-pointer"
                  title="حذف الفلتر"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* Date Range Chip */}
            {(filters.datePreset !== 'any' || filters.startDate || filters.endDate) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <span>
                  {filters.dateField === 'createdTime' ? 'تاريخ الإنشاء: ' : 'تاريخ التعديل: '}
                  {filters.datePreset === 'custom'
                    ? `${filters.startDate || '...'} إلى ${filters.endDate || '...'}`
                    : datePresetLabels[filters.datePreset]}
                </span>
                <button
                  onClick={() => handleDatePresetChange('any')}
                  className="hover:text-white cursor-pointer"
                  title="حذف الفلتر"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {/* File Type Chip */}
            {filters.fileType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30">
                <span>النوع: {fileTypeLabels[filters.fileType]}</span>
                <button
                  onClick={() => handleFileTypeChange('all')}
                  className="hover:text-white cursor-pointer"
                  title="حذف الفلتر"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {totalResults !== undefined && (
            <div className="text-stone-400 font-mono text-[11px]">
              {isLoading ? (
                'جارٍ تحديث النتائج...'
              ) : (
                <span>
                  نتائج المطابقة: <strong className="text-white font-bold">{totalResults}</strong>
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
