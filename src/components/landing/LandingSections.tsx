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

/* ─────────────────────────── PROBLÈME ─────────────────────────── */

const problems = [
  {
    icon: <IoMapOutline />,
    tag: 'Angle mort',
    title: 'Un véhicule hors de vue est un risque',
    text: 'Sans position fiable, chaque trajet devient une incertitude : détournement, immobilisation, marchandise perdue.',
  },
  {
    icon: <IoTimeOutline />,
    tag: 'Réaction tardive',
    title: 'Quand l’alerte arrive, il est déjà trop tard',
    text: 'Une vitesse excessive ou une sortie de zone signalée des heures après les faits ne protège ni le véhicule ni l’équipe.',
  },
  {
    icon: <IoStatsChartOutline />,
    tag: 'Décision à l’aveugle',
    title: 'Des données dispersées, aucune vue d’ensemble',
    text: 'Tableurs, appels, messages : les informations existent, mais ne permettent pas de décider vite et au bon endroit.',
  },
];

export function ProblemSection() {
  return (
    <section id="probleme" className="relative overflow-hidden bg-neutral-0 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel>Le problème</SectionLabel>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h2 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-neutral-900 md:text-5xl">
              Sans visibilité, chaque véhicule est un angle mort.
            </h2>
            <p className="max-w-xl text-sm leading-relaxed text-neutral-600 md:text-base lg:justify-self-end">
              Sur les routes camerounaises, la question n’est pas seulement « où est le
              véhicule ? ». C’est : est-il en sécurité, sur son itinéraire, et qui doit
              agir maintenant ?
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {problems.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.08}>
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
                  {item.tag}
                </p>
                <h3 className="mt-2 text-lg font-bold tracking-tight text-neutral-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{item.text}</p>
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
    title: 'Position GPS temps réel',
    text: 'Le camion avance sur la carte avec son cap réel, une interpolation fluide et un suivi qui respecte votre zoom.',
  },
  {
    icon: <IoTimeOutline />,
    title: 'Historique & rejeu',
    text: 'Rejouez une journée, mesurez les arrêts, vérifiez un itinéraire. Les trajets passés restent consultables.',
  },
  {
    icon: <IoLayersOutline />,
    title: 'Zones de sécurité',
    text: 'Définissez un périmètre autour d’un site ou d’un client. Une sortie de zone déclenche une alerte immédiate.',
  },
  {
    icon: <IoSpeedometerOutline />,
    title: 'Vitesse & conduite',
    text: 'Seuils personnalisables, excès détectés, événements de conduite brutale remontés avec le contexte GPS.',
  },
  {
    icon: <IoBatteryHalfOutline />,
    title: 'Batterie & santé du boîtier',
    text: 'Niveau de batterie, signal, satellites et diagnostic du traceur : vous savez quand un boîtier décroche.',
  },
  {
    icon: <IoRadioOutline />,
    title: 'Commandes à distance',
    text: 'Localiser maintenant, changer de mode, lire le mode réel : le traceur répond, l’application confirme.',
  },
];

export function SolutionSection() {
  return (
    <section id="solution" className="relative bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <Reveal>
            <SectionLabel>La solution</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.035em] text-neutral-900 md:text-5xl">
              Une plateforme.
              <span className="block text-primary-600">Un boîtier. Toute la flotte.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
              Faucon assemble le traceur, le réseau, le serveur et les interfaces
              web/mobile. Une seule chaîne, du terrain jusqu’à la décision.
            </p>

            <div className="mt-8 space-y-3 rounded-2xl border border-primary-100 bg-primary-50/60 p-5">
              {[
                'Vue consolidée de tous les véhicules',
                'Alertes compréhensibles, acquittables et historisées',
                'Même expérience sur le web et sur mobile',
                'Fonctionne avec un traceur Faucon ou un boîtier compatible',
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
              Voir Faucon sur votre flotte
              <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.05}>
                <div className="group h-full rounded-2xl border border-neutral-100 bg-neutral-0/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:bg-white hover:shadow-[0_16px_40px_rgba(11,21,38,0.08)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg text-primary-600 shadow-sm ring-1 ring-neutral-100">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-sm font-bold text-neutral-900">{feature.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">{feature.text}</p>
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
    title: 'Transport & logistique',
    text: 'Camions, utilitaires, distribution urbaine et interurbaine : la visibilité devient un avantage opérationnel.',
  },
  {
    icon: <IoBusinessOutline />,
    title: 'Entreprises & BTP',
    text: 'Chantiers, engins, véhicules de service : localiser, encadrer et prouver l’usage réel des actifs.',
  },
  {
    icon: <IoShieldCheckmarkOutline />,
    title: 'Assurance & risque',
    text: 'Un historique daté et contextualisé change la façon de constater, prévenir et traiter un sinistre.',
  },
  {
    icon: <IoGlobeOutline />,
    title: 'Secteur public & ONG',
    text: 'Santé, eau, agriculture, humanitaire : des flottes utiles là où la connectivité est imparfaite.',
  },
];

