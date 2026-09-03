import { ChevronLeft, Home, ArrowRight } from 'lucide-react';
import { FolderBreadcrumb } from '../types';

interface BreadcrumbsProps {
  breadcrumbs: FolderBreadcrumb[];
  onNavigate: (index: number) => void;
  onGoBack: () => void;
  sectionTitle: string;
}

export function Breadcrumbs({
  breadcrumbs,
  onNavigate,
  onGoBack,
  sectionTitle,
}: BreadcrumbsProps) {
  const canGoBack = breadcrumbs.length > 1;

  return (
    <div className="flex items-center gap-2 py-3 px-6 border-b border-stone-800/60 bg-stone-950/20 text-xs text-stone-400 overflow-x-auto select-none">
      {canGoBack && (
        <button
          onClick={onGoBack}
          className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors mr-1 cursor-pointer flex items-center gap-1"
          title="رجوع للمجلد السابق"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span className="text-[11px]">رجوع</span>
        </button>
      )}

      <div className="flex items-center gap-1.5 min-w-max">
        {breadcrumbs.length === 0 ? (
          <span className="font-semibold text-stone-200">{sectionTitle}</span>
        ) : (
          breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={crumb.id} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronLeft className="w-3.5 h-3.5 text-stone-600 flex-shrink-0" />}
                <button
                  onClick={() => onNavigate(idx)}
                  disabled={isLast}
                  className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors ${
                    isLast
                      ? 'font-bold text-white bg-stone-800/70 cursor-default'
                      : 'hover:text-stone-200 hover:bg-stone-800/40 text-stone-400 cursor-pointer'
                  }`}
                >
                  {idx === 0 && <Home className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{crumb.name}</span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
