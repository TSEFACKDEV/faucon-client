'use client';
import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from './Sidebar';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useDeviceStore } from '@/store/device.store';
import { useDevices } from '@/hooks/useDevices';
import { useSocket } from '@/hooks/useSocket';

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const router     = useRouter();
  const { setUser, setLoading } = useAuthStore();
  const { alarms } = useDeviceStore();
  const { devices } = useDevices();
  const deviceIds   = devices.map((d) => d.id);

  useSocket(deviceIds);

  useEffect(() => {
    const init = async () => {
      if (!authService.isAuthenticated()) {
        router.push('/');
        return;
      }
      try {
        const user = await authService.me();
        setUser(user);
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const unreadAlarms = alarms.filter((a) => !a.estAcquittee).length;

  return (
    <div className="flex min-h-screen bg-[#F5F0E8]">
      <Sidebar alarmCount={unreadAlarms} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}