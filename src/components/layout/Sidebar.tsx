'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  IoGridOutline, IoPeopleOutline, IoHardwareChipOutline,
  IoWarningOutline, IoSettingsOutline, IoAddCircleOutline, IoCloseOutline,
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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-6 pt-7 pb-5 border-b border-white/10">
        <Logo tone="white" size={26} />
        <button
          onClick={onClose}
          className="lg:hidden text-white/70 hover:text-white transition-colors p-1"
          aria-label="Fermer le menu"
        >
          <IoCloseOutline size={22} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href);

          return (
            <Link key={href} href={href} onClick={onClose} className="relative">
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-white/15 rounded-[10px]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span
                className={`
                  relative flex items-center gap-3 px-4 py-3 rounded-[10px]
                  text-sm font-medium transition-colors duration-150
                  ${isActive ? 'text-white' : 'text-white/65 hover:text-white'}
                `}
              >
                <Icon size={18} />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className="px-4 py-4 border-t border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={handleLogout}
        title="Cliquer pour se déconnecter"
      >
        <div className="w-9 h-9 rounded-full bg-accent-400 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-white">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{user?.userName ?? 'Admin'}</p>
          <p className="text-xs text-white/60">Administrateur</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Version desktop : barre latérale fixe */}
      <aside className="hidden lg:flex w-[248px] bg-primary-600 shrink-0 sticky top-0 h-screen">
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
            className="absolute left-0 top-0 h-full w-[268px] bg-primary-600 shadow-2xl"
          >
            {content}
          </motion.aside>
        </div>
      )}
    </>
  );
}
