import React, { useState, useEffect } from 'react';
import { Edit2, X } from 'lucide-react';
import { DriveFile } from '../types';

interface RenameModalProps {
  file: DriveFile | null;
  onClose: () => void;
  onRename: (fileId: string, newName: string) => Promise<void>;
}

export function RenameModal({ file, onClose, onRename }: RenameModalProps) {
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      setNewName(file.name);
      setError(null);
    }
  }, [file]);

  if (!file) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) {
      setError('يرجى إدخال اسم جديد');
      return;
    }
    if (trimmed === file.name) {
      onClose();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onRename(file.id, trimmed);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'تعذر تعديل الاسم');
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
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Edit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">إعادة تسمية العنصر</h3>
            <p className="text-xs text-stone-400">أدخل الاسم الجديد للملف أو المجلد</p>
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
              الاسم الجديد
            </label>
            <input
              type="text"
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
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
              disabled={loading || !newName.trim()}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {loading ? 'جارٍ الحفظ...' : 'حفظ التعديل'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
