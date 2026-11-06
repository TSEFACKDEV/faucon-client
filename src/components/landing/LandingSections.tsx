'use client';

import { FormEvent, ReactNode, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  IoArrowForwardOutline,
  IoBatteryHalfOutline,
  IoSpeedometerOutline,
  IoMapOutline,
  IoNavigateOutline,
  IoTimeOutline,
  IoShieldCheckmarkOutline,
  IoLayersOutline,
  IoPulseOutline,
  IoHardwareChipOutline,
  IoRadioOutline,
  IoCloudOfflineOutline,
  IoDocumentTextOutline,
  IoGlobeOutline,
  IoBusinessOutline,
  IoCarOutline,
  IoConstructOutline,
  IoLockClosedOutline,
  IoCheckmarkCircle,
  IoCallOutline,
  IoMailOutline,
  IoLocationOutline,
  IoSparklesOutline,
  IoWifiOutline,
  IoStatsChartOutline,
} from 'react-icons/io5';
import { Reveal, SectionLabel } from './Reveal';
import { useLanguage } from '@/i18n/LanguageProvider';

type Localized = { fr: string; en: string };
const L = (fr: string, en: string): Localized => ({ fr, en });

/* ─────────────────────────── PROBLÈME ─────────────────────────── */

const problems = [
  {
    icon: <IoMapOutline />,
    tag: L('Angle mort', 'Blind spot'),
    title: L('Un véhicule hors de vue est un risque', 'A vehicle out of sight is a risk'),
    text: L(
      'Sans position fiable, chaque trajet devient une incertitude : détournement, immobilisation, marchandise perdue.',
      'Without a reliable position, every trip becomes uncertain: diversion, immobilisation, lost cargo.'
    ),
  },
  {
    icon: <IoTimeOutline />,
    tag: L('Réaction tardive', 'Late reaction'),
    title: L('Quand l’alerte arrive, il est déjà trop tard', 'By the time the alert arrives, it is too late'),
    text: L(
      'Une vitesse excessive ou une sortie de zone signalée des heures après les faits ne protège ni le véhicule ni l’équipe.',
      'A speeding or geofence event reported hours later protects neither the vehicle nor the team.'
    ),
  },
  {
    icon: <IoStatsChartOutline />,
    tag: L('Décision à l’aveugle', 'Blind decisions'),
    title: L('Des données dispersées, aucune vue d’ensemble', 'Scattered data, no overview'),
    text: L(
      'Tableurs, appels, messages : les informations existent, mais ne permettent pas de décider vite et au bon endroit.',
      'Spreadsheets, calls and messages: the information exists, but does not help decide quickly in the right place.'
    ),
  },
];

