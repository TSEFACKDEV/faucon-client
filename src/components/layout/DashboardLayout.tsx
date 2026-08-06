'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearUser } = useAuthStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/');
        return;
      }
      try {
        const user = await authService.me();
        if (user.role !== 'ADMIN') {
          await authService.logout();
          clearUser();
          router.push('/');
          return;
        }
        setUser(user);
        setReady(true);
      } catch {
        router.push('/');
      }
    };
    init();
  }, []);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-0">
        <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-neutral-0">
      <Sidebar />
      <main className="flex-1 overflow-auto">
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
