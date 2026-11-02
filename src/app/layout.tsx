import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/i18n/LanguageProvider';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0057FF',
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://faucon.169.58.69.36.sslip.io'
  ),
  title: {
    template: '%s | Faucon',
    default: 'Faucon — Voir, surveiller, contrôler votre flotte',
  },
  description:
    'Faucon connecte traceurs GPS, véhicules et équipes : position temps réel, alertes terrain, historique des trajets et diagnostic à distance. Conçu au Cameroun pour les flottes africaines.',
  applicationName: 'Faucon',
  keywords: [
    'géolocalisation véhicule',
    'traceur GPS',
    'gestion de flotte',
    'Cameroun',
    'Afrique',
    'télémétrie',
    'alertes',
  ],
  openGraph: {
    title: 'Faucon — Voir, surveiller, contrôler votre flotte',
    description:
      'Position temps réel, alertes terrain et historique des trajets. Une plateforme web et mobile pensée pour les routes africaines.',
    type: 'website',
    locale: 'fr_CM',
    siteName: 'Faucon',
    images: [{ url: '/icon.png', width: 512, height: 512, alt: 'Faucon' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faucon — Voir, surveiller, contrôler votre flotte',
    description:
      'Le suivi de flotte pensé pour le terrain : temps réel, alertes, historique et diagnostic.',
    images: ['/icon.png'],
  },
  icons: {
    icon: [
      { url: '/icon.png', sizes: 'any', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="antialiased">
        <LanguageProvider>
          <div id="main-content">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
