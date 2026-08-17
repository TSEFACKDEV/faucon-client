'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMenuOutline, IoCloudOfflineOutline } from 'react-icons/io5';
import Sidebar from './Sidebar';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useRealtimeStore } from '@/store/realtime.store';
import { reconnectRealtime } from '@/lib/realtime';
import { onAuthChangeFromOtherTab } from '@/lib/authBroadcast';
import Logo from '@/components/ui/Logo';

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearUser } = useAuthStore();
  const connexionRealtime = useRealtimeStore((s) => s.connexion);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/');
        return;
      }
      try {
        const user = await authService.me();
        if (!(await authService.ensureAdmin(user))) {
          clearUser();
          router.push('/');
          return;
        }
        setUser(user);
        setReady(true);
      } catch {
        // Session expirée, token invalide ou serveur injoignable : on renvoie
        // vers la page de connexion avec un message explicite (le toast est
        // ré-affiché par le conteneur de la page de connexion).
        toast.error('Session expirée. Veuillez vous reconnecter.');
        router.push('/');
      }
    };
    init();
  }, []);

  // Un login/logout dans un AUTRE onglet change les cookies (partagés par le
  // navigateur) sans que cet onglet-ci ne le sache — son store Zustand et sa
  // connexion Socket.IO restent sur l'ancienne identité. Un rechargement
  // complet est la façon la plus sûre de tout resynchroniser (état admin,
  // liste de véhicules visibles, souscriptions temps réel) plutôt que de
  // corriger chaque bout d'état en mémoire un par un.
  useEffect(() => onAuthChangeFromOtherTab(() => {
    window.location.reload();
  }), []);

  // Note : le tiroir mobile se referme lui-même au clic sur un lien de
  // navigation (onClick=onClose dans Sidebar) et sur le voile du fond.

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-0">
        <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-0">
      <AnimatePresence>{menuOpen && <Sidebar open onClose={() => setMenuOpen(false)} />}</AnimatePresence>
      <Sidebar />

      {/* Barre supérieure mobile : hamburger + marque */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-primary-600 shadow-md">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white/85 hover:text-white transition-colors p-1"
          aria-label="Ouvrir le menu"
        >
          <IoMenuOutline size={24} />
        </button>
        <Logo tone="white" size={22} />
      </header>

      <main className="lg:pl-[248px]">
        {connexionRealtime === 'deconnecte' && (
          <div
            role="status"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-warning-strong bg-warning-tint border-b border-warning"
          >
            <IoCloudOfflineOutline size={18} className="shrink-0" />
            <span>
              Connexion temps réel perdue : les positions affichées peuvent être
              anciennes. Reconnexion automatique en cours…
            </span>
          </div>
        )}
        {connexionRealtime === 'echec' && (
          <div
            role="status"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-danger-strong bg-danger-tint border-b border-danger"
          >
            <IoCloudOfflineOutline size={18} className="shrink-0" />
            <span className="flex-1">
              Connexion temps réel interrompue : les positions affichées ne se
              mettent plus à jour automatiquement.
            </span>
            <button
              onClick={() => reconnectRealtime()}
              className="shrink-0 font-semibold underline underline-offset-2 hover:no-underline"
            >
              Recharger
            </button>
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <ToastContainer position="top-right" autoClose={4000} closeOnClick pauseOnHover theme="light" />
    </div>
  );
}
