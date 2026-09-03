import { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Loader2,
  ExternalLink,
  Copy,
  Check,
  Printer,
  AlertCircle,
  FileEdit,
} from 'lucide-react';
import { DriveFile } from '../types';
import { getDriveFileContent, formatDate } from '../lib/driveApi';

interface DocumentReaderModalProps {
  file: DriveFile | null;
  token: string | null;
  onClose: () => void;
}

export function DocumentReaderModal({
  file,
  token,
  onClose,
}: DocumentReaderModalProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!file || !token) return;

    let isMounted = true;
    async function loadContent() {
      setIsLoading(true);
      setError(null);
      try {
        const text = await getDriveFileContent(token!, file!.id, file!.mimeType);
        if (isMounted) {
          setContent(text);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Could not read file text directly:', err);
          setError(
            'تعذر استخراج النص الكامل للمستند مباشرة. يمكنك النقر على زر "فتح في Google Docs" لعرضه وتحريره.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      isMounted = false;
    };
  }, [file, token]);

  if (!file) return null;

  const handleCopy = () => {
    if (content) {
      navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const wordCount = content ? content.trim().split(/\s+/).length : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150"
      dir="rtl"
    >
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[88vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/70 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-sm sm:text-base font-bold text-stone-100 truncate">
                {file.name}
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                <span>آخر تعديل: {formatDate(file.modifiedTime)}</span>
                {wordCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono">{wordCount} كلمة</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {file.webViewLink && (
              <a
                href={file.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-colors"
                title="فتح المستند في Google Docs"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">فتح في Google Docs</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {content && (
              <>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer"
                  title="نسخ محتوى المستند"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors cursor-pointer hidden sm:block"
                  title="طباعة"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-stone-950/50">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 gap-3">
              <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-xs">جارٍ قراءة محتوى المستند من Google Drive...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto my-16 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-center space-y-3">
              <AlertCircle className="w-8 h-8 mx-auto text-amber-400" />
              <p className="text-xs leading-relaxed">{error}</p>
              {file.webViewLink && (
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold"
                >
                  <span>عرض الملف في Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ) : content ? (
            <div className="max-w-3xl mx-auto bg-stone-900/60 p-6 sm:p-10 rounded-2xl border border-stone-800 shadow-xl font-sans text-stone-200 leading-loose text-sm sm:text-base whitespace-pre-wrap select-text">
              {content}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-500">
              <p className="text-sm">المستند فارغ أو لا يحتوي على نصوص مقروءة.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-800 bg-stone-950/60 flex items-center justify-between text-xs text-stone-400 shrink-0">
          <span className="font-mono text-[11px] text-stone-500">نوع الملف: {file.mimeType}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
