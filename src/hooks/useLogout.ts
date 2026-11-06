'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { closeRealtime } from './useRealtime';
import { useLanguage } from '@/i18n/LanguageProvider';

// Point d'entrée UNIQUE pour se déconnecter — toute la logique (appel API,
// fermeture du temps réel, nettoyage du store, navigation) vit ici pour que
// les différents boutons "Se déconnecter" de l'app (Sidebar, page Paramètres)
// ne puissent pas diverger.
export const useLogout = () => {
  const { tr } = useLanguage();
  const router = useRouter();
  const { clearUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      closeRealtime();
      clearUser();
      router.push('/login');
    } catch {
      toast.error(tr('Impossible de vous déconnecter. Réessayez dans un instant.', 'Unable to sign out. Try again in a moment.'));
      setLoading(false);
    }
  };

  return { handleLogout, loading };
};