export function ProblemSection() {
  const { t, tr } = useLanguage();
  return (
    <section id="probleme" className="relative overflow-hidden bg-neutral-0 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel>{t('section.problem')}</SectionLabel>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h2 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-neutral-900 md:text-5xl">
              {t('problem.title')}
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base lg:justify-self-end">
              {t('problem.body')}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {problems.map((item, index) => (
            <Reveal key={item.title.fr} delay={index * 0.08}>
              <motion.article
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="group h-full rounded-2xl border border-neutral-100 bg-white p-7 shadow-[0_2px_10px_rgba(11,21,38,0.05)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-accent-400 text-xl text-white shadow-lg shadow-primary-600/20">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-600">
                  {tr(item.tag.fr, item.tag.en)}
                </p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-neutral-900">
                  {tr(item.title.fr, item.title.en)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{tr(item.text.fr, item.text.en)}</p>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── SOLUTION ─────────────────────────── */

const features = [
  {
    icon: <IoNavigateOutline />,
    title: L('Position GPS temps réel', 'Real-time GPS position'),
    text: L(
      'Le camion avance sur la carte avec son cap réel, une interpolation fluide et un suivi qui respecte votre zoom.',
      'The truck moves on the map with its real heading, smooth interpolation and tracking that respects your zoom.'
    ),
  },
  {
    icon: <IoTimeOutline />,
    title: L('Historique & rejeu', 'History & replay'),
    text: L(
      'Rejouez une journée, mesurez les arrêts, vérifiez un itinéraire. Les trajets passés restent consultables.',
      'Replay a day, measure stops and check a route. Past trips remain available.'
    ),
  },
  {
    icon: <IoLayersOutline />,
    title: L('Zones de sécurité', 'Safety zones'),
    text: L(
      'Définissez un périmètre autour d’un site ou d’un client. Une sortie de zone déclenche une alerte immédiate.',
      'Define a perimeter around a site or customer. Leaving the zone triggers an immediate alert.'
    ),
  },
  {
    icon: <IoSpeedometerOutline />,
    title: L('Vitesse & conduite', 'Speed & driving'),
    text: L(
      'Seuils personnalisables, excès détectés, événements de conduite brutale remontés avec le contexte GPS.',
      'Custom thresholds, detected speeding and harsh-driving events reported with GPS context.'
    ),
  },
  {
    icon: <IoBatteryHalfOutline />,
    title: L('Batterie & santé du boîtier', 'Battery & device health'),
    text: L(
      'Niveau de batterie, signal, satellites et diagnostic du traceur : vous savez quand un boîtier décroche.',
      'Battery level, signal, satellites and tracker diagnostics: you know when a device drops off.'
    ),
  },
  {
    icon: <IoRadioOutline />,
    title: L('Commandes à distance', 'Remote commands'),
    text: L(
      'Localiser maintenant, changer de mode, lire le mode réel : le traceur répond, l’application confirme.',
      'Locate now, change mode, read the real mode: the tracker responds and the app confirms.'
    ),
  },
];

export function SolutionSection() {
  const { t, tr } = useLanguage();
  return (
    <section id="solution" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <Reveal>
            <SectionLabel>{t('section.solution')}</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-neutral-900 md:text-5xl">
              {t('solution.title1')}
              <span className="block text-primary-600">{t('solution.title2')}</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
              {t('solution.body')}
            </p>

            <div className="mt-8 space-y-3 rounded-2xl border border-primary-100 bg-primary-50/60 p-5">
              {[
                tr('Vue consolidée de tous les véhicules', 'Consolidated view of all vehicles'),
                tr('Alertes compréhensibles, acquittables et historisées', 'Clear, acknowledgeable and historised alerts'),
                tr('Même expérience sur le web et sur mobile', 'The same experience on web and mobile'),
                tr('Fonctionne avec un traceur Faucon ou un boîtier compatible', 'Works with a Faucon tracker or a compatible device'),
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm font-medium text-primary-900">
                  <IoCheckmarkCircle className="mt-0.5 shrink-0 text-primary-600" size={17} />
                  {item}
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary-700"
            >
              {tr('Voir Faucon sur votre flotte', 'See Faucon on your fleet')}
              <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <Reveal key={feature.title.fr} delay={index * 0.05}>
                <div className="group h-full rounded-2xl border border-neutral-100 bg-neutral-0/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:bg-white hover:shadow-[0_16px_40px_rgba(11,21,38,0.08)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg text-primary-600 shadow-sm ring-1 ring-neutral-100">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-neutral-900">{tr(feature.title.fr, feature.title.en)}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">{tr(feature.text.fr, feature.text.en)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────── OPPORTUNITÉ ─────────────────────────── */

const opportunities = [
  {
    icon: <IoCarOutline />,
    title: L('Transport & logistique', 'Transport & logistics'),
    text: L(
      'Camions, utilitaires, distribution urbaine et interurbaine : la visibilité devient un avantage opérationnel.',
      'Trucks, vans, urban and intercity distribution: visibility becomes an operational advantage.'
    ),
    figure: '01',
  },
  {
    icon: <IoBusinessOutline />,
    title: L('Entreprises & BTP', 'Businesses & construction'),
    text: L(
      'Chantiers, engins, véhicules de service : localiser, encadrer et prouver l’usage réel des actifs.',
      'Sites, machinery and service vehicles: locate, supervise and prove the real use of assets.'
    ),
    figure: '02',
  },
  {
    icon: <IoShieldCheckmarkOutline />,
    title: L('Assurance & risque', 'Insurance & risk'),
    text: L(
      'Un historique daté et contextualisé change la façon de constater, prévenir et traiter un sinistre.',
      'Dated, contextualised history changes how claims are assessed, prevented and handled.'
    ),
    figure: '03',
  },
  {
    icon: <IoGlobeOutline />,
    title: L('Secteur public & ONG', 'Public sector & NGOs'),
    text: L(
      'Santé, eau, agriculture, humanitaire : des flottes utiles là où la connectivité est imparfaite.',
      'Health, water, agriculture, humanitarian: useful fleets where connectivity is imperfect.'
    ),
    figure: '04',
  },
];

export function OpportunitySection() {
  const { t, tr } = useLanguage();
  return (
    <section id="marche" className="relative overflow-hidden bg-neutral-0 py-24 md:py-32">
      <div className="absolute inset-0 bg-blueprint opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel>{t('section.opportunity')}</SectionLabel>
          <div className="mt-5 max-w-4xl">
            <h2 className="text-3xl font-bold tracking-[-0.035em] text-neutral-900 md:text-5xl">
              {t('opportunity.title')}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
              {t('opportunity.body')}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {opportunities.map((item, index) => (
            <Reveal key={item.title.fr} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-white bg-white/85 p-6 shadow-[0_2px_10px_rgba(11,21,38,0.05)] backdrop-blur">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 text-xl text-primary-600">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-base font-bold text-neutral-900">{tr(item.title.fr, item.title.en)}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">{tr(item.text.fr, item.text.en)}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-primary-100 bg-white p-6 md:flex-row md:items-center md:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white">
                <IoSparklesOutline size={20} />
              </div>
              <div>
                <p className="text-base font-bold text-neutral-900">
                  {tr('Un marché qui demande de la preuve, pas des promesses.', 'A market that demands proof, not promises.')}
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  {tr('Faucon répond avec un historique, des alertes explicables et un diagnostic du matériel — trois briques de confiance.', 'Faucon answers with history, explainable alerts and hardware diagnostics — three building blocks of trust.')}
                </p>
              </div>
            </div>
            <a
              href="#contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary-200 px-5 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50"
            >
              {tr('Échanger sur votre cas', 'Discuss your case')}
              <IoArrowForwardOutline />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── INNOVATION ─────────────────────────── */

const innovations = [
  {
    icon: <IoHardwareChipOutline />,
    title: L('Firmware Faucon', 'Faucon firmware'),
    text: L(
      'ESP32-C3, journal local, horloge GPS autonome et cap fusionné GPS + gyroscope.',
      'ESP32-C3, local storage, autonomous GPS clock and GPS + gyroscope fused heading.'
    ),
  },
  {
    icon: <IoRadioOutline />,
    title: L('Modes adaptatifs', 'Adaptive modes'),
    text: L(
      'WORK, MOVE, STANDBY : le rythme de report s’adapte au mouvement et à l’énergie disponible.',
      'WORK, MOVE, STANDBY: reporting cadence adapts to movement and available energy.'
    ),
  },
  {
    icon: <IoPulseOutline />,
    title: L('Diagnostic continu', 'Continuous diagnostics'),
    text: L(
      'Le boîtier remonte santé, mémoire, redémarrages et état de la liaison.',
      'The device reports health, memory, restarts and link status.'
    ),
  },
  {
    icon: <IoCloudOfflineOutline />,
    title: L('Résilience réseau', 'Network resilience'),
    text: L(
      'Les positions sont conservées en local quand le réseau tombe, puis republiées au retour.',
      'Positions are stored locally when the network drops, then republished when it returns.'
    ),
  },
  {
    icon: <IoDocumentTextOutline />,
    title: L('Historique exploitable', 'Usable history'),
    text: L(
      'Chaque événement est daté, contextualisé et consultable : trajets, alertes, diagnostics.',
      'Every event is timestamped, contextualised and available: trips, alerts, diagnostics.'
    ),
  },
  {
    icon: <IoLockClosedOutline />,
    title: L('Chaîne maîtrisée', 'Controlled chain'),
    text: L(
      'De la trame MQTT au WebSocket, Faucon contrôle la donnée de bout en bout.',
      'From the MQTT frame to the WebSocket, Faucon controls data end to end.'
    ),
  },
];

export function InnovationSection() {
  const { t, tr } = useLanguage();
  return (
    <section
      id="innovation"
      className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-24 text-white md:py-32"
    >
      <div className="absolute inset-0 bg-blueprint opacity-[0.12]" />
      <div className="pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-accent-500/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel tone="white">{t('section.innovation')}</SectionLabel>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h2 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] md:text-5xl">
              {t('innovation.title1')}
              <span className="block text-accent-300">{t('innovation.title2')}</span>
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-primary-100/75 md:text-base lg:justify-self-end">
              {t('innovation.body')}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur md:p-8">
            <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
              <FlowNode icon={<IoHardwareChipOutline />} title={tr('Traceur', 'Tracker')} caption={tr('GPS · cap · capteurs', 'GPS · heading · sensors')} />
              <FlowArrow />
              <FlowNode icon={<IoWifiOutline />} title="MQTT" caption={tr('Réseau mobile', 'Mobile network')} />
              <FlowArrow />
              <FlowNode icon={<IoPulseOutline />} title={tr('Cloud Faucon', 'Faucon cloud')} caption={tr('Temps réel · alertes', 'Real time · alerts')} />
              <FlowArrow />
              <FlowNode icon={<IoGlobeOutline />} title="Web + mobile" caption={tr('Une seule vérité', 'One source of truth')} />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[11px] font-medium text-primary-100/60">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                {tr('Flux chiffré', 'Encrypted stream')}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {tr('Journal local en cas de coupure', 'Local log during outages')}
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                {tr('Diagnostic à distance', 'Remote diagnostics')}
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {innovations.map((item, index) => (
            <Reveal key={item.title.fr} delay={index * 0.05}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-colors hover:border-accent-400/30 hover:bg-white/[0.06]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400/10 text-lg text-accent-300">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-sm font-bold text-white">{tr(item.title.fr, item.title.en)}</h3>
                <p className="mt-2 text-xs leading-relaxed text-primary-100/65">{tr(item.text.fr, item.text.en)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FlowNode({
  icon,
  title,
  caption,
}: {
  icon: ReactNode;
  title: string;
  caption: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-primary-900/40 px-4 py-3.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent-400/10 text-accent-300">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-white">{title}</p>
        <p className="truncate text-[9px] text-primary-100/50">{caption}</p>
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div className="hidden items-center justify-center md:flex" aria-hidden="true">
      <motion.span
        className="h-px w-8 bg-gradient-to-r from-accent-400/20 via-accent-400 to-accent-400/20"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ─────────────────────────── DÉFI ─────────────────────────── */

const challenges = [
  {
    icon: <IoCloudOfflineOutline />,
    title: L('Connectivité intermittente', 'Intermittent connectivity'),
    text: L(
      'Le réseau tombe, revient, change de cellule. Le système doit continuer à collecter puis rattraper son retard.',
      'The network drops, returns and changes cells. The system must keep collecting, then catch up.'
    ),
    answer: L('Journal local + republication', 'Local log + republishing'),
  },
  {
    icon: <IoBatteryHalfOutline />,
    title: L('Énergie limitée', 'Limited power'),
    text: L(
      'Chaque report coûte de la batterie. Le rythme doit s’adapter au mouvement réel du véhicule.',
      'Every transmission costs battery. The cadence must adapt to the vehicle’s actual movement.'
    ),
    answer: L('Modes WORK / MOVE / STANDBY', 'WORK / MOVE / STANDBY modes'),
  },
  {
    icon: <IoConstructOutline />,
    title: L('Terrain exigeant', 'Demanding terrain'),
    text: L(
      'Chaleur, poussière, vibrations et installation électrique variable : le boîtier doit être diagnostiquable.',
      'Heat, dust, vibration and variable wiring: the device must be diagnosable.'
    ),
    answer: L('Diagnostic + compteurs de reset', 'Diagnostics + reset counters'),
  },
  {
    icon: <IoBusinessOutline />,
    title: L('Coût d’adoption', 'Cost of adoption'),
    text: L(
      'Le prix doit rester compatible avec des flottes petites et moyennes, sans abonnement inutile.',
      'Pricing must remain affordable for small and medium fleets, without unnecessary subscriptions.'
    ),
    answer: L('Plateforme web + mobile incluse', 'Web + mobile platform included'),
  },
];

export function ChallengeSection() {
  const { t, tr } = useLanguage();
  return (
    <section id="defi" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel>{t('section.challenge')}</SectionLabel>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <h2 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-neutral-900 md:text-5xl">
              {t('challenge.title1')}
              <span className="block text-primary-600">{t('challenge.title2')}</span>
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-neutral-600 md:text-base lg:justify-self-end">
              {t('challenge.body')}
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {challenges.map((item, index) => (
            <Reveal key={item.title.fr} delay={index * 0.06}>
              <div className="flex h-full gap-4 rounded-2xl border border-neutral-100 bg-neutral-0/60 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning-tint text-lg text-warning-strong">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{tr(item.title.fr, item.title.en)}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">{tr(item.text.fr, item.text.en)}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success-tint px-2.5 py-1 text-[10px] font-bold text-success-strong">
                    <IoCheckmarkCircle size={12} />
                    {tr(item.answer.fr, item.answer.en)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 rounded-xl border border-warning/20 bg-warning-tint/70 px-5 py-4 text-xs leading-relaxed text-warning-strong">
            <strong>{tr('Transparence', 'Transparency')} :</strong>{' '}
            {tr(
              'Faucon est un produit en construction active. Le diagnostic embarqué existe précisément pour rendre visibles les limites du terrain, plutôt que de les masquer derrière une promesse de disponibilité parfaite.',
              'Faucon is a product under active development. Embedded diagnostics exist precisely to make field limitations visible, rather than hiding them behind a promise of perfect availability.'
            )}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── AMBITION ─────────────────────────── */

export function AmbitionSection() {
  const { t, tr } = useLanguage();
  const reduce = useReducedMotion();
  return (
    <section
      id="ambition"
      className="relative overflow-hidden bg-primary-900 py-24 text-white md:py-32"
    >
      <div className="absolute inset-0 bg-blueprint opacity-[0.12]" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[500px] w-[500px] rounded-full bg-gold-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <SectionLabel tone="white">{t('section.ambition')}</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] md:text-6xl">
              {t('ambition.title1')}
              <span className="block text-gold-300">{t('ambition.title2')}</span>
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-primary-100/75 md:text-base">
              {t('ambition.body')}
            </p>
            <div className="mt-9 space-y-0">
              <AmbitionStep
                label={tr('Aujourd’hui', 'Today')}
                title={tr('Cameroun', 'Cameroon')}
                text={tr('Traceurs, plateforme web et application mobile, diagnostic et alertes terrain.', 'Trackers, web and mobile platform, diagnostics and field alerts.')}
                active
              />
              <AmbitionStep
                label={tr('Ensuite', 'Next')}
                title={tr('Afrique centrale', 'Central Africa')}
                text={tr('Adapter le report, les langues et le support aux réalités de chaque marché.', 'Adapt reporting, languages and support to each market’s reality.')}
              />
              <AmbitionStep
                label={tr('Demain', 'Tomorrow')}
                title={tr('Afriques', 'Africa')}
                text={tr('Transport, logistique, assurance, secteur public : une même exigence de fiabilité.', 'Transport, logistics, insurance, public sector: the same demand for reliability.')}
                last
              />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative mx-auto max-w-[520px] rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-100/50">
                  {tr('Présence envisagée', 'Planned presence')}
                </p>
                <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1 text-[9px] font-bold text-gold-300">
                  {tr('Cameroun · départ', 'Cameroon · starting point')}
                </span>
              </div>

              <div className="relative mt-6 aspect-[5/4]">
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_50%,rgba(0,194,255,0.10),transparent_65%)]" />
                <svg viewBox="0 0 400 320" className="h-full w-full" aria-hidden="true">
                  <defs>
                    <radialGradient id="globeGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#00C2FF" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#00C2FF" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="200" cy="160" r="128" fill="url(#globeGlow)" />
                  <circle cx="200" cy="160" r="112" fill="none" stroke="rgba(255,255,255,0.08)" />
                  <circle cx="200" cy="160" r="82" fill="none" stroke="rgba(255,255,255,0.07)" />
                  <circle cx="200" cy="160" r="52" fill="none" stroke="rgba(255,255,255,0.06)" />
                  {/* Points de présence */}
                  {[
                    [222, 176, 'Yaoundé'],
                    [188, 188, 'Douala'],
                    [244, 142, 'Bertoua'],
                    [178, 132, 'Bafoussam'],
                    [260, 206, 'Brazzaville'],
                    [284, 232, 'Kinshasa'],
                    [230, 246, 'Libreville'],
                  ].map(([x, y, name]) => (
                    <g key={name as string}>
                      <circle cx={x as number} cy={y as number} r="4" fill="#00C2FF" opacity="0.9" />
                      <circle cx={x as number} cy={y as number} r="10" fill="#00C2FF" opacity="0.08" />
                      <text
                        x={(x as number) + 10}
                        y={(y as number) + 3}
                        fill="rgba(255,255,255,0.55)"
                        fontSize="8"
                        fontFamily="Inter, sans-serif"
                      >
                        {name}
                      </text>
                    </g>
                  ))}
                  <path
                    d="M178 132 C200 142 214 158 222 176 C232 194 246 218 284 232"
                    stroke="#FFB000"
                    strokeWidth="1.5"
                    strokeDasharray="4 5"
                    fill="none"
                    opacity="0.8"
                  />
                </svg>
                {!reduce && (
                  <motion.span
                    className="absolute left-[55.5%] top-[55%] h-2 w-2 rounded-full bg-accent-300 shadow-[0_0_18px_rgba(0,194,255,0.9)]"
                    animate={{ scale: [1, 2.4, 1], opacity: [0.9, 0.2, 0.9] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </div>
              <p className="mt-2 text-center text-[10px] text-primary-100/40">
                {tr('Carte illustrative — les déploiements réels suivent les partenaires et le terrain.', 'Illustrative map — real deployments follow partners and field conditions.')}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AmbitionStep({
  label,
  title,
  text,
  active,
  last,
}: {
  label: string;
  title: string;
  text: string;
  active?: boolean;
  last?: boolean;
}) {
  return (
    <div className="relative flex gap-5 pb-8 last:pb-0">
      {!last && <span className="absolute left-[7px] top-4 h-full w-px bg-white/10" />}
      <span
        className={`relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
          active ? 'border-gold-400 bg-gold-400' : 'border-white/25 bg-primary-900'
        }`}
      >
        {active && <span className="absolute inset-0 animate-ping rounded-full bg-gold-400/40" />}
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-100/40">{label}</p>
        <h3 className="mt-1 text-lg font-bold text-white">{title}</h3>
        <p className="mt-1 max-w-md text-xs leading-relaxed text-primary-100/60">{text}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── CONTACT ─────────────────────────── */

export function ContactSection() {
  const { t, tr } = useLanguage();
  const [status, setStatus] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const company = String(form.get('company') ?? '').trim();
    const phone = String(form.get('phone') ?? '').trim();
    const fleet = String(form.get('fleet') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();

    const subject = encodeURIComponent(tr(`Demande de démo Faucon${company ? ` — ${company}` : ''}`, `Faucon demo request${company ? ` — ${company}` : ''}`));
    const body = encodeURIComponent(
      [
        `${tr('Nom', 'Name')} : ${name}`,
        `${tr('Entreprise', 'Company')} : ${company || '—'}`,
        `${tr('Téléphone / WhatsApp', 'Phone / WhatsApp')} : ${phone || '—'}`,
        `${tr('Taille de flotte', 'Fleet size')} : ${fleet || '—'}`,
        '',
        `${tr('Besoin', 'Need')} :`,
        message || '—',
      ].join('\n')
    );
    window.location.href = `mailto:admin@faucon.cm?subject=${subject}&body=${body}`;
    setStatus(tr('Votre messagerie s’ouvre avec le message prérempli. Vous pouvez aussi écrire à admin@faucon.cm.', 'Your email app opens with the message pre-filled. You can also write to admin@faucon.cm.'));
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-neutral-0 py-24 md:py-32">
      <div className="absolute inset-0 bg-blueprint opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionLabel>{t('section.action')}</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-neutral-900 md:text-5xl">
              {t('action.title1')}
              <span className="block text-primary-600">{t('action.title2')}</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
              {t('action.body')}
            </p>

            <div className="mt-8 space-y-4">
              <ContactLine icon={<IoMailOutline />} label={tr('Écrire', 'Email')} value="admin@faucon.cm" href="mailto:admin@faucon.cm" />
              <ContactLine icon={<IoLocationOutline />} label={tr('Basé à', 'Based in')} value={tr('Cameroun', 'Cameroon')} />
              <ContactLine icon={<IoCallOutline />} label={tr('Réponse', 'Response')} value={tr('Sous 48 h ouvrées', 'Within 48 business hours')} />
            </div>

            <div className="mt-8 rounded-2xl border border-primary-100 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
                {tr('Déjà client ?', 'Already a customer?')}
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                {tr('Accédez directement à votre tour de contrôle.', 'Go straight to your control tower.')}
              </p>
              <Link
                href="/login"
                className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-700"
              >
                {tr('Ouvrir l’espace client', 'Open the client area')}
                <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-[0_20px_60px_rgba(11,21,38,0.08)] md:p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={tr('Nom', 'Name')} name="name" placeholder={tr('Votre nom', 'Your name')} required />
                <Field label={tr('Entreprise', 'Company')} name="company" placeholder={tr('Nom de l’entreprise', 'Company name')} />
                <Field label={tr('Téléphone / WhatsApp', 'Phone / WhatsApp')} name="phone" type="tel" placeholder="+237 …" />
                <Field label={tr('Taille de flotte', 'Fleet size')} name="fleet" placeholder={tr('Ex. 5 à 50 véhicules', 'E.g. 5 to 50 vehicles')} />
              </div>
              <div className="mt-4">
                <label htmlFor="message" className="mb-1.5 block text-xs font-semibold text-neutral-600">
                  {tr('Votre besoin', 'Your needs')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder={tr('Type de véhicules, zones couvertes, problème principal…', 'Vehicle type, areas covered, main challenge…')}
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-0/40 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-4 text-sm font-bold text-primary-900 shadow-[0_12px_30px_rgba(255,176,0,0.24)] transition-transform hover:-translate-y-0.5"
              >
                {tr('Demander ma démonstration', 'Request my demo')}
                <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-3 text-center text-[10px] leading-relaxed text-neutral-500">
                {tr('L’envoi ouvre votre application mail avec les informations préremplies. Aucun message n’est stocké sur ce site.', 'Sending opens your email app with the information pre-filled. No message is stored on this site.')}
              </p>
              {status && (
                <p className="mt-3 rounded-xl bg-success-tint px-4 py-3 text-center text-xs font-medium text-success-strong">
                  {status}
                </p>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = 'text',
  required,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-semibold text-neutral-600">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-neutral-200 bg-neutral-0/40 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:bg-white"
      />
    </div>
  );
}

function ContactLine({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-600 shadow-sm ring-1 ring-neutral-100">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">{label}</p>
        <p className="text-sm font-bold text-neutral-900">{value}</p>
      </div>
    </div>
  );
  if (!href) return content;
  return (
    <a href={href} className="inline-block transition-opacity hover:opacity-80">
      {content}
    </a>
  );
}

/* ─────────────────────────── FOOTER ─────────────────────────── */

export function LandingFooter() {
  const { tr } = useLanguage();
  return (
    <footer className="bg-primary-900 text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <p className="text-lg font-bold tracking-[0.12em] text-white">FAUCON</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-100/60">
              {tr('Voir · Surveiller · Contrôler. La télématique de flotte pensée pour les routes africaines.', 'See · Monitor · Control. Fleet telematics built for African roads.')}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-primary-100/30">
              {tr('Cameroun · Afrique centrale', 'Cameroon · Central Africa')}
            </p>
          </div>
          <FooterColumn
            title={tr('Produit', 'Product')}
            links={[
              [tr('Solution', 'Solution'), '#solution'],
              [tr('Innovation', 'Innovation'), '#innovation'],
              [tr('Marché', 'Market'), '#marche'],
              [tr('Développeurs', 'Developers'), '/developpeurs'],
            ]}
          />
          <FooterColumn
            title={tr('Entreprise', 'Company')}
            links={[
              [tr('Nous contacter', 'Contact us'), '#contact'],
              [tr('Espace client', 'Client area'), '/login'],
              [tr('Demander une démo', 'Request a demo'), '#contact'],
            ]}
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-100/40">{tr('Contact', 'Contact')}</p>
            <a
              href="mailto:admin@faucon.cm"
              className="mt-4 inline-block text-sm font-medium text-primary-100/75 transition-colors hover:text-white"
            >
              admin@faucon.cm
            </a>
            <p className="mt-3 text-xs text-primary-100/45">{tr('Réponse sous 48 h ouvrées', 'Reply within 48 business hours')}</p>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[10px] text-primary-100/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Faucon. {tr('Tous droits réservés.', 'All rights reserved.')}</p>
          <p>{tr('Conçu pour le terrain. Construit au Cameroun.', 'Built for the field. Made in Cameroon.')}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-100/40">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            {href.startsWith('/') ? (
              <Link href={href} className="text-sm text-primary-100/70 transition-colors hover:text-white">
                {label}
              </Link>
            ) : (
              <a href={href} className="text-sm text-primary-100/70 transition-colors hover:text-white">
                {label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
