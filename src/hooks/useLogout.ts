'use client';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export const useLogout = () => {
  const router = useRouter();
  const { clearUser } = useAuthStore();

  const handleLogout = async (): Promise<void> => {
    try {
      await authService.logout();
      clearUser();
      router.push('/');
    } catch {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  return { handleLogout };
};
