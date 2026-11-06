'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  IoArrowForwardOutline,
  IoCodeSlashOutline,
  IoFlashOutline,
  IoLockClosedOutline,
  IoServerOutline,
  IoTerminalOutline,
  IoSwapHorizontalOutline,
} from 'react-icons/io5';
import { Reveal, SectionLabel } from './Reveal';
import { useLanguage } from '@/i18n/LanguageProvider';

type Localized = { fr: string; en: string };
const L = (fr: string, en: string): Localized => ({ fr, en });

const samples = {
  curl: `curl -s "https://api.faucon.cm/api/owner/vehicles" \\
  -H "X-API-Key: fk_live_VOTRE_CLE"

curl -s "https://api.faucon.cm/api/owner/vehicles/ID/position/last" \\
  -H "X-API-Key: fk_live_VOTRE_CLE"`,
  javascript: `const API = 'https://api.faucon.cm/api';
const key = process.env.FAUCON_API_KEY;

async function ownerGet(path) {
  const response = await fetch(API + path, {
    headers: { 'X-API-Key': key },
  });
  const body = await response.json();
  if (!response.ok || !body.success) {
    throw new Error(body.message);
  }
  return body.data;
}

const vehicles = await ownerGet('/owner/vehicles');
const position = await ownerGet(
  '/owner/vehicles/' + vehicles[0].id + '/position/last'
);`,
  python: `import os
import requests

API = "https://api.faucon.cm/api"
HEADERS = {"X-API-Key": os.environ["FAUCON_API_KEY"]}

vehicles = requests.get(
    API + "/owner/vehicles",
    headers=HEADERS,
    timeout=10,
).json()["data"]

position = requests.get(
    API + "/owner/vehicles/" + vehicles[0]["id"] + "/position/last",
    headers=HEADERS,
    timeout=10,
).json()["data"]`,
} as const;

const tabs = [
  { id: 'curl', label: 'cURL', icon: <IoTerminalOutline /> },
  { id: 'javascript', label: 'JavaScript', icon: <IoCodeSlashOutline /> },
  { id: 'python', label: 'Python', icon: <IoCodeSlashOutline /> },
] as const;

const capabilities = [
  {
    icon: <IoFlashOutline />,
    title: L('Temps réel', 'Real time'),
    text: L(
      'Un flux Socket.IO en lecture seule pour les positions et alertes de vos traceurs.',
      'A read-only Socket.IO stream for your trackers’ positions and alerts.'
    ),
  },
  {
    icon: <IoLockClosedOutline />,
    title: L('Clé API dédiée', 'Dedicated API key'),
    text: L(
      'Une clé par intégration, scope owner:read, révocable immédiatement.',
      'One key per integration, owner:read scope, immediately revocable.'
    ),
  },
  {
    icon: <IoServerOutline />,
    title: L('REST simple', 'Simple REST'),
    text: L(
      'Enveloppe JSON unique, historique brut, aucune pagination cachée.',
      'Single JSON envelope, raw history, no hidden pagination.'
    ),
  },
  {
    icon: <IoSwapHorizontalOutline />,
    title: L('Vos appareils uniquement', 'Your devices only'),
    text: L(
      'La clé ne voit que les traceurs rattachés à votre compte. Aucune donnée interne.',
      'The key only sees trackers linked to your account. No internal data.'
    ),
  },
];

export default function DeveloperSection() {
  const { tr } = useLanguage();
  const [active, setActive] = useState<(typeof tabs)[number]['id']>('curl');
  const reduce = useReducedMotion();

  return (
    <section id="developpeurs" className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-100 to-transparent" />
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <Reveal>
            <SectionLabel>{tr('Pour les équipes techniques', 'For technical teams')}</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-neutral-900 md:text-5xl">
              {tr('Branchez Faucon', 'Plug Faucon')}
              <span className="block text-primary-600">{tr('dans vos propres outils.', 'into your own tools.')}</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-neutral-600 md:text-base">
              {tr('ERP, back-office logistique, application métier, tableau de bord assurance : l’API propriétaire Faucon expose uniquement vos traceurs, leurs positions brutes, leurs alertes et leur état. Lecture seule, clé dédiée, données internes jamais exposées.', 'ERP, logistics back office, business app, insurance dashboard: the Faucon owner API exposes only your trackers, their raw positions, alerts and status. Read-only, dedicated key, internal data never exposed.')}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {capabilities.map((item) => (
                <div
                  key={item.title.fr}
                  className="rounded-xl border border-neutral-100 bg-neutral-0/60 p-4"
                >
                  <div className="flex items-center gap-2 text-primary-600">
                    {item.icon}
                    <p className="text-xs font-bold text-neutral-900">{tr(item.title.fr, item.title.en)}</p>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-neutral-600">
                    {tr(item.text.fr, item.text.en)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/developpeurs"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-accent-400 px-6 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(0,87,255,0.24)] transition-transform hover:-translate-y-0.5"
              >
                {tr('Lire la documentation API', 'Read the API documentation')}
                <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-6 py-3.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                {tr('Parler à un intégrateur', 'Talk to an integrator')}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="overflow-hidden rounded-3xl border border-primary-100 bg-primary-900 shadow-[0_24px_70px_rgba(11,21,38,0.18)]">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-danger" />
                  <span className="h-2.5 w-2.5 rounded-full bg-gold-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-success" />
                  <span className="ml-2 text-[10px] font-medium text-primary-100/50">
                    api.faucon — quick start
                  </span>
                </div>
                <span className="rounded-full border border-accent-400/20 bg-accent-400/10 px-2 py-0.5 text-[9px] font-bold text-accent-300">
                  JSON · JWT
                </span>
              </div>

              <div className="flex gap-1 border-b border-white/10 px-3 pt-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActive(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-t-lg px-3 py-2 text-[11px] font-semibold transition-colors ${
                      active === tab.id
                        ? 'bg-white/[0.08] text-white'
                        : 'text-primary-100/45 hover:text-primary-100/80'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <motion.pre
                key={active}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="max-h-[360px] overflow-auto p-5 text-[11px] leading-relaxed text-primary-100/85"
              >
                <code>{samples[active]}</code>
              </motion.pre>

              <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-4 py-3">
                {[
                  'GET /owner/vehicles',
                  'GET /owner/vehicles/:id/position/last',
                  'GET /owner/vehicles/:id/positions',
                  'GET /owner/vehicles/:id/alerts',
                  'socket position_update',
                ].map((endpoint) => (
                  <span
                    key={endpoint}
                    className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-[9px] text-primary-100/55"
                  >
                    {endpoint}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
