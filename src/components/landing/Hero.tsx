'use client';

import { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  IoAlertCircleOutline,
  IoArrowForwardOutline,
  IoBatteryHalfOutline,
  IoCheckmarkCircle,
  IoLocationOutline,
  IoNavigateOutline,
  IoPulseOutline,
  IoSpeedometerOutline,
} from 'react-icons/io5';
import { easeOut, SectionLabel } from './Reveal';

const assurances = [
  'Temps réel',
  'Alertes instantanées',
  'Historique des trajets',
  'Web + mobile',
];

export default function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 pb-20 pt-32 md:pb-28 md:pt-36">
      <div className="absolute inset-0 bg-blueprint opacity-[0.13]" />
      <div className="pointer-events-none absolute -right-40 -top-48 h-[620px] w-[620px] rounded-full bg-accent-500/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-56 -left-48 h-[560px] w-[560px] rounded-full bg-white/10 blur-3xl animate-float-slower" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-0/10 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 md:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: easeOut }}
          >
            <SectionLabel tone="white">Télémétrie de flotte · Cameroun</SectionLabel>
          </motion.div>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: easeOut }}
            className="mt-6 max-w-2xl text-[2.65rem] font-bold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl xl:text-[4.25rem]"
          >
            Chaque véhicule.
            <span className="block bg-gradient-to-r from-accent-200 via-accent-300 to-gold-300 bg-clip-text text-transparent">
              À vue.
            </span>
            <span className="block bg-gradient-to-r from-accent-200 via-accent-300 to-gold-300 bg-clip-text text-transparent">
              En temps réel.
            </span>
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18, ease: easeOut }}
            className="mt-6 max-w-xl text-base leading-relaxed text-primary-100/85 md:text-lg"
          >
            Faucon relie traceurs GPS, véhicules et équipes dans une seule tour de
            contrôle : position live, alertes terrain, historique et diagnostic à
            distance. Pensé pour les routes africaines, pas seulement pour les
            tableaux de bord.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.26, ease: easeOut }}
            className="mt-9 flex flex-col gap-3 sm:flex-row"
          >
            <a
              href="#contact"
              id="demo"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 px-6 py-4 text-sm font-bold text-primary-900 shadow-[0_14px_40px_rgba(255,176,0,0.3)] transition-transform hover:-translate-y-0.5"
            >
              Demander une démo
              <IoArrowForwardOutline className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#solution"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-4 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Découvrir la solution
            </a>
          </motion.div>

          <motion.ul
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-9 flex flex-wrap gap-x-5 gap-y-2.5"
          >
            {assurances.map((item) => (
              <li key={item} className="flex items-center gap-2 text-xs font-medium text-primary-100/75">
                <IoCheckmarkCircle className="text-accent-300" size={15} />
                {item}
              </li>
            ))}
          </motion.ul>
        </div>

        <HeroMockup reduce={Boolean(reduce)} />
      </div>
    </section>
  );
}

