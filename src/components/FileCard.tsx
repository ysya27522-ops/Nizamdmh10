import React, { useState } from 'react';
import {
  MoreVertical,
  Star,
  ExternalLink,
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

interface FileCardProps {
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

export function FileCard({
  file,
  isTrash,
  onOpenFolder,
  onSelectFile,
  onToggleStar,
  onRename,
  onMoveToTrash,
  onRestore,
  onDeletePermanently,
}: FileCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const folder = isFolder(file.mimeType);

  const handleClick = (e: React.MouseEvent) => {
    // If clicking menu, don't trigger item action
    if ((e.target as HTMLElement).closest('.menu-trigger') || (e.target as HTMLElement).closest('.star-trigger')) {
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

  return (
    <div
      onClick={handleClick}
      onMouseLeave={() => setMenuOpen(false)}
      className="group relative bg-stone-900/60 hover:bg-stone-850 border border-stone-800 hover:border-stone-700/80 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between select-none shadow-sm hover:shadow-xl"
    >
      {/* Top row: Icon & Actions */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-stone-950/70 border border-stone-800/80 flex items-center justify-center">
            <FileIcon mimeType={file.mimeType} className="w-6 h-6" />
          </div>
          {folder && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 font-mono">
              مجلد
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Star toggle */}
          {!isTrash && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(file);
              }}
              className="star-trigger p-1.5 rounded-lg text-stone-500 hover:text-amber-400 hover:bg-stone-800 transition-colors cursor-pointer"
              title={file.starred ? 'إزالة من المميزة بنجمة' : 'إضافة إلى المميزة بنجمة'}
            >
              <Star
                className={`w-4 h-4 ${
                  file.starred ? 'text-amber-400 fill-amber-400' : 'opacity-0 group-hover:opacity-100'
                }`}
              />
            </button>
          )}

          {/* Context menu button */}
          <div className="relative menu-trigger">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
              title="خيارات"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div
                className="absolute left-0 mt-1 w-48 rounded-xl bg-stone-900 border border-stone-800 shadow-2xl p-1.5 z-40 animate-in fade-in zoom-in-95 duration-100"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onSelectFile(file);
                  }}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-stone-300 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5 text-stone-400" />
                  <span>معاينة وتفاصيل</span>
                </button>

                {file.webViewLink && (
                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                    <span>فتح في Google Drive</span>
                  </a>
                )}

                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-stone-300 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">تم نسخ الرابط</span>
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
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-stone-300 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
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
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>نقل إلى سلة المهملات</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onRestore(file);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استعادة</span>
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        onDeletePermanently(file);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
      </div>

      {/* File / Folder Name */}
      <div className="mb-4">
        <h3
          className="text-sm font-semibold text-stone-100 line-clamp-2 break-all group-hover:text-emerald-300 transition-colors"
          title={file.name}
        >
          {file.name}
        </h3>
      </div>

      {/* Thumbnail preview if available and is image/pdf */}
      {file.thumbnailLink && (
        <div className="w-full h-24 mb-3 rounded-xl overflow-hidden bg-stone-950/60 border border-stone-800/60 flex items-center justify-center">
          <img
            src={file.thumbnailLink}
            alt={file.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Meta details footer */}
      <div className="pt-2 border-t border-stone-800/60 flex items-center justify-between text-[11px] text-stone-400 font-mono">
        <span>{formatBytes(file.size)}</span>
        <span>{formatDate(file.modifiedTime)}</span>
      </div>
    </div>
  );
}
