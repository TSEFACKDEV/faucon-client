'use client';

import { useState } from 'react';
import { IoCheckmarkOutline, IoCopyOutline } from 'react-icons/io5';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function CodeBlock({
  code,
  language,
  title,
}: {
  code: string;
  language: string;
  title?: string;
}) {
  const { tr } = useLanguage();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Le presse-papiers peut être refusé par le navigateur ; le code reste
      // sélectionnable manuellement.
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-primary-900/10 bg-primary-900 shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-3.5 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary-100/45">
            {language}
          </span>
          {title && (
            <span className="text-[10px] text-primary-100/30">· {title}</span>
          )}
        </div>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold text-primary-100/55 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={tr('Copier le code', 'Copy code')}
        >
          {copied ? <IoCheckmarkOutline /> : <IoCopyOutline />}
          {copied ? tr('Copié', 'Copied') : tr('Copier', 'Copy')}
        </button>
      </div>
      <pre className="max-h-[560px] overflow-auto p-4 text-[11px] leading-relaxed text-primary-100/85">
        <code>{code}</code>
      </pre>
    </div>
  );
}
