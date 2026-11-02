'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';

export type Language = 'fr' | 'en';

// Dictionnaire unique FR/EN. Les clés absentes d'une langue retombent
// automatiquement sur le français, pour ne jamais afficher une clé brute.
const messages: Record<Language, Record<string, string>> = {
  fr: {
    'common.language': 'Langue',
    'nav.solution': 'Solution',
    'nav.innovation': 'Innovation',
    'nav.market': 'Marché',
    'nav.developers': 'Développeurs',
    'nav.client': 'Espace client',
    'nav.demo': 'Demander une démo',
    'nav.open': 'Ouvrir le menu',
    'nav.close': 'Fermer le menu',

    'hero.badge': 'Télémétrie de flotte · Cameroun',
    'hero.title1': 'Chaque véhicule.',
    'hero.title2': 'À vue.',
    'hero.title3': 'En temps réel.',
    'hero.body': 'Faucon relie traceurs GPS, véhicules et équipes dans une seule tour de contrôle : position live, alertes terrain, historique et diagnostic à distance. Pensé pour les routes africaines, pas seulement pour les tableaux de bord.',
    'hero.demo': 'Demander une démo',
    'hero.discover': 'Découvrir la solution',
    'hero.assurance1': 'Temps réel',
    'hero.assurance2': 'Alertes instantanées',
    'hero.assurance3': 'Historique des trajets',
    'hero.assurance4': 'Web + mobile',

    'login.welcome': 'Tour de contrôle des traceurs',
    'login.email': 'Adresse email',
    'login.password': 'Mot de passe',
    'login.submit': 'Se connecter',
    'login.adminOnly': 'Accès réservé au personnel Faucon',
    'login.back': 'Retour au site',
    'login.showPassword': 'Afficher le mot de passe',
    'login.hidePassword': 'Masquer le mot de passe',
    'login.noAdmin': "Ce compte n'a pas accès au dashboard admin",
    'login.badCredentials': 'Email ou mot de passe incorrect. Vérifiez vos identifiants et réessayez.',
    'login.welcomeUser': 'Bienvenue',

    'sidebar.dashboard': 'Dashboard',
    'sidebar.users': 'Utilisateurs',
    'sidebar.trackers': 'Traceurs',
    'sidebar.provision': 'Provisionner',
    'sidebar.alerts': 'Alertes',
    'sidebar.settings': 'Paramètres',
    'sidebar.admin': 'Administrateur',
    'sidebar.logout': 'Se déconnecter',
    'sidebar.language': 'Langue',

    'dashboard.title': 'Tour de contrôle',
    'dashboard.subtitle': "Vue d'ensemble du système Faucon",
    'dashboard.live': 'Temps réel actif',
    'dashboard.users': 'Utilisateurs',
    'dashboard.trackers': 'Traceurs',
    'dashboard.online': 'En ligne',
    'dashboard.active': 'Actifs',
    'dashboard.unacked': 'Alarmes non acquittées',
    'dashboard.today': "Alarmes aujourd'hui",
    'dashboard.mapTitle': 'Traceurs sur la carte',
    'dashboard.mapCount': 'en ligne ·',
    'dashboard.mapKnown': 'avec position connue',
    'dashboard.all': 'Tous les traceurs',
    'dashboard.follow': 'Suivre :',
    'dashboard.following': 'Suivi :',
    'dashboard.noPosition': 'Aucune position reçue pour le moment',
    'dashboard.growth': 'Croissance des utilisateurs',
    'dashboard.last30': '30 derniers jours',
    'dashboard.alarms': 'Alarmes',
    'dashboard.last7': '7 derniers jours',
    'dashboard.byType': 'Alarmes par type',
    'dashboard.allPeriods': 'Toutes périodes confondues',
    'dashboard.modes': 'Répartition des modes',
    'dashboard.allTrackers': 'Tous les traceurs',
    'dashboard.battery': 'Santé batterie',
    'dashboard.batterySub': 'Traceurs actifs, par tranche de charge',
    'dashboard.loadError': 'Impossible de charger les statistiques.',
    'dashboard.realtimeLost': 'Connexion temps réel perdue : les positions affichées peuvent être anciennes. Reconnexion automatique en cours…',
    'dashboard.realtimeDown': 'Connexion temps réel interrompue : les positions affichées ne se mettent plus à jour automatiquement.',
    'dashboard.reload': 'Recharger',
    'dashboard.sessionExpired': 'Session expirée. Veuillez vous reconnecter.',
  },
  en: {
    'common.language': 'Language',
    'nav.solution': 'Solution',
    'nav.innovation': 'Innovation',
    'nav.market': 'Market',
    'nav.developers': 'Developers',
    'nav.client': 'Client area',
    'nav.demo': 'Book a demo',
    'nav.open': 'Open menu',
    'nav.close': 'Close menu',

    'hero.badge': 'Fleet telemetry · Cameroon',
    'hero.title1': 'Every vehicle.',
    'hero.title2': 'In sight.',
    'hero.title3': 'In real time.',
    'hero.body': 'Faucon connects GPS trackers, vehicles and teams in a single control tower: live position, field alerts, trip history and remote diagnostics. Built for African roads, not just dashboards.',
    'hero.demo': 'Book a demo',
    'hero.discover': 'Discover the solution',
    'hero.assurance1': 'Real time',
    'hero.assurance2': 'Instant alerts',
    'hero.assurance3': 'Trip history',
    'hero.assurance4': 'Web + mobile',

    'login.welcome': 'Tracker control tower',
    'login.email': 'Email address',
    'login.password': 'Password',
    'login.submit': 'Sign in',
    'login.adminOnly': 'Faucon staff only',
    'login.back': 'Back to website',
    'login.showPassword': 'Show password',
    'login.hidePassword': 'Hide password',
    'login.noAdmin': 'This account cannot access the admin dashboard',
    'login.badCredentials': 'Incorrect email or password. Check your credentials and try again.',
    'login.welcomeUser': 'Welcome',

    'sidebar.dashboard': 'Dashboard',
    'sidebar.users': 'Users',
    'sidebar.trackers': 'Trackers',
    'sidebar.provision': 'Provision',
    'sidebar.alerts': 'Alerts',
    'sidebar.settings': 'Settings',
    'sidebar.admin': 'Administrator',
    'sidebar.logout': 'Sign out',
    'sidebar.language': 'Language',

    'dashboard.title': 'Control tower',
    'dashboard.subtitle': 'Faucon system overview',
    'dashboard.live': 'Real time active',
    'dashboard.users': 'Users',
    'dashboard.trackers': 'Trackers',
    'dashboard.online': 'Online',
    'dashboard.active': 'Active',
    'dashboard.unacked': 'Unacknowledged alerts',
    'dashboard.today': "Today's alerts",
    'dashboard.mapTitle': 'Trackers on the map',
    'dashboard.mapCount': 'online ·',
    'dashboard.mapKnown': 'with a known position',
    'dashboard.all': 'All trackers',
    'dashboard.follow': 'Follow:',
    'dashboard.following': 'Following:',
    'dashboard.noPosition': 'No position received yet',
    'dashboard.growth': 'User growth',
    'dashboard.last30': 'Last 30 days',
    'dashboard.alarms': 'Alerts',
    'dashboard.last7': 'Last 7 days',
    'dashboard.byType': 'Alerts by type',
    'dashboard.allPeriods': 'All time',
    'dashboard.modes': 'Mode distribution',
    'dashboard.allTrackers': 'All trackers',
    'dashboard.battery': 'Battery health',
    'dashboard.batterySub': 'Active trackers by charge range',
    'dashboard.loadError': 'Unable to load statistics.',
    'dashboard.realtimeLost': 'Real-time connection lost: displayed positions may be stale. Reconnecting automatically…',
    'dashboard.realtimeDown': 'Real-time connection interrupted: displayed positions no longer update automatically.',
    'dashboard.reload': 'Reload',
    'dashboard.sessionExpired': 'Session expired. Please sign in again.',
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const saved = window.localStorage.getItem('faucon_language');
    if (saved === 'en' || saved === 'fr') {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem('faucon_language', next);
    document.documentElement.lang = next;
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      let value = messages[language][key] ?? messages.fr[key] ?? key;
      if (vars) {
        for (const [name, replacement] of Object.entries(vars)) {
          value = value.replaceAll(`{${name}}`, String(replacement));
        }
      }
      return value;
    },
    [language]
  );

  const value = useMemo(
    () => ({ language, setLanguage, t }),
    [language, setLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used inside LanguageProvider');
  return value;
}
