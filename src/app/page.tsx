import type { Metadata } from 'next';
import LandingExperience from '@/components/landing/LandingExperience';

export const metadata: Metadata = {
  title: {
    absolute: 'Faucon — Voir, surveiller, contrôler votre flotte',
  },
  description:
    'Traceurs GPS, position temps réel, alertes terrain, historique des trajets et diagnostic à distance. La plateforme de télématique pensée pour les flottes du Cameroun et d’Afrique centrale.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return <LandingExperience />;
}
