import React, { useState } from 'react';
import {
  Star,
  ExternalLink,
  MoreVertical,
  Download,
  Copy,
  Edit2,
  Trash2,
  RotateCcw,
  Info,
  Check,
} from 'lucide-react';
import { DriveFile } from '../types';
import { FileIcon } from './FileIcon';
import { formatBytes, formatDate, isFolder } from '../lib/driveApi';

interface FileRowProps {
  key?: React.Key;
  file: DriveFile;
  isTrash: boolean;
  onOpenFolder: (folderId: string, folderName: string) => void;
  onSelectFile: (file: DriveFile) => void;
  onToggleStar: (file: DriveFile) => void;
  onRename: (file: DriveFile) => void;
  onMoveToTrash: (file: DriveFile) => void;
  onRestore: (file: DriveFile) => void;
  onDeletePermanently: (file: DriveFile) => void;
}

export function FileRow({
  file,
  isTrash,
  onOpenFolder,
  onSelectFile,
  onToggleStar,
  onRename,
  onMoveToTrash,
  onRestore,
  onDeletePermanently,
}: FileRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const folder = isFolder(file.mimeType);

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-action')) {
      return;
    }
    if (folder) {
      onOpenFolder(file.id, file.name);
    } else {
      onSelectFile(file);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = file.webViewLink || `https://drive.google.com/file/d/${file.id}/view`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setMenuOpen(false);
  };

  const ownerName = file.owners?.[0]?.displayName || (file.owners?.[0]?.me ? 'أنا' : '—');

  return (
    <tr
      onClick={handleClick}
      onMouseLeave={() => setMenuOpen(false)}
      className="group hover:bg-stone-850/80 border-b border-stone-850 transition-colors cursor-pointer text-xs select-none"
    >
      {/* Star / Status */}
      <td className="w-10 px-3 py-3 text-center interactive-action">
        {!isTrash && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(file);
            }}
            className="p-1 rounded text-stone-500 hover:text-amber-400 cursor-pointer"
            title={file.starred ? 'إزالة من المفضلة' : 'تفضيل'}
          >
            <Star
              className={`w-3.5 h-3.5 ${
                file.starred ? 'text-amber-400 fill-amber-400' : 'opacity-20 group-hover:opacity-100'
              }`}
            />
          </button>
        )}
      </td>

      {/* Name and Icon */}
      <td className="px-3 py-3 font-medium text-stone-100">
        <div className="flex items-center gap-2.5 min-w-[200px] max-w-md">
          <div className="flex-shrink-0">
            <FileIcon mimeType={file.mimeType} className="w-4 h-4" />
          </div>
          <span
            className="truncate group-hover:text-emerald-300 transition-colors"
            title={file.name}
          >
            {file.name}
          </span>
          {folder && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-mono flex-shrink-0">
              مجلد
            </span>
          )}
        </div>
      </td>

      {/* Owner */}
      <td className="px-3 py-3 text-stone-400 hidden sm:table-cell">
        <span className="truncate max-w-[120px] block">{ownerName}</span>
      </td>

      {/* Modified Date */}
      <td className="px-3 py-3 text-stone-400 hidden md:table-cell font-mono text-[11px]">
        {formatDate(file.modifiedTime)}
      </td>

      {/* Size */}
      <td className="px-3 py-3 text-stone-400 font-mono text-[11px] text-left dir-ltr">
        {formatBytes(file.size)}
      </td>

      {/* Actions */}
      <td className="px-3 py-3 text-left interactive-action relative">
        <div className="flex items-center justify-end gap-1">
          {file.webViewLink && (
            <a
              href={file.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
              title="فتح في Google Drive"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div
                className="absolute left-0 mt-1 w-44 rounded-xl bg-stone-900 border border-stone-800 shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onSelectFile(file);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-stone-300 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-stone-400" />
                  <span>معاينة وتفاصيل</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-stone-300 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
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

                {!isTrash ? (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onRename(file);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-stone-300 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-stone-400" />
                      <span>إعادة تسمية</span>
                    </button>

                    <div className="my-1 border-t border-stone-800" />

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onMoveToTrash(file);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onRestore(file);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استعادة</span>
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDeletePermanently(file);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف نهائي</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}
