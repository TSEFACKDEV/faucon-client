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
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://faucon.cm'), // À remplacer par ton URL
  title: {
    template: '%s | Faucon',
    default: 'Faucon — GPS Tracking Made in Cameroun',
  },
  description: 'Localisez vos conteneurs en temps réel avec Faucon. Solution de géolocalisation innovante pour la logistique au Cameroun.',
  keywords: ['GPS tracking', 'Cameroun', 'logistique', 'conteneurs', 'géolocalisation'],
  authors: [{ name: 'Faucon' }],
  creator: 'Faucon',
  publisher: 'Faucon',
  applicationName: 'Faucon',
  category: 'technology',
  icons: {
    icon: [
      { url: '/icon.png', sizes: 'any', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  
  openGraph: {
    type: 'website',
    title: 'Faucon — GPS Tracking Made in Cameroun',
    description: 'Localisez vos conteneurs en temps réel.',
    siteName: 'Faucon',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Faucon GPS Tracking',
      },
    ],
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Faucon — GPS Tracking Made in Cameroun',
    description: 'Localisez vos conteneurs en temps réel.',
    images: ['/twitter-image.png'],
    creator: '@faucon',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'votre-code-verification-google', // À remplacer
  },
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