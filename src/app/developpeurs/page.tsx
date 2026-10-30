import type { Metadata } from 'next';
import ApiDocsExperience from '@/components/developers/ApiDocsExperience';

export const metadata: Metadata = {
  title: 'API propriétaire',
  description:
    'API propriétaire Faucon : récupérez en lecture seule l’état et les déplacements de vos traceurs. Clé API dédiée, endpoints REST, historique brut, alertes, Socket.IO et exemples de code.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/developpeurs' },
};

export default function DevelopersPage() {
  return <ApiDocsExperience />;
}
