import { useState } from 'react';
import {
  Scale,
  Layers,
  BookOpen,
  ShieldCheck,
  Building2,
  Sparkles,
  CloudUpload,
  Copy,
  Printer,
  Check,
  Search,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  HelpCircle,
  Share2,
} from 'lucide-react';
import {
  NIZAM_CONSTITUTIONAL_REPORT,
  generateNizamDocumentHtml,
  generateNizamDocumentMarkdown,
} from '../data/nizamReport';

interface NizamReportViewProps {
  onExportToDrive: (title: string, htmlContent: string) => Promise<void>;
  isExporting: boolean;
  onOpenNewDocWithContent?: (title: string, content: string) => void;
}

export function NizamReportView({
  onExportToDrive,
  isExporting,
}: NizamReportViewProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [reportSearch, setReportSearch] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    principles: true,
    authorities: true,
    documents: true,
    rights: true,
    modern_adaptation: true,
    symbolism: true,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = () => {
    const md = generateNizamDocumentMarkdown();
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = async () => {
    const html = generateNizamDocumentHtml();
    await onExportToDrive('تقرير ملف النظام - النظام الدستوري العربي الإسلامي', html);
  };

  const getSectionIcon = (name: string) => {
    switch (name) {
      case 'Scale':
        return <Scale className="w-5 h-5 text-emerald-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-teal-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-amber-400" />;
      case 'Building2':
        return <Building2 className="w-5 h-5 text-indigo-400" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />;
      default:
        return <FileText className="w-5 h-5 text-emerald-400" />;
    }
  };

  // Filter sections according to tab and search query
  const filteredSections = NIZAM_CONSTITUTIONAL_REPORT.sections.filter((sec) => {
    if (activeTab !== 'all' && sec.id !== activeTab) return false;
    if (!reportSearch.trim()) return true;

    const q = reportSearch.toLowerCase();
    const matchesTitle = sec.title.toLowerCase().includes(q) || sec.subtitle.toLowerCase().includes(q);
    const matchesContent = sec.content.toLowerCase().includes(q);
    const matchesBullets = sec.bullets?.some(
      (b) => b.title.toLowerCase().includes(q) || b.desc.toLowerCase().includes(q)
    );
    const matchesTable = sec.tableData?.some(
      (t) => t.role.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );

    return matchesTitle || matchesContent || matchesBullets || matchesTable;
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 max-w-6xl mx-auto w-full">
      {/* Top Banner & Title */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-950/70 via-stone-900 to-stone-950 border border-emerald-800/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-emerald-400" />
                وثيقة معتمدة وموثقة
              </span>
              <span className="text-xs text-stone-400 font-mono">
                {NIZAM_CONSTITUTIONAL_REPORT.version}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {NIZAM_CONSTITUTIONAL_REPORT.title}
            </h1>
            <p className="text-sm text-stone-300 max-w-3xl leading-relaxed">
              {NIZAM_CONSTITUTIONAL_REPORT.summary}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
            <button
              id="export-report-drive-btn"
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 border border-emerald-400/30 transition-all cursor-pointer disabled:opacity-50"
              title="إنشاء ملف مستند وحفظه مباشرة في Google Drive الخاص بك"
            >
              <CloudUpload className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
              <span>{isExporting ? 'جارٍ الحفظ في Drive...' : 'حفظ في Google Drive'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700/60 transition-all cursor-pointer"
              title="نسخ التقرير كاملاً بتنسيق Markdown"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ التقرير</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700/60 transition-all cursor-pointer hidden sm:flex"
              title="طباعة التقرير أو حفظه كـ PDF"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-stone-900/60 p-3 rounded-2xl border border-stone-800">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            عرض الكل ({NIZAM_CONSTITUTIONAL_REPORT.sections.length})
          </button>
          {NIZAM_CONSTITUTIONAL_REPORT.sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveTab(sec.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === sec.id
                  ? 'bg-emerald-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              {sec.title.split('.')[1] || sec.title}
            </button>
          ))}
        </div>

        {/* Search Within Report */}
        <div className="relative min-w-[200px] sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={reportSearch}
            onChange={(e) => setReportSearch(e.target.value)}
            placeholder="بحث داخل فصول الوثيقة..."
            className="w-full bg-stone-950/80 border border-stone-800 rounded-xl pr-8 pl-3 py-1.5 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-emerald-500/60 transition-all"
          />
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        {filteredSections.length === 0 ? (
          <div className="p-12 text-center bg-stone-900/30 rounded-2xl border border-stone-800 text-stone-400">
            <HelpCircle className="w-8 h-8 mx-auto mb-2 text-stone-500" />
            <p className="text-sm">لم يتم العثور على فقرات مطابقة للبحث داخل التقرير.</p>
          </div>
        ) : (
          filteredSections.map((sec) => {
            const isExpanded = expandedSections[sec.id] ?? true;

            return (
              <div
                key={sec.id}
                id={`report-section-${sec.id}`}
                className="rounded-2xl bg-stone-900/50 border border-stone-800 overflow-hidden transition-all hover:border-stone-700/80 shadow-md"
              >
                {/* Header */}
                <div
                  onClick={() => toggleSection(sec.id)}
                  className="px-6 py-4 flex items-center justify-between cursor-pointer select-none bg-stone-950/40 hover:bg-stone-800/40 border-b border-stone-800/60 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center shadow-inner">
                      {getSectionIcon(sec.iconName)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white tracking-wide">
                        {sec.title}
                      </h2>
                      <p className="text-xs text-stone-400 mt-0.5">{sec.subtitle}</p>
                    </div>
                  </div>

                  <button className="text-stone-400 hover:text-stone-200 p-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Body Content */}
                {isExpanded && (
                  <div className="p-6 space-y-5 text-stone-300">
                    <p className="text-sm leading-relaxed text-stone-200 font-medium">
                      {sec.content}
                    </p>

                    {/* Bullet Points Cards */}
                    {sec.bullets && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {sec.bullets.map((b, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/70 hover:border-emerald-500/30 transition-all space-y-1.5"
                          >
                            <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                              {b.title}
                            </h3>
                            <p className="text-xs text-stone-300 leading-relaxed">
                              {b.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Table View (for Authorities / Comparison) */}
                    {sec.tableData && (
                      <div className="overflow-x-auto rounded-xl border border-stone-800">
                        <table className="w-full text-right text-xs">
                          <thead>
                            <tr className="bg-stone-950/80 border-b border-stone-800 text-stone-400 font-semibold">
                              <th className="px-4 py-3 w-40">السلطة</th>
                              <th className="px-4 py-3">الدور والمسؤولية الدستورية</th>
                              <th className="px-4 py-3 w-64 hidden sm:table-cell">
                                الإدارة والمؤسسات
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-800/60 bg-stone-900/20">
                            {sec.tableData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-stone-800/30 transition-colors">
                                <td className="px-4 py-3.5 font-bold text-emerald-300 align-top">
                                  {row.role}
                                </td>
                                <td className="px-4 py-3.5 text-stone-200 leading-relaxed align-top">
                                  {row.description}
                                </td>
                                <td className="px-4 py-3.5 text-stone-400 text-[11px] leading-relaxed align-top hidden sm:table-cell">
                                  {row.notes}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info Card */}
      <div className="p-6 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-center space-y-2">
        <p className="text-xs text-stone-400">
          تمت صياغة وتوثيق هذا التقرير الدستوري استناداً لأمهات كتب الفقه الدستوري والوثائق التاريخية ومرجعيات القانون العام.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
          >
            تصدير المستند كملف رسمي إلى Google Drive
          </button>
          <span className="text-stone-600">•</span>
          <button
            onClick={handleCopy}
            className="text-xs text-stone-400 hover:text-stone-300 underline font-medium cursor-pointer"
          >
            نسخ التقرير إلى الحافظة
          </button>
        </div>
      </div>
    </div>
  );
}
