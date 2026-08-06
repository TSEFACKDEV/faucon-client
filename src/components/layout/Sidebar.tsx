'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  IoGridOutline, IoPeopleOutline, IoHardwareChipOutline,
  IoWarningOutline, IoSettingsOutline, IoAddCircleOutline,
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

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { handleLogout } = useLogout();

  const initials = user?.userName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'FA';

  return (
    <aside className="w-[248px] min-h-screen bg-primary-600 flex flex-col shrink-0">
      <div className="px-6 pt-7 pb-5 border-b border-white/10">
        <Logo tone="white" size={26} />
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(href);

          return (
            <Link key={href} href={href} className="relative">
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
    </aside>
  );
}