function HeroMockup({ reduce }: { reduce: boolean }) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.25, ease: easeOut }}
      className="relative mx-auto w-full max-w-[560px] lg:max-w-none"
    >
      <div className="absolute -inset-6 rounded-[32px] bg-accent-400/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-[26px] border border-white/15 bg-white/10 p-2 shadow-[0_30px_90px_rgba(0,10,30,0.45)] backdrop-blur-md">
        <div className="overflow-hidden rounded-[20px] bg-primary-900">
          {/* Barre de fenêtre produit */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-accent-400" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-100/70">
                Faucon · Carte live
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/15 px-2.5 py-1 text-[10px] font-semibold text-green-200">
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-success" />
              Temps réel actif
            </div>
          </div>

          {/* Carte stylisée */}
          <div className="relative h-[330px] overflow-hidden bg-[#EAF0F8] sm:h-[380px]">
            <div className="absolute inset-0 bg-blueprint opacity-70" />
            <svg
              viewBox="0 0 600 400"
              className="absolute inset-0 h-full w-full"
              fill="none"
              aria-hidden="true"
            >
              <path d="M-20 310 C90 250 130 330 230 280 S390 180 640 220" stroke="#C9D3E3" strokeWidth="16" />
              <path d="M-20 310 C90 250 130 330 230 280 S390 180 640 220" stroke="#FFFFFF" strokeWidth="9" />
              <path d="M180 -20 C210 90 90 150 150 250 S250 370 300 430" stroke="#C9D3E3" strokeWidth="13" />
              <path d="M180 -20 C210 90 90 150 150 250 S250 370 300 430" stroke="#FFFFFF" strokeWidth="7" />
              <path d="M390 -10 C370 90 450 150 410 230 S430 340 500 420" stroke="#D7DEEA" strokeWidth="10" />
              <path d="M330 40 L520 95" stroke="#D7DEEA" strokeWidth="8" />
              <path d="M40 150 L260 100" stroke="#D7DEEA" strokeWidth="7" />
              <rect x="40" y="40" width="90" height="54" rx="8" fill="#DFE7F1" />
              <rect x="430" y="270" width="110" height="70" rx="9" fill="#DCE5F0" />
              <rect x="270" y="300" width="70" height="46" rx="7" fill="#E3EAF3" />
            </svg>

            {/* Tracé animé */}
            <svg viewBox="0 0 600 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path
                d="M95 300 C170 250 205 300 270 265 S390 195 500 215"
                stroke="#0057FF"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="7 8"
                opacity="0.85"
              />
            </svg>

            {/* Pins */}
            <Pin x="24%" y="70%" label="Camion Nord" tone="primary" />
            <Pin x="46%" y="58%" label="Livraison" tone="success" />
            <Pin x="80%" y="47%" label="Camion Est" tone="warning" />

            {/* Camion animé */}
            <motion.div
              className="absolute z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-[0_8px_24px_rgba(0,87,255,0.45)]"
              style={{ left: '43%', top: '61%' }}
              animate={
                reduce
                  ? undefined
                  : { x: [0, 36, 78, 40, 0], y: [0, -28, -44, -16, 0], rotate: [0, 10, 0, -8, 0] }
              }
              transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            >
              <TruckIcon className="h-6 w-6" />
              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-success" />
            </motion.div>

            {/* Carte flottante statut */}
            <motion.div
              className="absolute left-4 top-4 w-[178px] rounded-2xl border border-white/80 bg-white/95 p-3 shadow-[0_14px_36px_rgba(11,21,38,0.16)] backdrop-blur"
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <TruckIcon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-bold text-neutral-900">Camion Nord</p>
                  <p className="text-[9px] font-medium text-neutral-500">Il y a 4 s · En ligne</p>
                </div>
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                <MiniMetric icon={<IoSpeedometerOutline />} value="42 km/h" />
                <MiniMetric icon={<IoBatteryHalfOutline />} value="78 %" />
              </div>
            </motion.div>

            {/* Alerte flottante */}
            <motion.div
              className="absolute bottom-4 right-4 w-[190px] rounded-2xl border border-warning/20 bg-white/95 p-3 shadow-[0_14px_36px_rgba(11,21,38,0.16)] backdrop-blur"
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
            >
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-warning-tint text-warning-strong">
                  <IoAlertCircleOutline size={17} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-900">Vitesse excessive</p>
                  <p className="mt-0.5 text-[9px] leading-relaxed text-neutral-500">
                    86 km/h · seuil 80 · vérifier la position
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Pied de fenêtre */}
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 text-[9px] font-medium text-primary-100/55">
            <span className="inline-flex items-center gap-1.5">
              <IoLocationOutline /> Yaoundé, Cameroun
            </span>
            <span className="inline-flex items-center gap-1.5">
              <IoPulseOutline className="text-accent-300" /> Aperçu de l’interface
            </span>
          </div>
        </div>
      </div>

      {/* Badge produit */}
      <motion.div
        className="absolute -bottom-5 left-5 hidden items-center gap-3 rounded-2xl border border-white/20 bg-primary-900/95 px-4 py-3 shadow-xl backdrop-blur sm:flex"
        animate={reduce ? undefined : { y: [0, -4, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold-400/15 text-gold-300">
          <IoNavigateOutline size={17} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-white">Suivi sans rupture</p>
          <p className="text-[9px] text-primary-100/60">WebSocket + relance automatique</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Pin({
  x,
  y,
  label,
  tone,
}: {
  x: string;
  y: string;
  label: string;
  tone: 'primary' | 'success' | 'warning';
}) {
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-success',
    warning: 'bg-warning',
  } as const;
  return (
    <div className="absolute z-[5] -translate-x-1/2 -translate-y-1/2" style={{ left: x, top: y }}>
      <div className="relative flex flex-col items-center">
        <span className={`absolute -top-1 h-7 w-7 animate-ping rounded-full opacity-20 ${colors[tone]}`} />
        <span className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 border-white shadow-md ${colors[tone]}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        </span>
        <span className="mt-1 rounded-full bg-white/95 px-2 py-0.5 text-[8px] font-semibold text-neutral-700 shadow-sm">
          {label}
        </span>
      </div>
    </div>
  );
}

function MiniMetric({ icon, value }: { icon: ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-neutral-50 px-1.5 py-1 text-[9px] font-semibold text-neutral-700">
      <span className="text-primary-500">{icon}</span>
      {value}
    </span>
  );
}

function TruckIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
}
