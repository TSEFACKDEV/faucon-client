'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  IoHardwareChipOutline, IoAddOutline, IoTrashOutline, IoEyeOutline,
  IoSearchOutline, IoChevronForwardOutline,
} from 'react-icons/io5';
import { adminService } from '@/services/admin.service';
import { VehiculeResume } from '@/types';
import { MODE_LABELS, formatDateTime, timeAgo, getBatteryColor, isOnline } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';
import { useRealtime } from '@/hooks/useRealtime';
import { useTick } from '@/hooks/useTick';
import { useRealtimeStore } from '@/store/realtime.store';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function TraceursPage() {
  const [vehicules, setVehicules] = useState<VehiculeResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toDelete, setToDelete] = useState<VehiculeResume | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Temps réel : les colonnes État / Batterie / Dernière comm. se mettent à
  // jour dès réception d'une trame, sans rafraîchir la liste.
  const livePositions = useRealtimeStore((s) => s.positions);
  const liveVehiculeIds = vehicules.map((v) => v.id);
  useRealtime(liveVehiculeIds);
  // isOnline(derniereCommunication) est dérivé de Date.now() — sans ce tick,
  // "En ligne" ne se réévaluerait que si CE traceur reçoit une nouvelle
  // trame, et resterait affiché indéfiniment après qu'il ait cessé d'émettre.
  useTick();

  // Mémoïsé comme sur dashboard/page.tsx et traceurs/[id]/page.tsx : sans ça,
  // un nouveau tableau est recréé à chaque rendu (y compris ceux déclenchés
  // par des états sans rapport, ex. un filtre de recherche tapé au clavier).
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

  const load = useCallback(async () => {
    try {
      setVehicules(await adminService.getVehicules());
    } catch (err) {
      console.error('[Traceurs]', err);
      toast.error(getErrorMessage(err, 'Impossible de charger la liste des traceurs. Réessayez dans un instant.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = async () => {
      await load();
    };
    initial();
  }, [load]);

  const handleToggle = async (v: VehiculeResume) => {
    setTogglingId(v.id);
    try {
      await adminService.updateVehicule(v.id, { estActif: !v.estActif });
      setVehicules((prev) => prev.map((x) => (x.id === v.id ? { ...x, estActif: !x.estActif } : x)));
      toast.success(v.estActif ? 'Traceur désactivé' : 'Traceur activé');
    } catch (err) {
      console.error('[toggle]', err);
      toast.error(getErrorMessage(err, 'Impossible de modifier l\'état du traceur. Réessayez dans un instant.'));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminService.supprimerVehicule(toDelete.id);
      setVehicules((prev) => prev.filter((x) => x.id !== toDelete.id));
      setToDelete(null);
      toast.success('Traceur supprimé');
    } catch (err) {
      console.error('[supprimerVehicule]', err);
      toast.error(getErrorMessage(err, 'Impossible de supprimer ce traceur. Réessayez dans un instant.'));
    } finally {
      setDeleting(false);
    }
  };

  const filtered = vehiculesLive.filter((v) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      v.nom.toLowerCase().includes(q) ||
      (v.trackerId ?? '').toLowerCase().includes(q) ||
      (v.imei ?? '').toLowerCase().includes(q) ||
      (v.utilisateur?.userName ?? '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-8 flex flex-col gap-6">
      <motion.div variants={item} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Traceurs</h1>
          <p className="text-sm text-neutral-600 mt-1">
            {vehiculesLive.length} traceur(s) enregistré(s) — {vehiculesLive.filter((v) => isOnline(v.derniereCommunication, v.niveauSignal, v.niveauBatterie)).length} en ligne
          </p>
        </div>
        <Link href="/dashboard/traceurs/provisionner">
          <Button variant="primary">
            <IoAddOutline size={18} />
            Provisionner
          </Button>
        </Link>
      </motion.div>

      <motion.div variants={item}>
        <Card padding={false}>
          <div className="px-6 pt-5 pb-4 border-b border-neutral-100">
            <div className="relative w-full max-w-sm">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, ID, propriétaire…"
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-[10px] text-sm focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-neutral-500 text-sm">
              Aucun traceur ne correspond à votre recherche.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                    <th className="px-6 py-3 font-semibold">Traceur</th>
                    <th className="px-6 py-3 font-semibold">Propriétaire</th>
                    <th className="px-6 py-3 font-semibold">Mode</th>
                    <th className="px-6 py-3 font-semibold">Batterie</th>
                    <th className="px-6 py-3 font-semibold">État</th>
                    <th className="px-6 py-3 font-semibold">Dernière comm.</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => {
                    const batColor = getBatteryColor(v.niveauBatterie);
                    return (
                      <tr key={v.id} className="border-b border-neutral-50 hover:bg-neutral-0/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-[10px] bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                              <IoHardwareChipOutline size={18} />
                            </div>
                            <div>
                              <Link
                                href={`/dashboard/traceurs/${v.id}`}
                                className="font-semibold text-neutral-900 hover:text-primary-600 transition-colors flex items-center gap-1"
                              >
                                {v.nom}
                                <IoChevronForwardOutline size={13} className="text-neutral-300" />
                              </Link>
                              <p className="text-xs text-neutral-500 font-mono">
                                {v.trackerId ?? v.imei ?? 'Sans identifiant'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          {v.utilisateur ? (
                            <div>
                              <p className="text-neutral-900 font-medium">{v.utilisateur.userName}</p>
                              <p className="text-xs text-neutral-500">{v.utilisateur.email}</p>
                            </div>
                          ) : (
                            <span className="text-neutral-400 text-xs">Non attribué</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5">
                          <Badge color="neutral">{MODE_LABELS[v.modeActuel]}</Badge>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${v.niveauBatterie}%`, backgroundColor: batColor }}
                              />
                            </div>
                            <span className="text-xs font-semibold" style={{ color: batColor }}>
                              {v.niveauBatterie}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex flex-col gap-1">
                            <Badge color={isOnline(v.derniereCommunication, v.niveauSignal, v.niveauBatterie) ? 'success' : 'neutral'} dot>
                              {isOnline(v.derniereCommunication, v.niveauSignal, v.niveauBatterie) ? 'En ligne' : 'Hors ligne'}
                            </Badge>
                            <Badge color={v.estActif ? 'primary' : 'warning'}>
                              {v.estActif ? 'Actif' : 'Désactivé'}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-neutral-600">
                          {v.derniereCommunication ? (
                            <div>
                              <p className="text-xs text-neutral-600">{timeAgo(v.derniereCommunication)}</p>
                              <p className="text-xs text-neutral-400">{formatDateTime(v.derniereCommunication)}</p>
                            </div>
                          ) : (
                            <span className="text-neutral-400 text-xs">Jamais</span>
                          )}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/traceurs/${v.id}`}
                              className="p-2 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                              title="Voir le détail"
                            >
                              <IoEyeOutline size={17} />
                            </Link>
                            {togglingId === v.id ? (
                              <span className="text-xs text-neutral-400 px-2">…</span>
                            ) : (
                              <button
                                onClick={() => handleToggle(v)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                  v.estActif
                                    ? 'text-warning-strong border-warning/40 hover:bg-warning-tint'
                                    : 'text-success-strong border-success/40 hover:bg-success-tint'
                                }`}
                                title={v.estActif ? 'Désactiver' : 'Activer'}
                              >
                                {v.estActif ? 'Désactiver' : 'Activer'}
                              </button>
                            )}
                            <button
                              onClick={() => setToDelete(v)}
                              className="p-2 rounded-lg text-neutral-500 hover:text-danger-strong hover:bg-danger-tint transition-colors"
                              title="Supprimer"
                            >
                              <IoTrashOutline size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Supprimer ce traceur ?"
        subtitle={toDelete?.nom}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600">
            Le traceur et tout son historique (positions, alarmes, commandes) seront supprimés.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setToDelete(null)}>
              Annuler
            </Button>
            <Button variant="danger" fullWidth loading={deleting} onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
