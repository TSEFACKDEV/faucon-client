'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IoCloseOutline, IoMenuOutline, IoArrowForwardOutline } from 'react-icons/io5';
import Logo from '@/components/ui/Logo';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useLanguage } from '@/i18n/LanguageProvider';

const links = [
  { href: '#solution', key: 'nav.solution' },
  { href: '#innovation', key: 'nav.innovation' },
  { href: '#marche', key: 'nav.market' },
  { href: '/developpeurs', key: 'nav.developers' },
];

export default function LandingHeader() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-neutral-100 bg-white/90 shadow-[0_8px_30px_rgba(11,21,38,0.06)] backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" aria-label="Faucon — accueil" className="shrink-0">
          <Logo tone={scrolled ? 'color' : 'white'} size={30} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? 'text-neutral-600 hover:text-primary-600'
                  : 'text-primary-100 hover:text-white'
              }`}
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle tone={scrolled ? 'light' : 'dark'} />
          <Link
            href="/login"
            className={`rounded-[10px] px-4 py-2.5 text-sm font-semibold transition-colors ${
              scrolled
                ? 'text-primary-700 hover:bg-primary-50'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            {t('nav.client')}
          </Link>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-r from-gold-400 to-gold-500 px-4 py-2.5 text-sm font-bold text-primary-900 shadow-[0_8px_24px_rgba(255,176,0,0.28)] transition-transform hover:-translate-y-0.5"
          >
            {t('nav.demo')}
            <IoArrowForwardOutline className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('nav.close') : t('nav.open')}
          aria-expanded={open}
          className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors lg:hidden ${
            scrolled ? 'text-primary-900 hover:bg-neutral-50' : 'text-white hover:bg-white/10'
          }`}
        >
          {open ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border-t border-neutral-100 bg-white px-5 pb-6 pt-3 lg:hidden"
          >
            <nav className="flex flex-col" aria-label="Navigation mobile">
              {links.map((link) =>
                link.href.startsWith('/') ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-neutral-50 py-4 text-base font-semibold text-neutral-900"
                  >
                    {t(link.key)}
                  </Link>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-neutral-50 py-4 text-base font-semibold text-neutral-900"
                  >
                    {t(link.key)}
                  </a>
                )
              )}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="py-4 text-base font-semibold text-primary-700"
              >
                {t('nav.client')}
              </Link>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-3.5 text-sm font-bold text-primary-900"
              >
                {t('nav.demo')}
                <IoArrowForwardOutline />
              </a>
              <div className="pt-4">
                <LanguageToggle tone="light" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
