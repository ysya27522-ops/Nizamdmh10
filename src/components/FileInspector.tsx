import { useState } from 'react';
import {
  X,
  ExternalLink,
  Download,
  Copy,
  Star,
  Trash2,
  Edit2,
  Check,
  Calendar,
  Clock,
  HardDrive,
  User as UserIcon,
  Tag,
  Folder,
  BookOpen,
} from 'lucide-react';
import { DriveFile } from '../types';
import { FileIcon } from './FileIcon';
import { formatBytes, formatDate, isFolder } from '../lib/driveApi';

interface FileInspectorProps {
  file: DriveFile | null;
  onClose: () => void;
  onToggleStar: (file: DriveFile) => void;
  onRename: (file: DriveFile) => void;
  onMoveToTrash: (file: DriveFile) => void;
  onRestore?: (file: DriveFile) => void;
  onReadDocument?: (file: DriveFile) => void;
}

export function FileInspector({
  file,
  onClose,
  onToggleStar,
  onRename,
  onMoveToTrash,
  onRestore,
  onReadDocument,
}: FileInspectorProps) {
  const [copied, setCopied] = useState(false);

  if (!file) return null;

  const folder = isFolder(file.mimeType);
  const driveLink = file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(driveLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-y-0 left-0 w-96 max-w-full bg-stone-900 border-r border-stone-800 shadow-2xl z-50 flex flex-col justify-between animate-in slide-in-from-left duration-200"
      dir="rtl"
    >
      {/* Header */}
      <div className="p-4 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-stone-200 font-semibold text-sm">
          <FileIcon mimeType={file.mimeType} className="w-5 h-5" />
          <span>تفاصيل العنصر</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Preview / Thumbnail */}
        {file.thumbnailLink ? (
          <div className="w-full h-44 rounded-xl overflow-hidden bg-stone-950 border border-stone-800 flex items-center justify-center">
            <img
              src={file.thumbnailLink}
              alt={file.name}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        ) : (
          <div className="w-full h-28 rounded-xl bg-stone-950/80 border border-stone-800 flex flex-col items-center justify-center gap-2 text-stone-500">
            <FileIcon mimeType={file.mimeType} className="w-12 h-12" />
            <span className="text-xs">{folder ? 'مجلد Google Drive' : 'ملف سحابي'}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <h2 className="text-base font-bold text-white break-words">{file.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => onToggleStar(file)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                file.starred
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-stone-800/80 border-stone-700/60 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${file.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{file.starred ? 'مميز بنجمة' : 'إضافة إلى النجمة'}</span>
            </button>
          </div>
        </div>

        {/* Read Document in App button if applicable */}
        {onReadDocument && !folder && (file.mimeType.includes('document') || file.mimeType.includes('text') || file.mimeType.includes('plain')) && (
          <button
            onClick={() => onReadDocument(file)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>قراءة المستند في التطبيق</span>
          </button>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-sm transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>فتح في Drive</span>
          </a>

          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700/60 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-stone-400" />
                <span>نسخ الرابط</span>
              </>
            )}
          </button>
        </div>

        {/* Information Table */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            المعلومات الفنية
          </div>

          <div className="bg-stone-950/60 border border-stone-800/80 rounded-xl p-3 divide-y divide-stone-850 text-xs">
            {/* Type */}
            <div className="py-2 flex items-center justify-between">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-stone-500" />
                <span>النوع</span>
              </span>
              <span className="text-stone-200 text-left dir-ltr font-mono text-[11px] truncate max-w-[180px]">
                {file.mimeType}
              </span>
            </div>

            {/* Size */}
            {!folder && (
              <div className="py-2 flex items-center justify-between">
                <span className="text-stone-400 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-stone-500" />
                  <span>الحجم</span>
                </span>
                <span className="text-stone-200 font-mono">{formatBytes(file.size)}</span>
              </div>
            )}

            {/* Modified Time */}
            <div className="py-2 flex items-center justify-between">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>آخر تعديل</span>
              </span>
              <span className="text-stone-200">{formatDate(file.modifiedTime)}</span>
            </div>

            {/* Created Time */}
            {file.createdTime && (
              <div className="py-2 flex items-center justify-between">
                <span className="text-stone-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-500" />
                  <span>تاريخ الإنشاء</span>
                </span>
                <span className="text-stone-200">{formatDate(file.createdTime)}</span>
              </div>
            )}

            {/* Owner */}
            {file.owners && file.owners.length > 0 && (
              <div className="py-2 flex items-center justify-between">
                <span className="text-stone-400 flex items-center gap-1.5">
                  <UserIcon className="w-3.5 h-3.5 text-stone-500" />
                  <span>المالك</span>
                </span>
                <span className="text-stone-200 truncate max-w-[180px]">
                  {file.owners[0].displayName || file.owners[0].emailAddress}
                </span>
              </div>
            )}

            {/* ID */}
            <div className="py-2 flex items-center justify-between">
              <span className="text-stone-400">معرّف الملف</span>
              <span className="text-stone-400 font-mono text-[10px] truncate max-w-[180px] dir-ltr">
                {file.id}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-stone-800 bg-stone-950/40 flex items-center gap-2">
        <button
          onClick={() => onRename(file)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium border border-stone-700/60 transition-colors cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>إعادة تسمية</span>
        </button>

        {file.trashed ? (
          onRestore && (
            <button
              onClick={() => onRestore(file)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600/30 border border-emerald-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <span>استعادة</span>
            </button>
          )
        ) : (
          <button
            onClick={() => onMoveToTrash(file)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>نقل للمهملات</span>
          </button>
        )}
      </div>
    </div>
  );
}
