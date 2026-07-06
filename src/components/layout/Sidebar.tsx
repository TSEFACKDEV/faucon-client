'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  RiMapPinLine,
  RiSettings3Line,
  RiHistoryLine,
  RiBellLine,
  RiCpuLine,
} from 'react-icons/ri';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'react-toastify';

const NAV = [
  { href: '/dashboard/position',   label: 'Position',    icon: RiMapPinLine   },
  { href: '/dashboard/dispositifs', label: 'Dispositifs', icon: RiCpuLine      },
  { href: '/dashboard/historique',  label: 'Historique',  icon: RiHistoryLine  },
  { href: '/dashboard/alertes',     label: 'Alertes',     icon: RiBellLine     },
  { href: '/dashboard/parametres',  label: 'Parametres',  icon: RiSettings3Line },
];

interface Props {
  alarmCount?: number;
}

export default function Sidebar({ alarmCount = 0 }: Props) {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, clearUser } = useAuthStore();
  const { disconnect } = useSocket([]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      disconnect();
      clearUser();
      router.push('/');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const initials = user?.userName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? 'MM';

  return (
    <aside className="w-[240px] min-h-screen bg-[#1B4332] flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <Image
          src="/logo.png"
          alt="Faucon"
          width={120}
          height={36}
          className="object-contain"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          const isAlerts = href.includes('alertes');

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-[10px]
                text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {isAlerts && alarmCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div
        className="px-4 py-4 border-t border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-all"
        onClick={handleLogout}
        title="Cliquer pour se déconnecter"
      >
        <div className="w-9 h-9 rounded-full bg-[#F59E0B] flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-white">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {user?.userName ?? 'Utilisateur'}
          </p>
          <p className="text-xs text-white/60">Compte operateur</p>
        </div>
      </div>
    </aside>
  );
}