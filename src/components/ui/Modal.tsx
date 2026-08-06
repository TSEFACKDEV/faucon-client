'use client';
import { ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseOutline } from 'react-icons/io5';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  wide?: boolean;
}

export default function Modal({ open, onClose, title, subtitle, children, wide = false }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`
              w-full ${wide ? 'max-w-2xl' : 'max-w-md'}
              bg-white rounded-2xl shadow-[0_8px_40px_rgba(33,31,27,0.16)]
              border border-neutral-100 max-h-[90vh] overflow-y-auto
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-neutral-100">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
                {subtitle && <p className="text-xs text-neutral-600 mt-0.5">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
                aria-label="Fermer"
              >
                <IoCloseOutline size={20} />
              </button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
