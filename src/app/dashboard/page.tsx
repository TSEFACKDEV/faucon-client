'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  IoPeopleOutline, IoHardwareChipOutline, IoRadioOutline, IoWarningOutline,
} from 'react-icons/io5';
import dynamic from 'next/dynamic';
import { adminService } from '@/services/admin.service';
import { StatsOverview, VehiculeResume } from '@/types';
import { ALARM_LABELS, MODE_LABELS } from '@/lib/utils';
import Card from '@/components/ui/Card';
import StatCard from '@/components/ui/StatCard';
import GrowthLineChart from '@/components/dashboard/GrowthLineChart';
import AlarmsBarChart from '@/components/dashboard/AlarmsBarChart';
import CategoryBarChart from '@/components/dashboard/CategoryBarChart';
import BatteryBarChart from '@/components/dashboard/BatteryBarChart';

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
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [vehicules, setVehicules] = useState<VehiculeResume[]>([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const enLigneAvecPosition = vehicules.filter(
    (v) => v.enLigne && v.latitude != null && v.longitude != null
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return <div className="p-8 text-neutral-600">Impossible de charger les statistiques.</div>;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-8 flex flex-col gap-6">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold text-neutral-900">Tour de contrôle</h1>
        <p className="text-sm text-neutral-600 mt-1">Vue d&apos;ensemble du système Faucon</p>
      </motion.div>

      {/* ── Stat cards ── */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Utilisateurs" value={stats.totalUtilisateurs} icon={IoPeopleOutline} tone="primary" />
        <StatCard label="Traceurs" value={stats.totalVehicules} icon={IoHardwareChipOutline} tone="primary" />
        <StatCard label="En ligne" value={stats.vehiculesEnLigne} icon={IoRadioOutline} tone="success" />
        <StatCard label="Actifs" value={stats.vehiculesActifs} icon={IoHardwareChipOutline} tone="primary" />
        <StatCard label="Alarmes non acquittées" value={stats.alarmesNonAcquittees} icon={IoWarningOutline} tone="danger" />
        <StatCard label="Alarmes aujourd'hui" value={stats.alarmesAujourdhui} icon={IoWarningOutline} tone="warning" />
      </motion.div>

      {/* ── Carte des traceurs en ligne ── */}
      <motion.div variants={item}>
        <Card padding={false} className="overflow-hidden">
          <div className="px-6 pt-5 pb-3">
            <h2 className="text-base font-semibold text-neutral-900">Traceurs en ligne</h2>
            <p className="text-xs text-neutral-600 mt-0.5">
              {enLigneAvecPosition.length} traceur(s) avec position récente
            </p>
          </div>
          <div className="h-[360px]">
            {enLigneAvecPosition.length > 0 ? (
              <MapView
                markers={enLigneAvecPosition.map((v) => ({
                  id: v.id,
                  latitude: v.latitude as number,
                  longitude: v.longitude as number,
                  label: v.nom,
                  color: '#1F7A50',
                }))}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-neutral-500">
                Aucun traceur en ligne pour le moment
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* ── Graphiques ── */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-1">Croissance des utilisateurs</h2>
          <p className="text-xs text-neutral-600 mb-3">30 derniers jours</p>
          <GrowthLineChart data={stats.croissanceUtilisateurs30j} />
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-1">Alarmes</h2>
          <p className="text-xs text-neutral-600 mb-3">7 derniers jours</p>
          <AlarmsBarChart data={stats.alarmesParJour7j} />
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-1">Alarmes par type</h2>
          <p className="text-xs text-neutral-600 mb-3">Toutes périodes confondues</p>
          <CategoryBarChart
            color="#B23434"
            data={stats.alarmesParType.map((a) => ({
              key: a.type, label: ALARM_LABELS[a.type], total: a.total,
            }))}
          />
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-1">Répartition des modes</h2>
          <p className="text-xs text-neutral-600 mb-3">Tous les traceurs</p>
          <CategoryBarChart
            color="#363F70"
            data={stats.repartitionModes.map((m) => ({
              key: m.mode, label: MODE_LABELS[m.mode], total: m.total,
            }))}
          />
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-base font-semibold text-neutral-900 mb-1">Santé batterie</h2>
          <p className="text-xs text-neutral-600 mb-3">Traceurs actifs, par tranche de charge</p>
          <BatteryBarChart data={stats.repartitionBatterie} />
        </Card>
      </motion.div>
    </motion.div>
  );
}
