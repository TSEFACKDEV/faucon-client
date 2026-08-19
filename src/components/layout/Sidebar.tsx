'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  IoGridOutline, IoPeopleOutline, IoHardwareChipOutline,
  IoWarningOutline, IoSettingsOutline, IoAddCircleOutline, IoCloseOutline,
  IoLogOutOutline,
} from 'react-icons/io5';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/useLogout';
import Logo from '@/components/ui/Logo';

const NAV = [
  { href: '/dashboard',                    label: 'Dashboard',    icon: IoGridOutline },
  { href: '/dashboard/utilisateurs',        label: 'Utilisateurs', icon: IoPeopleOutline },
  { href: '/dashboard/traceurs',            label: 'Traceurs',     icon: IoHardwareChipOutline },
  { href: '/dashboard/traceurs/provisionner', label: 'Provisionner', icon: IoAddCircleOutline },
  { href: '/dashboard/alertes',             label: 'Alertes',      icon: IoWarningOutline },
  { href: '/dashboard/parametres',          label: 'Paramètres',   icon: IoSettingsOutline },
];

interface Props {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = false, onClose }: Props) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { handleLogout } = useLogout();

  const initials = user?.userName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'FA';

  const content = (
    <div className="flex h-full flex-col relative overflow-hidden">
      {/* Lueur décorative discrète — même langage visuel que le hero mobile. */}
      <div className="pointer-events-none absolute -top-24 -right-20 w-64 h-64 rounded-full bg-accent-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

      <div className="relative flex items-center justify-between px-6 pt-7 pb-6 border-b border-white/10">
        <Logo tone="white" size={26} />
        <button
          onClick={onClose}
          className="lg:hidden text-white/70 hover:text-white transition-colors p-1"
          aria-label="Fermer le menu"
        >
          <IoCloseOutline size={22} />
        </button>
      </div>

      <nav className="relative flex-1 px-3 py-5 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href);

          return (
            <Link key={href} href={href} onClick={onClose} className="relative">
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-gradient-to-r from-accent-400/90 to-accent-500/90 rounded-[10px] shadow-[0_4px_16px_rgba(0,194,255,0.35)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-[10px]
                  text-sm font-medium transition-colors duration-150
                  ${isActive ? 'text-primary-900 font-semibold' : 'text-white/65 hover:text-white'}
                `}
              >
                <Icon size={18} />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="relative px-3 pb-4 pt-2 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] bg-white/[0.06]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center shrink-0 shadow-[0_2px_10px_rgba(255,176,0,0.35)]">
            <span className="text-sm font-bold text-primary-900">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.userName ?? 'Admin'}</p>
            <p className="text-xs text-white/55">Administrateur</p>
          </div>
          <button
            onClick={handleLogout}
            title="Se déconnecter"
            aria-label="Se déconnecter"
            className="shrink-0 text-white/50 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <IoLogOutOutline size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Version desktop : hors du flux (fixed), pour ne jamais pousser le
          contenu principal — un `sticky` sur un élément h-screen reste dans
          le flux et décale tout le reste d'une pleine hauteur d'écran. */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[248px] bg-gradient-to-b from-primary-900 via-primary-800 to-primary-700 shrink-0 z-20">
        {content}
      </aside>

      {/* Version mobile : tiroir + voile */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute left-0 top-0 h-full w-[268px] bg-gradient-to-b from-primary-900 via-primary-800 to-primary-700 shadow-2xl"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
}
