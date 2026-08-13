'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { closeRealtime } from './useRealtime';

export const useLogout = () => {
  const router = useRouter();
  const { clearUser } = useAuthStore();

  const handleLogout = async (): Promise<void> => {
    try {
      await authService.logout();
      closeRealtime();
      clearUser();
      router.push('/');
    } catch {
      toast.error('Impossible de vous déconnecter. Réessayez dans un instant.');
    }
  };

  return { handleLogout };
};
