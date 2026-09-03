import { useState } from 'react';
import {
  HardDrive,
  Search,
  X,
  RotateCw,
  LogOut,
  User as UserIcon,
  Cloud,
  SlidersHorizontal,
} from 'lucide-react';
import { DriveAbout } from '../types';
import { formatBytes } from '../lib/driveApi';

interface NavbarProps {
  user: any;
  about: DriveAbout | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAdvancedSearch?: () => void;
  hasActiveFilters?: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
  onLogout: () => void;
}

export function Navbar({
  user,
  about,
  searchQuery,
  onSearchChange,
  onOpenAdvancedSearch,
  hasActiveFilters = false,
  onRefresh,
  isRefreshing,
  onLogout,
}: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const storageUsed = about?.storageQuota?.usage
    ? formatBytes(about.storageQuota.usage)
    : null;
  const storageLimit = about?.storageQuota?.limit
    ? formatBytes(about.storageQuota.limit)
    : null;

  return (
    <header className="h-16 border-b border-stone-800 bg-stone-900/60 backdrop-blur px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3 min-w-fit">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
          <HardDrive className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white tracking-tight">النظام</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono hidden sm:inline-block">
              Drive v3
            </span>
          </div>
          <span className="text-[11px] text-stone-400 block -mt-1 hidden md:block">
            إدارة وتنظيم الملفات السحابية
          </span>
        </div>
      </div>

      {/* Central Search Bar */}
      <div className="flex-1 max-w-xl mx-2">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-stone-400 absolute right-3 pointer-events-none" />
          <input
            id="drive-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="البحث في كل ملفات ومجلدات Drive..."
            className="w-full bg-stone-950/70 border border-stone-800 rounded-xl pr-9 pl-20 py-2 text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 transition-all"
          />
          <div className="absolute left-2 flex items-center gap-1">
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-stone-400 hover:text-stone-200 p-1 rounded-lg hover:bg-stone-800/60 cursor-pointer"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            {onOpenAdvancedSearch && (
              <button
                id="open-advanced-search-btn"
                onClick={onOpenAdvancedSearch}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer relative ${
                  hasActiveFilters
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/70'
                }`}
                title="خيارات البحث المتقدم (النطاق الزمني والمالك)"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {hasActiveFilters && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Actions & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Storage Quick Summary (Desktop) */}
        {storageUsed && (
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-950/50 border border-stone-800 text-xs text-stone-300">
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              {storageUsed} {storageLimit ? `/ ${storageLimit}` : ''}
            </span>
          </div>
        )}

        {/* Refresh Button */}
        <button
          id="refresh-drive-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800/80 transition-colors border border-stone-800/60 disabled:opacity-50"
          title="تحديث القائمة"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            id="user-profile-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-stone-800/80 border border-stone-800/80 transition-colors cursor-pointer"
          >
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'المستخدم'}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-emerald-500/30"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-stone-800 text-stone-300 flex items-center justify-center text-xs font-semibold">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs text-stone-300 font-medium max-w-[100px] truncate hidden md:block">
              {user?.displayName || 'المستخدم'}
            </span>
          </button>

          {showUserMenu && (
            <div
              className="absolute left-0 mt-2 w-64 rounded-xl bg-stone-900 border border-stone-800 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100"
              dir="rtl"
            >
              <div className="pb-3 mb-2 border-b border-stone-800 flex items-center gap-2.5">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-lg"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-stone-800 flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-stone-400" />
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="text-sm font-semibold text-white truncate">
                    {user?.displayName || 'حساب Google'}
                  </div>
                  <div className="text-xs text-stone-400 truncate">{user?.email}</div>
                </div>
              </div>

              {storageUsed && (
                <div className="mb-3 p-2 rounded-lg bg-stone-950/60 border border-stone-800/60 text-xs">
                  <div className="flex justify-between text-stone-400 mb-1">
                    <span>المساحة المستهلكة</span>
                    <span className="text-emerald-400 font-mono">{storageUsed}</span>
                  </div>
                  {storageLimit && (
                    <div className="text-[11px] text-stone-500 text-left dir-ltr">
                      إجمالي المساحة: {storageLimit}
                    </div>
                  )}
                </div>
              )}

              <button
                id="sign-out-btn"
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-xs font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج من النظام</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
