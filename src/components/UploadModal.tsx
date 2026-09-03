import React, { useState, useRef } from 'react';
import { UploadCloud, X, File, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatBytes } from '../lib/driveApi';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => Promise<void>;
  currentFolderName?: string;
}

export function UploadModal({
  isOpen,
  onClose,
  onUpload,
  currentFolderName = 'ملفاتي (My Drive)',
}: UploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const chosen = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...chosen]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;
    try {
      setUploading(true);
      setError(null);
      await onUpload(selectedFiles);
      setSelectedFiles([]);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ أثناء رفع الملفات');
    } finally {
      setUploading(false);
    }
  };

  const totalSize = selectedFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative"
        dir="rtl"
      >
        <button
          onClick={onClose}
          disabled={uploading}
          className="absolute left-4 top-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 cursor-pointer disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">رفع ملفات إلى Google Drive</h3>
            <p className="text-xs text-stone-400">
              الوجهة: <span className="text-emerald-400 font-semibold">{currentFolderName}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-emerald-500 bg-emerald-500/5'
              : 'border-stone-700/80 hover:border-stone-500 bg-stone-950/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <UploadCloud className="w-10 h-10 text-emerald-400/80 mx-auto mb-2" />
          <div className="text-sm font-semibold text-stone-200 mb-1">
            اسحب الملفات وأفلتها هنا، أو اضغط للتصفح
          </div>
          <div className="text-xs text-stone-500">
            يدعم جميع صيغ المستندات، الصور، الفيديوهات، والملفات المضغوطة
          </div>
        </div>

        {/* Selected Files List */}
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2 max-h-48 overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs text-stone-400 font-medium px-1">
              <span>الملفات المحددة ({selectedFiles.length})</span>
              <span>الحجم الإجمالي: {formatBytes(totalSize)}</span>
            </div>

            {selectedFiles.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-xl bg-stone-950/80 border border-stone-800 text-xs"
              >
                <div className="flex items-center gap-2 truncate max-w-[80%]">
                  <File className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="truncate text-stone-200" title={f.name}>
                    {f.name}
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono flex-shrink-0">
                    ({formatBytes(f.size)})
                  </span>
                </div>
                {!uploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(idx);
                    }}
                    className="text-stone-500 hover:text-rose-400 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t border-stone-800/80">
          <button
            type="button"
            disabled={uploading}
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            إلغاء
          </button>

          <button
            onClick={handleStartUpload}
            disabled={uploading || selectedFiles.length === 0}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white shadow-md shadow-emerald-950/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-2"
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>جارٍ الرفع إلى Drive...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>بدء الرفع ({selectedFiles.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
