'use client';

import { useLanguage, Language } from '@/i18n/LanguageProvider';

interface Props {
  /** Sur fond sombre (hero, sidebar) ou clair (header collé). */
  tone?: 'light' | 'dark';
  className?: string;
}

const OPTIONS: { id: Language; label: string }[] = [
  { id: 'fr', label: 'FR' },
  { id: 'en', label: 'EN' },
];

export default function LanguageToggle({ tone = 'light', className = '' }: Props) {
  const { language, setLanguage } = useLanguage();
  const isDark = tone === 'dark';

  return (
    <div
      className={`inline-flex items-center rounded-full border p-0.5 ${
        isDark
          ? 'border-white/25 bg-white/10'
          : 'border-neutral-200 bg-neutral-50'
      } ${className}`}
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map((option) => {
        const active = language === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLanguage(option.id)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-colors ${
              active
                ? isDark
                  ? 'bg-white text-primary-900'
                  : 'bg-primary-600 text-white'
                : isDark
                  ? 'text-white/70 hover:text-white'
                  : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
