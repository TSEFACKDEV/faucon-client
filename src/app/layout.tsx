import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Optimisation du chargement de la police
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0057FF',
};

export const metadata: Metadata = {
  title: {
    template: '%s | Faucon Admin',
    default: 'Faucon Admin — Tour de contrôle',
  },
  description: "Dashboard interne d'administration Faucon : traceurs, utilisateurs, alertes.",
  applicationName: 'Faucon Admin',
  icons: {
    icon: [{ url: '/icon.png', sizes: 'any', type: 'image/png' }],
  },
  // Outil interne, pas un site public — ne doit jamais être indexé.
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} scroll-smooth`}>
      <body className={`${inter.className} antialiased`}>
        <main id="main-content" role="main">
          {children}
        </main>
      </body>
    </html>
  );
}
