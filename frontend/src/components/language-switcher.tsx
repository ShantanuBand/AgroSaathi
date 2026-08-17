import React from 'react';
import { Languages, Check, Globe } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export interface LanguageSwitcherProps {
  variant?: 'pill' | 'compact' | 'full' | 'banner-badge';
  className?: string;
}

export function LanguageSwitcher({ variant = 'pill', className = '' }: LanguageSwitcherProps) {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === 'banner-badge') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        title={language === 'mr' ? 'Switch to English' : 'मराठी मध्ये बदला'}
        className={`group bg-emerald-950/70 hover:bg-emerald-950/90 text-white backdrop-blur-md border border-white/30 hover:border-amber-300/80 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg transition-all duration-200 active:scale-95 cursor-pointer hover:shadow-emerald-900/40 ${className}`}
      >
        <Globe className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
        <span className="font-semibold tracking-wide">
          {language === 'mr' ? 'मराठी' : 'English'}
        </span>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/20 text-amber-200 group-hover:bg-amber-400 group-hover:text-emerald-950 transition-colors">
          {language === 'mr' ? 'English' : 'मराठी'}
        </span>
      </button>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`p-1 bg-muted/60 border border-border rounded-xl flex items-center justify-between gap-1 ${className}`}>
        <button
          type="button"
          onClick={() => setLanguage('mr')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            language === 'mr'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {language === 'mr' && <Check className="w-3 h-3 shrink-0" />}
          <span>मराठी</span>
        </button>

        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          {language === 'en' && <Check className="w-3 h-3 shrink-0" />}
          <span>English</span>
        </button>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        title="Switch Language (मराठी / English)"
        className={`px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer ${className}`}
      >
        <Languages className="w-3.5 h-3.5 shrink-0 text-emerald-100" />
        <span className="tracking-tight font-bold">
          {language === 'mr' ? 'मराठी' : 'EN'}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      title="Switch Language (मराठी / English)"
      className={`px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer ${className}`}
    >
      <Languages className="w-3.5 h-3.5 shrink-0 text-emerald-100" />
      <span className="tracking-tight font-bold">
        {language === 'mr' ? 'मराठी' : 'English'}
      </span>
      <span className="text-[9px] opacity-75 font-mono">
        ({language === 'mr' ? 'EN' : 'MR'})
      </span>
    </button>
  );
}
