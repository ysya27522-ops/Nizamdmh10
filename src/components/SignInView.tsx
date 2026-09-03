import { useState } from 'react';
import { googleSignIn } from '../lib/firebase';
import { HardDrive, ShieldCheck, FolderGit2, Search, UploadCloud, ArrowRight } from 'lucide-react';

interface SignInViewProps {
  onSuccess: (user: any, token: string) => void;
}

export function SignInView({ onSuccess }: SignInViewProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await googleSignIn();
      if (res) {
        onSuccess(res.user, res.accessToken);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'حدث خطأ أثناء تسجيل الدخول بحساب Google. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between" dir="rtl">
      {/* Header */}
      <header className="border-b border-stone-800/80 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              النظام
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                Google Drive
              </span>
            </h1>
            <p className="text-xs text-stone-400">منصة إدارة والتحكم في ملفات ومجلدات التخزين السحابي</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>اتصال سحابي آمن ومشفر</span>
        </div>
      </header>

      {/* Main Hero & Auth Box */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-stone-900/70 border border-stone-800 rounded-2xl p-8 backdrop-blur shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-stone-800 border border-stone-700/60 flex items-center justify-center text-emerald-400 mb-6 shadow-inner">
              <HardDrive className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">مرحباً بك في النظام</h2>
            <p className="text-sm text-stone-400 leading-relaxed mb-6">
              سجّل الدخول باستخدام حساب Google الخاص بك لاستعراض وإدارة وتنظيم كافة ملفاتك ومجلداتك في Google Drive بصلاحيات وصول آمنة.
            </p>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-right leading-relaxed">
                {error}
              </div>
            )}

            {/* Official GSI Google Sign-in Button */}
            <div className="flex justify-center mb-6">
              <button
                id="google-sign-in-btn"
                onClick={handleSignIn}
                disabled={loading}
                className="w-full relative flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-white text-stone-800 font-medium text-sm shadow-md hover:bg-stone-100 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed border border-stone-200 cursor-pointer"
              >
                <div className="w-5 h-5 flex-shrink-0">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                </div>
                <span className="font-semibold text-stone-800">
                  {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول باستخدام Google'}
                </span>
              </button>
            </div>

            {/* Core Features Preview */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-stone-800/80 text-right">
              <div className="p-2.5 rounded-lg bg-stone-950/40 border border-stone-800/50">
                <FolderGit2 className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-xs font-semibold text-stone-200">تصفح شامل</div>
                <div className="text-[11px] text-stone-400 mt-0.5">مجلدات وملفات</div>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-950/40 border border-stone-800/50">
                <Search className="w-4 h-4 text-teal-400 mb-1" />
                <div className="text-xs font-semibold text-stone-200">بحث فوري</div>
                <div className="text-[11px] text-stone-400 mt-0.5">فلترة ذكية</div>
              </div>
              <div className="p-2.5 rounded-lg bg-stone-950/40 border border-stone-800/50">
                <UploadCloud className="w-4 h-4 text-cyan-400 mb-1" />
                <div className="text-xs font-semibold text-stone-200">رفع وإنشاء</div>
                <div className="text-[11px] text-stone-400 mt-0.5">مباشر إلى Drive</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-800/80 px-6 py-4 text-center text-xs text-stone-500">
        يتم التعامل مع رمز الوصول في الذاكرة الحية فقط وفق أعلى معايير أمان Google OAuth
      </footer>
    </div>
  );
}
