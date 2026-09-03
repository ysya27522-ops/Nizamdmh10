import React, { useState } from 'react';
import { FolderPlus, X } from 'lucide-react';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export function NewFolderModal({ isOpen, onClose, onCreate }: NewFolderModalProps) {
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = folderName.trim();
    if (!trimmed) {
      setError('يرجى كتابة اسم للمجلد');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onCreate(trimmed);
      setFolderName('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'تعذر إنشاء المجلد');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-2xl relative"
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute left-4 top-4 text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">إنشاء مجلد جديد</h3>
            <p className="text-xs text-stone-400">سيتم إنشاء المجلد في المسار الحالي</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5">
              اسم المجلد
            </label>
            <input
              type="text"
              autoFocus
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="مثال: المستندات المالية 2026"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading || !folderName.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {loading ? 'جارٍ الإنشاء...' : 'إنشاء المجلد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
