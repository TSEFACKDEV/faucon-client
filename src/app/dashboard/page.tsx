'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  IoPeopleOutline, IoHardwareChipOutline, IoRadioOutline, IoWarningOutline,
  IoLocateOutline, IoAppsOutline, IoChevronDown,
} from 'react-icons/io5';
import dynamic from 'next/dynamic';
import { adminService } from '@/services/admin.service';
import { StatsOverview, VehiculeResume } from '@/types';
import { getAlarmLabel, getModeLabel, isOnline } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';
import { useRealtime } from '@/hooks/useRealtime';
import { useTick } from '@/hooks/useTick';
import { useRealtimeStore } from '@/store/realtime.store';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import GrowthLineChart from '@/components/dashboard/GrowthLineChart';
import AlarmsBarChart from '@/components/dashboard/AlarmsBarChart';
import CategoryBarChart from '@/components/dashboard/CategoryBarChart';
import BatteryBarChart from '@/components/dashboard/BatteryBarChart';
import type { MapViewHandle } from '@/components/map/MapView';
import { useLanguage } from '@/i18n/LanguageProvider';

// Leaflet a besoin du DOM — chargement client-only.
const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { t, tr } = useLanguage();
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [vehicules, setVehicules] = useState<VehiculeResume[]>([]);
  const [loading, setLoading] = useState(true);
  // null = suivre tous les traceurs (vue d'ensemble) ; sinon, id du traceur
  // suivi en continu — même logique que le bouton "Suivi" de l'app mobile.
  const [followId, setFollowId] = useState<string | null>(null);
  const mapRef = useRef<MapViewHandle>(null);

  // Flux temps réel : chaque trame reçue par le backend met immédiatement à
  // jour la position, la batterie et le statut « en ligne » du traceur, sans
  // rechargement REST.
  const livePositions = useRealtimeStore((s) => s.positions);
  const liveVehiculeIds = vehicules.map((v) => v.id);
  useRealtime(liveVehiculeIds);
  // isOnline(derniereCommunication) est dérivé de Date.now() — sans ce tick,
  // un traceur qui cesse d'émettre resterait affiché "en ligne" (et visible
  // sur la carte) indéfiniment, jusqu'au prochain rechargement de page.
  const tick = useTick();

  // Mémoïsé sur les données réelles (vehicules, livePositions) plutôt que
  // recréé à chaque rendu : passé tel quel à MapView, un nouveau tableau à
  // chaque fois déclenche inutilement le recalcul complet des icônes Leaflet
  // (voir MapView.tsx) même quand rien n'a changé.
  const vehiculesLive = useMemo(() => vehicules.map((v) => {
    const live = livePositions[v.id];
    if (!live) return v;
    return {
      ...v,
      latitude: live.latitude,
      longitude: live.longitude,
      niveauBatterie: live.battery,
      niveauSignal: live.signal ?? v.niveauSignal,
      derniereCommunication: live.horodatage,
    };
  }), [vehicules, livePositions]);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, v] = await Promise.all([
          adminService.getStatsOverview(),
          adminService.getVehicules(),
        ]);
        setStats(s);
        setVehicules(v);
      } catch (err) {
        console.error('[Dashboard]', err);
        toast.error(getErrorMessage(err, t('dashboard.loadError')));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [t]);

  // Dépend explicitement de `tick` : isOnline() est une fonction du temps,
  // ce recalcul périodique volontaire est ce qui permet à un traceur de
  // basculer "hors ligne" ici sans attendre un événement non lié.
  const vehiculesAvecPosition = useMemo(
    () => vehiculesLive.filter((v) => v.latitude != null && v.longitude != null),
    [vehiculesLive]
  );
  const enLigneAvecPosition = useMemo(
    () => vehiculesAvecPosition.filter(
      (v) => isOnline(v.derniereCommunication, v.niveauSignal, v.niveauBatterie)
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vehiculesAvecPosition, tick]
  );

  // La carte affiche TOUS les traceurs ayant déjà une position connue (comme
  // sur mobile), pas seulement ceux en ligne — un traceur hors ligne reste
  // visible (grisé) plutôt que de disparaître silencieusement de la carte.
  const mapMarkers = useMemo(() => vehiculesAvecPosition.map((v) => {
    const online = isOnline(v.derniereCommunication, v.niveauSignal, v.niveauBatterie);
    return {
      id: v.id,
      latitude: v.latitude as number,
      longitude: v.longitude as number,
      label: v.nom,
      color: online ? '#0057FF' : '#A8B4C9',
      // Halo pulsant sur les traceurs qui viennent de transmettre une trame
      // en temps réel.
      pulse: online && !!livePositions[v.id],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [vehiculesAvecPosition, livePositions, tick]);

  // Le traceur suivi peut disparaître (retrait, perte de position) sans que
  // l'admin ne change explicitement la sélection. On dérive la valeur utile
  // au rendu au lieu de synchroniser un état dans un effet : cela évite un
  // rendu en cascade et suit immédiatement la liste réelle.
  const activeFollowId =
    followId && vehiculesAvecPosition.some((v) => v.id === followId)
      ? followId
      : null;

  const handleFollowChange = (id: string | null) => {
    setFollowId(id);
    if (id === null) mapRef.current?.fitAll();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <div className="p-8 text-neutral-600">{t('dashboard.loadError')}</div>;
  }

  const followedVehicule = activeFollowId ? vehicules.find((v) => v.id === activeFollowId) : null;

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-8 flex flex-col gap-6">
      <motion.div variants={item} className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-sm text-neutral-600 mt-1">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-neutral-100 shadow-[0_2px_10px_rgba(11,21,38,0.05)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
          </span>
          <span className="text-xs font-semibold text-neutral-700">{t('dashboard.live')}</span>
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label={t('dashboard.users')} value={stats.totalUtilisateurs} icon={IoPeopleOutline} tone="primary" />
        <StatCard label={t('dashboard.trackers')} value={stats.totalVehicules} icon={IoHardwareChipOutline} tone="primary" />
        <StatCard label={t('dashboard.online')} value={stats.vehiculesEnLigne} icon={IoRadioOutline} tone="success" />
        <StatCard label={t('dashboard.active')} value={stats.vehiculesActifs} icon={IoHardwareChipOutline} tone="primary" />
        <StatCard label={t('dashboard.unacked')} value={stats.alarmesNonAcquittees} icon={IoWarningOutline} tone="danger" />
        <StatCard label={t('dashboard.today')} value={stats.alarmesAujourdhui} icon={IoWarningOutline} tone="warning" />
      </motion.div>

      {/* ── Carte des traceurs ── */}
      <motion.div variants={item}>
        <Card padding={false} className="overflow-hidden">
          <div className="px-6 pt-5 pb-4 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">{t('dashboard.mapTitle')}</h2>
              <p className="text-xs text-neutral-600 mt-0.5">
                {enLigneAvecPosition.length} {t('dashboard.mapCount')} {vehiculesAvecPosition.length} {t('dashboard.mapKnown')}
              </p>
            </div>

            {/* Suivi : tous les dispositifs (vue d'ensemble) ou un seul en
                continu — même principe que le bouton "Suivi" de l'app mobile. */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={activeFollowId ?? '__all__'}
                  onChange={(e) => handleFollowChange(e.target.value === '__all__' ? null : e.target.value)}
                  disabled={vehiculesAvecPosition.length === 0}
                  className="appearance-none pl-9 pr-8 py-2 text-sm font-medium text-neutral-900 bg-neutral-0 border border-neutral-100 rounded-[10px] cursor-pointer hover:border-primary-300 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <option value="__all__">{t('dashboard.all')}</option>
                  {vehiculesAvecPosition.map((v) => (
                    <option key={v.id} value={v.id}>{t('dashboard.follow')} {v.nom}</option>
                  ))}
                </select>
                {activeFollowId ? (
                  <IoLocateOutline size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-600 pointer-events-none" />
                ) : (
                  <IoAppsOutline size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                )}
                <IoChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
              </div>
              {!activeFollowId && (
                <button
                  onClick={() => mapRef.current?.fitAll()}
                  disabled={vehiculesAvecPosition.length === 0}
                  title={tr('Recentrer sur tous les traceurs', 'Recenter on all trackers')}
                  className="p-2 rounded-[10px] border border-neutral-100 text-neutral-600 hover:text-primary-600 hover:border-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <IoLocateOutline size={17} />
                </button>
              )}
            </div>
          </div>

          <div className="h-[420px] relative">
            {/* La carte reste toujours montée (même sans traceur en ligne) —
                sinon rien ne distingue "carte cassée" de "personne en ligne
                actuellement", ce qui a déjà induit en erreur (voir rapport). */}
            <MapView ref={mapRef} markers={mapMarkers} followId={activeFollowId} selectedId={activeFollowId} />
            {followedVehicule && (
              <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur shadow-[0_4px_16px_rgba(11,21,38,0.12)] text-xs font-semibold text-primary-700">
                <IoLocateOutline size={13} />
                {tr('Suivi', 'Following')} : {followedVehicule.nom}
              </div>
            )}
            {vehiculesAvecPosition.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500 bg-white/70 pointer-events-none">
                {t('dashboard.noPosition')}
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* ── Graphiques ── */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-1">{t('dashboard.growth')}</h2>
          <p className="text-xs text-neutral-600 mb-3">{t('dashboard.last30')}</p>
          <GrowthLineChart data={stats.croissanceUtilisateurs30j} />
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-1">{t('dashboard.alarms')}</h2>
          <p className="text-xs text-neutral-600 mb-3">{t('dashboard.last7')}</p>
          <AlarmsBarChart data={stats.alarmesParJour7j} />
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-1">{t('dashboard.byType')}</h2>
          <p className="text-xs text-neutral-600 mb-3">{t('dashboard.allPeriods')}</p>
          <CategoryBarChart
            color="#B91C1C"
            data={stats.alarmesParType.map((a) => ({
              key: a.type, label: getAlarmLabel(a.type), total: a.total,
            }))}
          />
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-1">{t('dashboard.modes')}</h2>
          <p className="text-xs text-neutral-600 mb-3">{t('dashboard.allTrackers')}</p>
          <CategoryBarChart
            color="#0057FF"
            data={stats.repartitionModes.map((m) => ({
              key: m.mode, label: getModeLabel(m.mode), total: m.total,
            }))}
          />
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-neutral-900 mb-1">{t('dashboard.battery')}</h2>
          <p className="text-xs text-neutral-600 mb-3">{t('dashboard.batterySub')}</p>
          <BatteryBarChart data={stats.repartitionBatterie} />
        </Card>
      </motion.div>
    </motion.div>
  );
}
