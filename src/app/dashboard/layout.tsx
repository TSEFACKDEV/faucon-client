import type { Metadata } from 'next';
import { ReactNode } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Le dashboard est un outil interne : il ne doit jamais être indexé, même si
// la landing page publique, elle, est ouverte aux moteurs de recherche.
export const metadata: Metadata = {
  title: {
    template: '%s | Faucon Admin',
    default: 'Faucon Admin — Tour de contrôle',
  },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}