export function OpportunitySection() {
  return (
    <section id="marche" className="relative overflow-hidden bg-neutral-0 py-24 md:py-32">
      <div className="absolute inset-0 bg-blueprint opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel>L’opportunité</SectionLabel>
          <div className="mt-5 max-w-4xl">
            <h2 className="text-3xl font-bold tracking-[-0.035em] text-neutral-900 md:text-5xl">
              La digitalisation des flottes africaines ne fait que commencer.
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-neutral-600 md:text-base">
              L’urbanisation, la croissance logistique et la demande de preuve créent un
              besoin structurel : savoir où sont les véhicules, comment ils sont utilisés
              et ce qui mérite une intervention. Faucon se positionne sur ce besoin avec
              une approche terrain, pas une copie de solutions conçues ailleurs.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {opportunities.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <div className="h-full rounded-2xl border border-white bg-white/85 p-6 shadow-[0_2px_10px_rgba(11,21,38,0.05)] backdrop-blur">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 text-xl text-primary-600">
                  {item.icon}
                </div>
                <h3 className="mt-5 text-base font-bold text-neutral-900">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">{item.text}</p>
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
                  Un marché qui demande de la preuve, pas des promesses.
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  Faucon répond avec un historique, des alertes explicables et un diagnostic
                  du matériel — trois briques de confiance.
                </p>
              </div>
            </div>
            <a
              href="#contact"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-primary-200 px-5 py-3 text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50"
            >
              Échanger sur votre cas
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
    title: 'Firmware Faucon v12.1',
    text: 'ESP32-C3, journal local LittleFS, horloge GPS autonome et cap fusionné GPS + gyroscope.',
  },
  {
    icon: <IoRadioOutline />,
    title: 'Modes adaptatifs',
    text: 'WORK, MOVE, STANDBY : le rythme de report s’adapte au mouvement et à l’énergie disponible.',
  },
  {
    icon: <IoPulseOutline />,
    title: 'Diagnostic continu',
    text: 'Toutes les 5 minutes, le boîtier remonte santé, mémoire, redémarrages et état de la liaison.',
  },
  {
    icon: <IoCloudOfflineOutline />,
    title: 'Résilience réseau',
    text: 'Les positions sont conservées en local quand le réseau tombe, puis republiées au retour.',
  },
  {
    icon: <IoDocumentTextOutline />,
    title: 'Historique exploitable',
    text: 'Chaque événement est daté, contextualisé et consultable : trajets, alertes, diagnostics.',
  },
  {
    icon: <IoLockClosedOutline />,
    title: 'Chaîne maîtrisée',
    text: 'De la trame MQTT au WebSocket, Faucon contrôle la donnée de bout en bout.',
  },
];

export function InnovationSection() {
  return (
    <section
      id="innovation"
      className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 py-24 text-white md:py-32"
    >
      <div className="absolute inset-0 bg-blueprint opacity-[0.12]" />
      <div className="pointer-events-none absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-accent-500/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel tone="white">L’innovation</SectionLabel>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <h2 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] md:text-5xl">
              Un traceur pensé pour le terrain,
              <span className="block text-accent-300">pas seulement pour la démo.</span>
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-primary-100/75 md:text-base lg:justify-self-end">
              La différence ne se joue pas sur la carte. Elle se joue sur la capacité du
              boîtier à continuer à travailler quand le réseau, l’énergie ou le GPS ne
              coopèrent pas.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur md:p-8">
            <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
              <FlowNode icon={<IoHardwareChipOutline />} title="Traceur" caption="GPS · cap · capteurs" />
              <FlowArrow />
              <FlowNode icon={<IoWifiOutline />} title="MQTT" caption="Réseau mobile" />
              <FlowArrow />
              <FlowNode icon={<IoPulseOutline />} title="Cloud Faucon" caption="Temps réel · alertes" />
              <FlowArrow />
              <FlowNode icon={<IoGlobeOutline />} title="Web + mobile" caption="Une seule vérité" />
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-5 text-[11px] font-medium text-primary-100/60">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                Flux chiffré
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                Journal local en cas de coupure
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                Diagnostic à distance
              </span>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {innovations.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <div className="group h-full rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition-colors hover:border-accent-400/30 hover:bg-white/[0.06]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-400/10 text-lg text-accent-300">
                  {item.icon}
                </div>
                <h3 className="mt-4 text-sm font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-primary-100/65">{item.text}</p>
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
    title: 'Connectivité intermittente',
    text: 'Le réseau tombe, revient, change de cellule. Le système doit continuer à collecter puis rattraper son retard.',
    answer: 'Journal local + republication',
  },
  {
    icon: <IoBatteryHalfOutline />,
    title: 'Énergie limitée',
    text: 'Chaque report coûte de la batterie. Le rythme doit s’adapter au mouvement réel du véhicule.',
    answer: 'Modes WORK / MOVE / STANDBY',
  },
  {
    icon: <IoConstructOutline />,
    title: 'Terrain exigeant',
    text: 'Chaleur, poussière, vibrations et installation électrique variable : le boîtier doit être diagnostiquable.',
    answer: 'Diagnostic + compteurs de reset',
  },
  {
    icon: <IoBusinessOutline />,
    title: 'Coût d’adoption',
    text: 'Le prix doit rester compatible avec des flottes petites et moyennes, sans abonnement inutile.',
    answer: 'Plateforme web + mobile incluse',
  },
];

export function ChallengeSection() {
  return (
    <section id="defi" className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal>
          <SectionLabel>Le défi</SectionLabel>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <h2 className="max-w-3xl text-3xl font-bold tracking-[-0.035em] text-neutral-900 md:text-5xl">
              Le vrai défi n’est pas la carte.
              <span className="block text-primary-600">C’est la fiabilité.</span>
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-neutral-600 md:text-base lg:justify-self-end">
              Nous ne promettons pas un terrain parfait. Nous construisons un système qui
              continue à produire de la information utile quand le terrain ne l’est pas.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {challenges.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <div className="flex h-full gap-4 rounded-2xl border border-neutral-100 bg-neutral-0/60 p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-warning-tint text-lg text-warning-strong">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-neutral-600">{item.text}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success-tint px-2.5 py-1 text-[10px] font-bold text-success-strong">
                    <IoCheckmarkCircle size={12} />
                    {item.answer}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 rounded-xl border border-warning/20 bg-warning-tint/70 px-5 py-4 text-xs leading-relaxed text-warning-strong">
            <strong>Transparence :</strong> Faucon est un produit en construction active.
            Le diagnostic embarqué existe précisément pour rendre visibles les limites du
            terrain, plutôt que de les masquer derrière une promesse de disponibilité
            parfaite.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────────────────── AMBITION ─────────────────────────── */

export function AmbitionSection() {
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
            <SectionLabel tone="white">L’ambition</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] md:text-6xl">
              Devenir la référence de la télématique
              <span className="block text-gold-300">en Afrique centrale.</span>
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-primary-100/75 md:text-base">
              Partir du Cameroun, comprendre les routes, les usages et les contraintes
              locales, puis étendre un modèle qui fonctionne réellement. Pas une solution
              importée avec un drapeau changé : une infrastructure pensée ici, pour ici.
            </p>
            <div className="mt-9 space-y-0">
              <AmbitionStep
                label="Aujourd’hui"
                title="Cameroun"
                text="Traceurs, plateforme web et application mobile, diagnostic et alertes terrain."
                active
              />
              <AmbitionStep
                label="Ensuite"
                title="Afrique centrale"
                text="Adapter le report, les langues et le support aux réalités de chaque marché."
              />
              <AmbitionStep
                label="Demain"
                title="Afriques"
                text="Transport, logistique, assurance, secteur public : une même exigence de fiabilité."
                last
              />
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative mx-auto max-w-[520px] rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-100/50">
                  Présence envisagée
                </p>
                <span className="rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-1 text-[9px] font-bold text-gold-300">
                  Cameroun · départ
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
                Carte illustrative — les déploiements réels suivent les partenaires et le terrain.
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
  const [status, setStatus] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const company = String(form.get('company') ?? '').trim();
    const phone = String(form.get('phone') ?? '').trim();
    const fleet = String(form.get('fleet') ?? '').trim();
    const message = String(form.get('message') ?? '').trim();

    const subject = encodeURIComponent(`Demande de démo Faucon${company ? ` — ${company}` : ''}`);
    const body = encodeURIComponent(
      [
        `Nom : ${name}`,
        `Entreprise : ${company || '—'}`,
        `Téléphone / WhatsApp : ${phone || '—'}`,
        `Taille de flotte : ${fleet || '—'}`,
        '',
        'Besoin :',
        message || '—',
      ].join('\n')
    );
    window.location.href = `mailto:admin@faucon.cm?subject=${subject}&body=${body}`;
    setStatus('Votre messagerie s’ouvre avec le message prérempli. Vous pouvez aussi écrire à admin@faucon.cm.');
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-neutral-0 py-24 md:py-32">
      <div className="absolute inset-0 bg-blueprint opacity-40" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionLabel>Passer à l’action</SectionLabel>
            <h2 className="mt-5 text-3xl font-bold tracking-[-0.04em] text-neutral-900 md:text-5xl">
              Mettez votre flotte
              <span className="block text-primary-600">sous contrôle.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
              Dites-nous ce que vous gérez : véhicules, motos, engins, marchandises. Nous
              revenons vers vous avec une démonstration adaptée à votre réalité.
            </p>

            <div className="mt-8 space-y-4">
              <ContactLine icon={<IoMailOutline />} label="Écrire" value="admin@faucon.cm" href="mailto:admin@faucon.cm" />
              <ContactLine icon={<IoLocationOutline />} label="Basé à" value="Cameroun" />
              <ContactLine icon={<IoCallOutline />} label="Réponse" value="Sous 48 h ouvrées" />
            </div>

            <div className="mt-8 rounded-2xl border border-primary-100 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-600">
                Déjà client ?
              </p>
              <p className="mt-2 text-sm text-neutral-600">
                Accédez directement à votre tour de contrôle.
              </p>
              <Link
                href="/login"
                className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-700"
              >
                Ouvrir l’espace client
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
                <Field label="Nom" name="name" placeholder="Votre nom" required />
                <Field label="Entreprise" name="company" placeholder="Nom de l’entreprise" />
                <Field label="Téléphone / WhatsApp" name="phone" type="tel" placeholder="+237 …" />
                <Field label="Taille de flotte" name="fleet" placeholder="Ex. 5 à 50 véhicules" />
              </div>
              <div className="mt-4">
                <label htmlFor="message" className="mb-1.5 block text-xs font-semibold text-neutral-600">
                  Votre besoin
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Type de véhicules, zones couvertes, problème principal…"
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-0/40 px-4 py-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-400 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-4 text-sm font-bold text-primary-900 shadow-[0_12px_30px_rgba(255,176,0,0.24)] transition-transform hover:-translate-y-0.5"
              >
                Demander ma démonstration
                <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
              </button>
              <p className="mt-3 text-center text-[10px] leading-relaxed text-neutral-500">
                L’envoi ouvre votre application mail avec les informations préremplies.
                Aucun message n’est stocké sur ce site.
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
  return (
    <footer className="bg-primary-900 text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <p className="text-lg font-bold tracking-[0.12em] text-white">FAUCON</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-primary-100/60">
              Voir · Surveiller · Contrôler. La télématique de flotte pensée pour les
              routes africaines.
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-primary-100/30">
              Cameroun · Afrique centrale
            </p>
          </div>
          <FooterColumn
            title="Produit"
            links={[
              ['Solution', '#solution'],
              ['Innovation', '#innovation'],
              ['Marché', '#marche'],
              ['Développeurs', '/developpeurs'],
            ]}
          />
          <FooterColumn
            title="Entreprise"
            links={[
              ['Nous contacter', '#contact'],
              ['Espace client', '/login'],
              ['Demander une démo', '#contact'],
            ]}
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary-100/40">Contact</p>
            <a
              href="mailto:admin@faucon.cm"
              className="mt-4 inline-block text-sm font-medium text-primary-100/75 transition-colors hover:text-white"
            >
              admin@faucon.cm
            </a>
            <p className="mt-3 text-xs text-primary-100/45">Réponse sous 48 h ouvrées</p>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[10px] text-primary-100/40 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Faucon. Tous droits réservés.</p>
          <p>Conçu pour le terrain. Construit au Cameroun.</p>
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
