'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { closeRealtime } from './useRealtime';

// Point d'entrée UNIQUE pour se déconnecter — toute la logique (appel API,
// fermeture du temps réel, nettoyage du store, navigation) vit ici pour que
// les différents boutons "Se déconnecter" de l'app (Sidebar, page Paramètres)
// ne puissent pas diverger.
export const useLogout = () => {
  const router = useRouter();
  const { clearUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = async (): Promise<void> => {
    setLoading(true);
    try {
      await authService.logout();
      closeRealtime();
      clearUser();
      router.push('/');
    } catch {
      toast.error('Impossible de vous déconnecter. Réessayez dans un instant.');
      setLoading(false);
    }
  };

  return { handleLogout, loading };
};
