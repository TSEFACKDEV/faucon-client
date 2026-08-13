'use client';
import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  IoWarningOutline, IoCheckmarkDoneOutline, IoTrashOutline, IoRefreshOutline,
  IoLocationOutline, IoArrowForwardOutline,
} from 'react-icons/io5';
import { adminService } from '@/services/admin.service';
import { Alarme, AlarmType } from '@/types';
import { ALARM_LABELS, formatDateTime, timeAgo, formatCoords } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const TYPES = Object.keys(ALARM_LABELS) as AlarmType[];

export default function AlertesPage() {
  const [alarmes, setAlarmes] = useState<Alarme[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [etatFilter, setEtatFilter] = useState('');
  const [acquitting, setAcquitting] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Alarme | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<Alarme | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setAlarmes(await adminService.getAlarmes({
        ...(typeFilter ? { typeAlarme: typeFilter } : {}),
        ...(etatFilter ? { estAcquittee: etatFilter === 'acquittee' } : {}),
      }));
    } catch (err) {
      console.error('[Alertes]', err);
      toast.error(getErrorMessage(err, 'Impossible de charger la liste des alarmes. Réessayez dans un instant.'));
    } finally {
      setLoading(false);
    }
  }, [typeFilter, etatFilter]);

  useEffect(() => {
    const initial = async () => {
      await load();
    };
    initial();
  }, [load]);

  const handleAcquit = async (a: Alarme) => {
    setAcquitting(a.id);
    try {
      await adminService.acquitAlarme(a.id);
      setAlarmes((prev) => prev.map((x) => (x.id === a.id ? { ...x, estAcquittee: true } : x)));
      toast.success('Alarme acquittée');
    } catch (err) {
      console.error('[acquit]', err);
      toast.error(getErrorMessage(err, 'Impossible d\'acquitter cette alarme. Réessayez dans un instant.'));
    } finally {
      setAcquitting(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminService.deleteAlarme(toDelete.id);
      setAlarmes((prev) => prev.filter((x) => x.id !== toDelete.id));
      setToDelete(null);
      toast.success('Alarme supprimée');
    } catch (err) {
      console.error('[delete]', err);
      toast.error(getErrorMessage(err, 'Impossible de supprimer cette alarme. Réessayez dans un instant.'));
    } finally {
      setDeleting(false);
    }
  };

  const nbNonAcquittees = alarmes.filter((a) => !a.estAcquittee).length;

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
          <h1 className="text-2xl font-semibold text-neutral-900">Alertes</h1>
          <p className="text-sm text-neutral-600 mt-1">
            {alarmes.length} alarme(s) affichée(s) · {nbNonAcquittees} non acquittée(s)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={load}>
            <IoRefreshOutline size={16} />
            Actualiser
          </Button>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <Card padding={false}>
          <div className="px-6 pt-5 pb-4 border-b border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              name="type"
              label="Type d'alarme"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Tous les types</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>{ALARM_LABELS[t]}</option>
              ))}
            </Select>
            <Select
              name="etat"
              label="État"
              value={etatFilter}
              onChange={(e) => setEtatFilter(e.target.value)}
            >
              <option value="">Toutes les alarmes</option>
              <option value="acquittee">Acquittées</option>
              <option value="non">Non acquittées</option>
            </Select>
          </div>

          {alarmes.length === 0 ? (
            <div className="p-10 text-center text-neutral-500 text-sm">
              Aucune alarme ne correspond aux filtres.
            </div>
          ) : (
            <div className="flex flex-col">
              {alarmes.map((a) => (
                <div
                  key={a.id}
                  className={`flex items-center gap-4 px-6 py-4 border-b border-neutral-50 transition-colors ${
                    a.estAcquittee ? '' : 'bg-warning-tint/40 hover:bg-warning-tint/60'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 ${
                    a.estAcquittee ? 'bg-neutral-50 text-neutral-400' : 'bg-warning-tint text-warning-strong'
                  }`}>
                    <IoWarningOutline size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-neutral-900">{ALARM_LABELS[a.typeAlarme]}</span>
                      {!a.estAcquittee && <Badge color="warning">Nouvelle</Badge>}
                    </div>
                    <p className="text-sm text-neutral-600 mt-0.5">
                      {a.vehicule ? (
                        <>
                          <Link
                            href={`/dashboard/traceurs/${a.vehicule.id}`}
                            className="font-medium text-primary-600 hover:underline"
                          >
                            {a.vehicule.nom}
                          </Link>
                          <span className="text-neutral-400"> · {a.vehicule.utilisateur?.userName ?? 'non attribué'}</span>
                        </>
                      ) : (
                        'Traceur supprimé'
                      )}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {timeAgo(a.horodatage)} · {formatDateTime(a.horodatage)}
                      {a.valeurMesuree != null && a.seuilConfigure != null
                        ? ` · ${a.valeurMesuree} / seuil ${a.seuilConfigure}`
                        : ''}
                    </p>
                  </div>

                  <button
                    onClick={() => setSelected(a)}
                    className="hidden md:flex items-center gap-1 text-xs text-neutral-500 hover:text-primary-600 font-medium"
                    title="Voir la position"
                  >
                    <IoLocationOutline size={14} />
                    {formatCoords(a.latitude, a.longitude)}
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    {a.estAcquittee ? (
                      <Badge color="success">
                        <IoCheckmarkDoneOutline size={13} className="mr-1" /> Acquittée
                      </Badge>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        loading={acquitting === a.id}
                        onClick={() => handleAcquit(a)}
                      >
                        Acquitter
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelected(a)}
                      title="Détails"
                    >
                      <IoArrowForwardOutline size={15} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setToDelete(a)}
                      title="Supprimer"
                    >
                      <IoTrashOutline size={15} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── Détail alarme ── */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? ALARM_LABELS[selected.typeAlarme] : ''}
        subtitle={selected ? formatDateTime(selected.horodatage) : ''}
      >
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge color={selected.estAcquittee ? 'success' : 'warning'} dot>
                {selected.estAcquittee ? 'Acquittée' : 'Non acquittée'}
              </Badge>
              {selected.vehicule && (
                <Link href={`/dashboard/traceurs/${selected.vehicule.id}`}>
                  <Button variant="secondary" size="sm">
                    <IoArrowForwardOutline size={14} />
                    Voir le traceur
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex flex-col gap-2 text-sm bg-neutral-50 rounded-[10px] p-4">
              <div className="flex justify-between">
                <span className="text-neutral-500">Traceur</span>
                <span className="font-semibold text-neutral-900">
                  {selected.vehicule?.nom ?? 'Traceur supprimé'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Position</span>
                <span className="font-mono text-neutral-900">
                  {formatCoords(selected.latitude, selected.longitude)}
                </span>
              </div>
              {selected.valeurMesuree != null && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Valeur mesurée</span>
                  <span className="font-semibold text-neutral-900">{selected.valeurMesuree}</span>
                </div>
              )}
              {selected.seuilConfigure != null && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Seuil configuré</span>
                  <span className="font-semibold text-neutral-900">{selected.seuilConfigure}</span>
                </div>
              )}
            </div>

            {!selected.estAcquittee && (
              <Button
                fullWidth
                loading={acquitting === selected.id}
                onClick={async () => {
                  try {
                    await adminService.acquitAlarme(selected.id);
                    setAlarmes((prev) => prev.map((x) => (x.id === selected.id ? { ...x, estAcquittee: true } : x)));
                    setSelected((prev) => (prev ? { ...prev, estAcquittee: true } : prev));
                    toast.success('Alarme acquittée');
                  } catch (err) {
                    toast.error(getErrorMessage(err, 'Impossible d\'acquitter cette alarme. Réessayez dans un instant.'));
                  }
                }}
              >
                <IoCheckmarkDoneOutline size={16} />
                Acquitter
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* ── Confirmation suppression ── */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Supprimer cette alarme ?"
        subtitle={toDelete ? ALARM_LABELS[toDelete.typeAlarme] : ''}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600">
            Cette action est irréversible.
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
