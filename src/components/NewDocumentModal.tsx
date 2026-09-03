import { useState, FormEvent } from 'react';
import {
  X,
  FileText,
  Loader2,
  Sparkles,
  CheckCircle2,
  FileCode,
  Layers,
} from 'lucide-react';
import { generateNizamDocumentMarkdown } from '../data/nizamReport';

interface NewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, content: string, asGoogleDoc: boolean) => Promise<void>;
  currentFolderName: string;
}

const TEMPLATES = [
  {
    id: 'blank',
    name: 'مستند فارغ',
    desc: 'ابدأ بكتابة مستند جديد من الصفر',
    defaultTitle: 'مستند بدون عنوان',
    content: '',
  },
  {
    id: 'nizam',
    name: 'تقرير ملف النظام الدستوري',
    desc: 'وثيقة كاملة للنظام الدستوري العربي الإسلامي ومبادئه وسلطاته',
    defaultTitle: 'تقرير ملف النظام الدستوري العربي الإسلامي',
    content: generateNizamDocumentMarkdown(),
  },
  {
    id: 'memo',
    name: 'مذكرة رسمية / قانونية',
    desc: 'هيكل منظم للمذكرات والتقارير الرسمية والاستشارات',
    defaultTitle: 'مذكرة رسمية - دراسة نظامية',
    content: `# مذكرة رسمية نظامية
**التاريخ**: ${new Date().toLocaleDateString('ar-EG')}
**الموضوع**: دراسة ومقترح تنظيمي

---

### 1. المقدمة والأهداف
بيان موجز للغرض من هذه المذكرة والمستهدفات الاستراتيجية.

### 2. السند النظامي والشرعي
- الإشارة إلى المواد النظامية والمبادئ الدستورية ذات الصلة.
- بيان أوجه المصلحة العامة والضرورة التشغيلية.

### 3. التوصيات والقرارات المقترحة
1. التوصية الأولى: ...
2. التوصية الثانية: ...

---
**الجهة المُعدة**: إدارة الشؤون القانونية والنظامية
`,
  },
  {
    id: 'minutes',
    name: 'محضر اجتماع وقرارات',
    desc: 'توثيق مجريات جلسة الشورى أو الاجتماع والقرارات المتخذة',
    defaultTitle: 'محضر اجتماع مجلس الإدارة والشورى',
    content: `# محضر اجتماع رقم (01)
**تاريخ الانعقاد**: ${new Date().toLocaleDateString('ar-EG')}
**المكان / المنصة**: قاعة الاجتماعات الرئيسية

---

### الحضور:
1. الرئيس:
2. الأعضاء:
3. أمين السر:

### جدول الأعمال:
1. استعراض التقرير الدوري.
2. مناقشة لوائح النظام والحوكمة.
3. القرارات والتوصيات.

### القرارات المتخذة:
- القرار رقم (1): ...
- القرار رقم (2): ...
`,
  },
];

export function NewDocumentModal({
  isOpen,
  onClose,
  onCreate,
  currentFolderName,
}: NewDocumentModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [title, setTitle] = useState('مستند جديد');
  const [content, setContent] = useState('');
  const [asGoogleDoc, setAsGoogleDoc] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setTitle(tmpl.defaultTitle);
      setContent(tmpl.content);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى كتابة عنوان المستند');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onCreate(title.trim(), content, asGoogleDoc);
      // Reset & close
      setTitle('مستند جديد');
      setContent('');
      setSelectedTemplate('blank');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء حفظ المستند في Drive');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      dir="rtl"
    >
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-stone-100">إنشاء مستند جديد في Drive</h3>
              <p className="text-[11px] text-stone-400">
                الحفظ في المجلد الحالي: <span className="text-emerald-400 font-semibold">{currentFolderName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              {error}
            </div>
          )}

          {/* Templates Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-2">
              اختر قالب المستند:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => handleTemplateSelect(tmpl.id)}
                  className={`p-2.5 rounded-xl border text-right transition-all cursor-pointer ${
                    selectedTemplate === tmpl.id
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 shadow-sm'
                      : 'bg-stone-950/50 border-stone-800 hover:border-stone-700 text-stone-400'
                  }`}
                >
                  <div className="text-xs font-bold mb-0.5">{tmpl.name}</div>
                  <div className="text-[10px] text-stone-500 line-clamp-2">{tmpl.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              عنوان المستند <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب اسم المستند..."
              required
              disabled={isSubmitting}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
            />
          </div>

          {/* Document Content / Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-stone-300">محتوى المستند:</label>
              <span className="text-[11px] text-stone-500">يدعم النصوص وMarkdown والتنسيق العربي</span>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب أو الصق نص المستند هنا..."
              rows={8}
              disabled={isSubmitting}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3.5 text-xs font-mono text-stone-200 placeholder:text-stone-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 resize-y leading-relaxed"
            />
          </div>

          {/* Options */}
          <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-stone-200 block">
                تنسيق المستند (Google Docs متوافق)
              </span>
              <span className="text-[11px] text-stone-400 block">
                حفظ الملف بصيغة Google Doc لفتحه وتحريره مباشرة في منصة مستندات جوجل
              </span>
            </div>
            <input
              type="checkbox"
              id="asGoogleDocCheckbox"
              checked={asGoogleDoc}
              onChange={(e) => setAsGoogleDoc(e.target.checked)}
              className="w-4 h-4 text-emerald-500 rounded border-stone-700 bg-stone-900 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-emerald-950 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ الحفظ في Drive...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>إنشاء وحفظ في Drive</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
