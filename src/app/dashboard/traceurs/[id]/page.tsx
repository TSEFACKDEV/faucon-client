'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  IoArrowBackOutline, IoRadioOutline, IoBatteryHalfOutline, IoHardwareChipOutline,
  IoPersonOutline, IoCallOutline, IoSpeedometerOutline, IoLocationOutline,
  IoPulseOutline, IoWarningOutline, IoCheckmarkCircleOutline, IoCheckmarkDoneOutline,
  IoNavigateOutline, IoRefreshOutline,
} from 'react-icons/io5';
import { adminService } from '@/services/admin.service';
import { onVehicleMode, onDiagnostic } from '@/lib/realtime';
import { VehiculeDetail, DeviceMode, CodeCommande, StatutCommande, Position, DiagnosticTraceur } from '@/types';
import {
  getModeLabel, getAlarmLabel, formatDateTime, timeAgo, getBatteryColor, formatCoords, isOnline,
} from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';
import { useRealtime } from '@/hooks/useRealtime';
import { useTick } from '@/hooks/useTick';
import { useRealtimeStore } from '@/store/realtime.store';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import InfoCell from '@/components/ui/InfoCell';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { useLanguage } from '@/i18n/LanguageProvider';

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

const STATUT_STYLE: Record<StatutCommande, { color: 'success' | 'warning' | 'danger' | 'neutral'; label: string; labelEn: string }> = {
  SUCCESS: { color: 'success', label: 'Exécutée', labelEn: 'Completed' },
  FAILED:  { color: 'danger', label: 'Échec', labelEn: 'Failed' },
  TIMEOUT: { color: 'warning', label: 'Expirée', labelEn: 'Timed out' },
  PENDING: { color: 'neutral', label: 'En attente', labelEn: 'Pending' },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function TraceurDetailPage() {
  const params = useParams<{ id: string }>();
  const { tr } = useLanguage();
  const id = params.id;

  const [vehicule, setVehicule] = useState<VehiculeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<CodeCommande | null>(null);

  const [mode, setMode] = useState<DeviceMode>('WORK');
  const [seuil, setSeuil] = useState('');
  const [geoNom, setGeoNom] = useState('');
  const [geoRayon, setGeoRayon] = useState('');
  const [geoLat, setGeoLat] = useState('');
  const [geoLon, setGeoLon] = useState('');
  const [telephone, setTelephone] = useState('');
  const [configuring, setConfiguring] = useState<string | null>(null);
  // Lecture du mode RÉELLEMENT appliqué par le traceur (commande MODE?).
  const [checkingMode, setCheckingMode] = useState(false);
  // Dernier diagnostic périodique du traceur (canal /diag) : état réel du
  // boîtier — modèle, version, compteurs de reset, santé I2C, journal flash.
  const [diagnostic, setDiagnostic] = useState<DiagnosticTraceur | null>(null);
  const [checkingInfos, setCheckingInfos] = useState(false);

  // isOnline(derniereCommunication) est dérivé de Date.now() — sans ce tick,
  // le badge "En ligne" ne se réévalue que si CE traceur reçoit une nouvelle
  // trame temps réel, et resterait donc affiché "En ligne" indéfiniment s'il
  // cesse d'émettre (voir hooks/useTick.ts).
  const tick = useTick();

  // Traque temps réel : les trames reçues étendent la trace et déplacent le
  // marqueur. Le « suivi » (recentrage automatique de la carte) est activé
  // par défaut dès qu'un point live arrive.
  const livePosition = useRealtimeStore((s) => (id ? s.positions[id] : undefined));
  const liveTrace = useRealtimeStore((s) => (id ? s.traces[id] : undefined));
  const [follow, setFollow] = useState(true);
  const liveVehiculeIds = id ? [id] : [];
  useRealtime(liveVehiculeIds);

  // Détail « vivant » : les champs dérivés (batterie, dernière comm., trace,
  // dernier point) fusionnent la donnée REST avec le flux temps réel — rien
  // n'est réécrit dans `vehicule`, tout est calculé (dérivé), donc la carte
  // suit le traceur sans état intermédiaire.
  const vehiculeLive = useMemo(() => {
    const base = vehicule;
    if (!base) return base;
    if (!livePosition) return base;
    const livePoint: Position = {
      id: 0,
      vehiculeId: base.id,
      latitude: livePosition.latitude,
      longitude: livePosition.longitude,
      vitesse: livePosition.vitesse,
      cap: livePosition.cap ?? null,
      niveauBatterie: livePosition.battery,
      nbSatellites: livePosition.satellites ?? null,
      niveauSignal: livePosition.signal ?? null,
      horodatage: livePosition.horodatage,
    };
    const positions = [
      ...base.positions.filter((p) => p.horodatage !== livePosition.horodatage),
      // `liveTrace` (store temps réel) et `livePoint` partagent la même
      // dernière trame (voir realtime.store.ts : setPosition écrit les deux
      // à partir de la même donnée `p`) — sans ce filtre, le point courant
      // apparaît deux fois dans `positions` (bruit sur le tracé/compteurs).
      ...(liveTrace ?? []).filter((t) => t.horodatage !== livePosition.horodatage).map(
        (t): Position => ({
          id: 0,
          vehiculeId: base.id,
          latitude: t.latitude,
          longitude: t.longitude,
          vitesse: 0,
          cap: null,
          niveauBatterie: base.niveauBatterie,
          nbSatellites: null,
          niveauSignal: null,
          horodatage: t.horodatage,
        })
      ),
      livePoint,
    ];
    return {
      ...base,
      positions,
      niveauBatterie: livePosition.battery,
      niveauSignal: livePosition.signal ?? base.positions[0]?.niveauSignal ?? undefined,
      derniereCommunication: livePosition.horodatage,
    };
  }, [vehicule, livePosition, liveTrace]);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await adminService.getVehiculeById(id);
      setVehicule(data);
      setMode(data.modeActuel);
      setSeuil(data.limiteVitesse?.seuilKmh ? String(data.limiteVitesse.seuilKmh) : '');
      setGeoNom(data.perimetreGeofence?.nom ?? '');
      setGeoRayon(data.perimetreGeofence?.rayonMetres ? String(data.perimetreGeofence.rayonMetres) : '');
      setGeoLat(data.perimetreGeofence?.centreLat ? String(data.perimetreGeofence.centreLat) : '');
      setGeoLon(data.perimetreGeofence?.centreLon ? String(data.perimetreGeofence.centreLon) : '');
      setTelephone(data.telephoneAlerte ?? '');
      // Dernier diagnostic connu du traceur (historique) — la version la
      // plus récente arrive ensuite par le socket.
      try {
        const diags = await adminService.getDiagnostics(id, 1);
        setDiagnostic(diags[0] ?? null);
      } catch {
        // Pas de diagnostic disponible (traceur ancien firmware) : on
        // laisse l'état vide, l'interface l'indique.
      }
    } catch (err) {
      console.error('[TraceurDetail]', err);
      toast.error(getErrorMessage(err, tr('Impossible de charger ce traceur. Réessayez dans un instant.', 'Unable to load this tracker. Try again in a moment.')));
    } finally {
      setLoading(false);
    }
  }, [id, tr]);

  useEffect(() => {
    const initial = async () => {
      await load();
    };
    initial();
  }, [load]);

  // Mode réellement appliqué par le traceur : le backend l'émet dès que le
  // traceur confirme (ACK) une commande MODE ou MODE?. On met à jour la
  // fiche sans recharger toute la page.
  useEffect(() => {
    const unsub = onVehicleMode((data) => {
      if (!id || data.vehiculeId !== id) return;
      setCheckingMode(false);
      setVehicule((prev) => (prev ? { ...prev, modeActuel: data.modeActuel } : prev));
      toast.success(`Mode confirmé par le traceur : ${data.modeActuel}`);
    });
    return unsub;
  }, [id]);

  // Diagnostic périodique du traceur : le backend l'émet dès qu'il reçoit
  // un message sur faucon/<trackerId>/diag (toutes les 5 min) — la fiche se
  // met à jour sans rechargement.
  useEffect(() => {
    const unsub = onDiagnostic((data) => {
      if (!id || data.vehiculeId !== id) return;
      setDiagnostic(data as unknown as DiagnosticTraceur);
    });
    return unsub;
  }, [id]);

  // Interroge le traceur sur son mode réel. La réponse arrive par l'événement
  // socket 'vehicle_mode' ; au-delà du délai, on prévient l'utilisateur au
  // lieu de laisser le bouton bloqué (traceur hors ligne).
  const checkMode = async () => {
    if (!id || checkingMode) return;
    setCheckingMode(true);
    try {
      await adminService.readMode(id);
      setTimeout(() => {
        setCheckingMode((still) => {
          if (still) toast.error(tr('Aucune réponse du traceur — il est peut-être hors ligne.', 'No response from the tracker — it may be offline.'));
          return false;
        });
      }, 20000);
    } catch (err) {
      setCheckingMode(false);
      toast.error(getErrorMessage(err, tr('Impossible de demander le mode au traceur. Réessayez dans un instant.', 'Unable to request the mode from the tracker. Try again in a moment.')));
    }
  };

  // Demande les infos matérielles / logicielles (commande INFO) : la réponse
  // arrive dans l'ACK. On recharge la fiche après quelques secondes pour
  // récupérer la commande INFO dans l'historique (le serveur la joint à la
  // fiche véhicule) — pas de route dédiée nécessaire.
  const readInfos = async () => {
    if (!id || checkingInfos) return;
    setCheckingInfos(true);
    try {
      await adminService.readInfos(id);
      setTimeout(() => {
        setCheckingInfos(false);
        load();
      }, 6000);
    } catch (err) {
      setCheckingInfos(false);
      toast.error(getErrorMessage(err, 'Impossible de demander les informations au traceur.'));
    }
  };

  // Dernière commande INFO envoyée au traceur : sa réponse (dans l'ACK)
  // contient le résumé "modèle version mode" renvoyé par le boîtier.
  const derniereInfo = useMemo(() => {
    const list = vehiculeLive?.commandes ?? [];
    return list.find((c) => c.codeCommande === 'INFO') ?? null;
  }, [vehiculeLive]);

  const route = useMemo(() => {    if (!vehiculeLive || vehiculeLive.positions.length < 2) return undefined;
    return vehiculeLive.positions
      .slice()
      .sort((a, b) => new Date(a.horodatage).getTime() - new Date(b.horodatage).getTime())
      .map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
  }, [vehiculeLive]);

  // Le tableau `positions` n'est PAS garanti trié dans un ordre stable : le
  // serveur le renvoie en DESC (le plus récent en premier), sauf quand un
  // point temps réel est fusionné dedans (ajouté en dernier, voir
  // `vehiculeLive` plus haut) — `[length - 1]` donnait donc tantôt le plus
  // ancien, tantôt le plus récent selon qu'une trame live était déjà
  // arrivée. On calcule explicitement le point au plus grand horodatage.
  // Mémoïsé (comme `route`) avant les `return` anticipés ci-dessous, pour
  // respecter les Rules of Hooks (un hook ne peut pas suivre un retour
  // conditionnel).
  const dernierPoint = useMemo(() => {
    if (!vehiculeLive) return undefined;
    return vehiculeLive.positions.reduce<Position | undefined>(
      (latest, p) => (!latest || new Date(p.horodatage).getTime() > new Date(latest.horodatage).getTime() ? p : latest),
      undefined
    );
  }, [vehiculeLive]);

  // Mémoïsé pour la même raison que `mapMarkers` dans dashboard/page.tsx :
  // un nouveau tableau à chaque rendu ferait recalculer inutilement les
  // icônes Leaflet dans MapView à chaque tick (voir useTick ci-dessus).
  const mapMarkers = useMemo(() => {
    if (!vehiculeLive || !dernierPoint) return [];
    return [{
      id: vehiculeLive.id,
      latitude: dernierPoint.latitude,
      longitude: dernierPoint.longitude,
      label: vehiculeLive.nom,
      color: isOnline(vehiculeLive.derniereCommunication, vehiculeLive.niveauSignal, vehiculeLive.niveauBatterie) ? '#0057FF' : '#B91C1C',
    }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehiculeLive, dernierPoint, tick]);

  const send = async (codeCommande: CodeCommande, valeur?: string) => {
    if (!vehicule) return;
    setSending(codeCommande);
    try {
      await adminService.envoyerCommande(vehicule.id, codeCommande, valeur);
      toast.success(tr('Commande envoyée au traceur', 'Command sent to the tracker'));
      load();
    } catch (err) {
      console.error('[commande]', err);
      toast.error(getErrorMessage(err, tr('Impossible d’envoyer la commande au traceur. Vérifiez qu’il est en ligne, puis réessayez.', 'Unable to send the command to the tracker. Check that it is online, then try again.')));
    } finally {
      setSending(null);
    }
  };

  const refresh = async () => {
    await load();
    toast.success(tr('Traceur actualisé', 'Tracker refreshed'));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  if (!vehicule || !vehiculeLive) {
    return (
      <div className="p-8">
        <p className="text-neutral-600">{tr('Traceur introuvable.', 'Tracker not found.')}</p>
      </div>
    );
  }

  const batColor = getBatteryColor(vehiculeLive.niveauBatterie);

  return (
    <motion.div
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
      initial="hidden"
      animate="show"
      className="p-8 flex flex-col gap-6"
    >
      {/* ── Header ── */}
      <motion.div variants={item} className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/traceurs"
            className="p-2 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            title={tr('Retour à la liste', 'Back to list')}
          >
            <IoArrowBackOutline size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-neutral-900">{vehiculeLive.nom}</h1>
              <Badge color={isOnline(vehiculeLive.derniereCommunication, vehiculeLive.niveauSignal, vehiculeLive.niveauBatterie) ? 'success' : 'neutral'} dot>
                {isOnline(vehiculeLive.derniereCommunication, vehiculeLive.niveauSignal, vehiculeLive.niveauBatterie) ? tr('En ligne', 'Online') : tr('Hors ligne', 'Offline')}
              </Badge>
              <Badge color={vehiculeLive.estActif ? 'primary' : 'warning'}>
                {vehiculeLive.estActif ? tr('Actif', 'Active') : tr('Désactivé', 'Disabled')}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 mt-1 font-mono">
              {vehiculeLive.trackerId ?? vehiculeLive.imei ?? tr('Sans identifiant', 'No identifier')}
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={refresh}>
          <IoPulseOutline size={16} />
          {tr('Actualiser', 'Refresh')}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Colonne gauche ── */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <motion.div variants={item}>
            <Card padding={false} className="overflow-hidden">
              <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">{tr('Position en temps réel', 'Real-time position')}</h2>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {vehiculeLive.positions.length} {tr('point(s) reçus', 'point(s) received')}
                    {dernierPoint ? ` · ${formatDateTime(dernierPoint.horodatage)}` : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={follow ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setFollow((f) => !f)}
                    title={follow ? tr('Désactiver le suivi automatique', 'Disable automatic tracking') : tr('Suivre le traceur sur la carte', 'Track the tracker on the map')}
                  >
                    <IoNavigateOutline size={14} className={follow ? '' : 'mr-1'} />
                    {follow ? tr('Suivi activé', 'Tracking on') : tr('Suivre', 'Track')}
                  </Button>
                  {dernierPoint && (
                    <Badge color="primary">
                      <IoLocationOutline size={13} className="mr-1" />
                      {formatCoords(dernierPoint.latitude, dernierPoint.longitude)}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="h-[380px]">
                {dernierPoint ? (
                  <MapView
                    markers={mapMarkers}
                    route={route}
                    routeColor="#0057FF"
                    followId={follow ? vehiculeLive.id : null}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-neutral-500">
                    {tr('Aucune position reçue pour le moment', 'No position received yet')}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <h2 className="text-base font-semibold text-neutral-900 mb-1">{tr('Commandes rapides', 'Quick commands')}</h2>
              <p className="text-xs text-neutral-600 mb-4">
                {tr('Envoyées au traceur via MQTT — action différée au prochain cycle', 'Sent to the tracker via MQTT — action deferred to the next cycle')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="secondary"
                  loading={sending === 'LOCALISER'}
                  disabled={!!sending}
                  onClick={() => send('LOCALISER')}
                >
                  <IoLocationOutline size={16} />
                  {tr('Localiser', 'Locate')}
                </Button>
                <Button
                  variant="secondary"
                  loading={sending === 'REDEMARRER'}
                  disabled={!!sending}
                  onClick={() => send('REDEMARRER')}
                >
                  <IoRadioOutline size={16} />
                  {tr('Redémarrer', 'Restart')}
                </Button>
                <Button
                  variant="secondary"
                  loading={sending === 'RESET_USINE'}
                  disabled={!!sending}
                  onClick={() => send('RESET_USINE')}
                >
                  <IoHardwareChipOutline size={16} />
                  {tr('Reset usine', 'Factory reset')}
                </Button>
                <Button
                  variant="secondary"
                  loading={sending === 'MODE'}
                  disabled={!!sending}
                  onClick={() => send('MODE', 'WORK')}
                >
                  <IoPulseOutline size={16} />
                  {tr('Repasser en WORK', 'Switch back to WORK')}
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card padding={false}>
              <div className="px-6 pt-5 pb-3">
                <h2 className="text-base font-semibold text-neutral-900">{tr('Historique des commandes', 'Command history')}</h2>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {vehiculeLive.commandes.length} {tr('commande(s) sur ce traceur', 'command(s) on this tracker')}
                </p>
              </div>
              {vehiculeLive.commandes.length === 0 ? (
                <div className="px-6 pb-6 text-sm text-neutral-500">{tr('Aucune commande envoyée.', 'No command sent.')}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                        <th className="px-6 py-3 font-semibold">{tr('Code', 'Code')}</th>
                        <th className="px-6 py-3 font-semibold">{tr('Paramètres', 'Parameters')}</th>
                        <th className="px-6 py-3 font-semibold">{tr('Statut', 'Status')}</th>
                        <th className="px-6 py-3 font-semibold">{tr('Envoyée le', 'Sent on')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehiculeLive.commandes.map((c) => {
                        const s = STATUT_STYLE[c.statutExecution];
                        return (
                          <tr key={c.id} className="border-b border-neutral-50">
                            <td className="px-6 py-3 font-mono font-semibold text-neutral-900">{c.codeCommande}</td>
                            <td className="px-6 py-3 text-neutral-600 font-mono text-xs">
                              {c.parametres?.valeur ?? c.parametres?.detail ?? '—'}
                            </td>
                            <td className="px-6 py-3">
                              <Badge color={s.color} dot>{tr(s.label, s.labelEn)}</Badge>
                            </td>
                            <td className="px-6 py-3 text-neutral-600 text-xs">
                              {formatDateTime(c.dateEnvoi)}
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
        </div>

        {/* ── Colonne droite ── */}
        <div className="flex flex-col gap-6">
          <motion.div variants={item}>
            <Card>
              <h2 className="text-base font-semibold text-neutral-900 mb-4">{tr('Informations', 'Information')}</h2>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoPersonOutline size={16} /> {tr('Propriétaire', 'Owner')}
                  </span>
                  {vehiculeLive.utilisateur ? (
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">{vehiculeLive.utilisateur.userName}</p>
                      <p className="text-xs text-neutral-500">{vehiculeLive.utilisateur.email}</p>
                    </div>
                  ) : (
                    <Badge color="warning">{tr('Non attribué', 'Unassigned')}</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoHardwareChipOutline size={16} /> IMEI
                  </span>
                  <span className="font-mono text-neutral-900">{vehiculeLive.imei ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoHardwareChipOutline size={16} /> {tr('Pin d’activation', 'Activation PIN')}
                  </span>
                  <span className="font-mono text-neutral-900">{vehiculeLive.pinActivation ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoCallOutline size={16} /> {tr('Tél. alerte', 'Alert phone')}
                  </span>
                  <span className="font-mono text-neutral-900">{vehiculeLive.telephoneAlerte ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoPulseOutline size={16} /> {tr('Mode', 'Mode')}
                  </span>
                  <Badge color="primary">{getModeLabel(vehiculeLive.modeActuel)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoBatteryHalfOutline size={16} /> {tr('Batterie', 'Battery')}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-14 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${vehiculeLive.niveauBatterie}%`, backgroundColor: batColor }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: batColor }}>{vehiculeLive.niveauBatterie}%</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoPulseOutline size={16} /> {tr('Dernière comm.', 'Last contact')}
                  </span>
                  <span className="text-neutral-900">
                    {vehiculeLive.derniereCommunication ? timeAgo(vehiculeLive.derniereCommunication) : tr('Jamais', 'Never')}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <h2 className="text-base font-semibold text-neutral-900">{tr('État du traceur', 'Tracker status')}</h2>
              <p className="text-xs text-neutral-600 mb-4">
                {tr('Diagnostic publié par le boîtier toutes les 5 minutes (firmware v12.1)', 'Diagnostic published by the device every 5 minutes (firmware v12.1)')}
              </p>

              {diagnostic ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <InfoCell label={tr('Modèle', 'Model')} value={diagnostic.modele ?? '—'} />
                  <InfoCell label="Firmware" value={diagnostic.version ?? '—'} />
                  <InfoCell label={tr('Mode appliqué', 'Applied mode')} value={diagnostic.mode ?? '—'} />
                  <InfoCell label={tr('Dernier diagnostic', 'Last diagnostic')} value={timeAgo(diagnostic.horodatage)} />
                  <InfoCell
                    label={tr('Redémarrages', 'Restarts')}
                    value={`${diagnostic.nbWatchdog} WDT · ${diagnostic.nbBrownout} brownout · ${diagnostic.nbPanique} ${tr('panique', 'panic')}`}
                  />
                  <InfoCell label={tr('Dernière cause', 'Last cause')} value={diagnostic.causeReset ?? '—'} />
                  {diagnostic.dernierArret && diagnostic.dernierArret !== '?' && (
                    <InfoCell label={tr('Dernier arrêt', 'Last stop')} value={diagnostic.dernierArret} />
                  )}
                  <InfoCell
                    label={tr('Mémoire libre', 'Free memory')}
                    value={diagnostic.heapLibre ? `${Math.round(diagnostic.heapLibre / 1024)} ${tr('Ko', 'KB')}` : '—'}
                  />
                  <InfoCell
                    label={tr('Journal flash', 'Flash log')}
                    value={diagnostic.fileNombre ? `${diagnostic.fileNombre} ${tr('en attente', 'pending')}` : tr('vide', 'empty')}
                  />
                  {diagnostic.i2cRecuperations > 0 && (
                    <InfoCell label={tr('Récupérations I2C', 'I2C recoveries')} value={String(diagnostic.i2cRecuperations)} />
                  )}
                </div>
              ) : (
                <p className="text-sm text-neutral-500">
                  {tr('Aucun diagnostic reçu — le traceur n’a pas encore publié son état (firmware v12.1 requis).', 'No diagnostic received — the tracker has not published its status yet (firmware v12.1 required).')}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  loading={checkingInfos}
                  disabled={checkingInfos}
                  onClick={readInfos}
                >
                  <IoHardwareChipOutline size={16} />
                  {tr('Interroger le traceur', 'Query the tracker')}
                </Button>
                {derniereInfo?.statutExecution === 'SUCCESS' && derniereInfo.parametres?.detail && (
                  <span className="text-xs font-semibold text-primary-700">
                    {derniereInfo.parametres.detail}
                  </span>
                )}
                {derniereInfo?.statutExecution === 'FAILED' && (
                  <span className="text-xs text-danger-600">
                    {derniereInfo.parametres?.detail === 'commande inconnue'
                      ? tr('Firmware antérieur à la v12.1 : commande INFO inconnue', 'Firmware older than v12.1: INFO command unknown')
                      : tr('Commande refusée par le traceur', 'Command refused by the tracker')}
                  </span>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <h2 className="text-base font-semibold text-neutral-900 mb-4">{tr('Configuration', 'Configuration')}</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">{tr('Mode de transmission', 'Transmission mode')}</label>
                  <Select
                    name="mode"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as DeviceMode)}
                  >
                    <option value="WORK">{tr('Continu (WORK)', 'Continuous (WORK)')}</option>
                    <option value="MOVE">{tr('Adaptatif (MOVE)', 'Adaptive (MOVE)')}</option>
                    <option value="STANDBY">{tr('Veille (STANDBY)', 'Standby (STANDBY)')}</option>
                  </Select>
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="mt-2"
                    loading={configuring === 'mode'}
                    disabled={!vehiculeLive.estActif || mode === vehiculeLive.modeActuel}
                    onClick={async () => {
                      setConfiguring('mode');
                      try {
                        await adminService.setMode(vehiculeLive.id, mode);
                        toast.success(tr('Mode enregistré', 'Mode saved'));
                        load();
                      } catch (err) {
                        toast.error(getErrorMessage(err, tr('Impossible de configurer le mode. Réessayez dans un instant.', 'Unable to configure the mode. Try again in a moment.')));
                      } finally {
                        setConfiguring(null);
                      }
                    }}
                  >
                    {tr('Enregistrer le mode', 'Save mode')}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="mt-2"
                    loading={checkingMode}
                    disabled={checkingMode || !vehiculeLive.estActif}
                    onClick={checkMode}
                  >
                    <IoRefreshOutline size={16} />
                    {tr('Vérifier le mode sur le traceur', 'Check mode on the tracker')}
                  </Button>
                  <p className="text-[11px] text-neutral-500 mt-1.5">
                    {tr('Interroge le boîtier et affiche le mode qu’il applique réellement (après un redémarrage, par exemple).', 'Queries the device and shows the mode it actually applies (after a restart, for example).')}
                  </p>
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">{tr('Limite de vitesse (km/h)', 'Speed limit (km/h)')}</label>
                  <Input
                    name="seuil"
                    type="number"
                    min={1}
                    max={200}
                    value={seuil}
                    onChange={(e) => setSeuil(e.target.value)}
                    placeholder={tr('Ex : 80', 'E.g. 80')}
                    rightIcon={<IoSpeedometerOutline size={16} className="text-neutral-400" />}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="mt-2"
                    loading={configuring === 'speed'}
                    disabled={!vehiculeLive.estActif || !seuil}
                    onClick={async () => {
                      setConfiguring('speed');
                      try {
                        await adminService.setSpeedLimit(vehiculeLive.id, Number(seuil));
                        toast.success(tr('Limite de vitesse enregistrée', 'Speed limit saved'));
                        load();
                      } catch (err) {
                        toast.error(getErrorMessage(err, tr('Impossible de configurer la limite de vitesse. Réessayez dans un instant.', 'Unable to configure the speed limit. Try again in a moment.')));
                      } finally {
                        setConfiguring(null);
                      }
                    }}
                  >
                    {tr('Enregistrer la limite', 'Save limit')}
                  </Button>
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">{tr('Zone de sécurité (géofence)', 'Safety zone (geofence)')}</label>
                  <Input name="geoNom" value={geoNom} onChange={(e) => setGeoNom(e.target.value)} placeholder={tr('Nom de la zone (ex : Domicile)', 'Zone name (e.g. Home)')} />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input name="geoLat" value={geoLat} onChange={(e) => setGeoLat(e.target.value)} placeholder={tr('Latitude', 'Latitude')} />
                    <Input name="geoLon" value={geoLon} onChange={(e) => setGeoLon(e.target.value)} placeholder={tr('Longitude', 'Longitude')} />
                  </div>
                  <Input name="geoRayon" type="number" min={50} value={geoRayon} onChange={(e) => setGeoRayon(e.target.value)} placeholder={tr('Rayon (mètres)', 'Radius (metres)')} className="mt-2" />
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="mt-2"
                    loading={configuring === 'geofence'}
                    disabled={!vehiculeLive.estActif || !geoNom || !geoLat || !geoLon || !geoRayon}
                    onClick={async () => {
                      setConfiguring('geofence');
                      try {
                        await adminService.setGeofence(
                          vehiculeLive.id, geoNom, Number(geoLat), Number(geoLon), Number(geoRayon)
                        );
                        toast.success(tr('Zone de sécurité enregistrée', 'Safety zone saved'));
                        load();
                      } catch (err) {
                        toast.error(getErrorMessage(err, tr('Impossible de configurer la zone de sécurité. Réessayez dans un instant.', 'Unable to configure the safety zone. Try again in a moment.')));
                      } finally {
                        setConfiguring(null);
                      }
                    }}
                  >
                    {tr('Enregistrer la zone', 'Save zone')}
                  </Button>
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">{tr('Numéro d’alerte SMS', 'SMS alert number')}</label>
                  <Input
                    name="telephone"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder={tr('Ex : +237690000000', 'E.g. +237690000000')}
                    rightIcon={<IoCallOutline size={16} className="text-neutral-400" />}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="mt-2"
                    loading={configuring === 'phone'}
                    disabled={!vehiculeLive.estActif || !telephone}
                    onClick={async () => {
                      setConfiguring('phone');
                      try {
                        await adminService.setPhoneAlerte(vehiculeLive.id, telephone);
                        toast.success(tr('Numéro SMS enregistré', 'SMS number saved'));
                        load();
                      } catch (err) {
                        toast.error(getErrorMessage(err, tr('Impossible d’enregistrer ce numéro. Vérifiez le format (+237XXXXXXXXX), puis réessayez.', 'Unable to save this number. Check the format (+237XXXXXXXXX), then try again.')));
                      } finally {
                        setConfiguring(null);
                      }
                    }}
                  >
                    {tr('Enregistrer le numéro', 'Save number')}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card padding={false}>
              <div className="px-6 pt-5 pb-3">
                <h2 className="text-base font-semibold text-neutral-900">{tr('Alarmes', 'Alerts')}</h2>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {vehiculeLive.alarmes.length} {tr('enregistrée(s)', 'recorded')} · {vehiculeLive.alarmes.filter((a) => !a.estAcquittee).length} {tr('non acquittée(s)', 'unacknowledged')}
                </p>
              </div>
              {vehiculeLive.alarmes.length === 0 ? (
                <div className="px-6 pb-6 text-sm text-neutral-500">{tr('Aucune alarme.', 'No alerts.')}</div>
              ) : (
                <div className="flex flex-col">
                  {vehiculeLive.alarmes.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-6 py-3 border-t border-neutral-50">
                      <div className="flex items-center gap-3">
                        <IoWarningOutline size={16} className="text-warning-strong shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{getAlarmLabel(a.typeAlarme)}</p>
                          <p className="text-xs text-neutral-500">{formatDateTime(a.horodatage)}</p>
                        </div>
                      </div>
                      {a.estAcquittee ? (
                        <Badge color="success">
                          <IoCheckmarkDoneOutline size={13} className="mr-1" /> {tr('Acquittée', 'Acknowledged')}
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await adminService.acquitAlarme(a.id);
                              toast.success(tr('Alarme acquittée', 'Alert acknowledged'));
                              load();
                            } catch (err) {
                              toast.error(getErrorMessage(err, tr('Impossible d’acquitter cette alarme. Réessayez dans un instant.', 'Unable to acknowledge this alert. Try again in a moment.')));
                            }
                          }}
                        >
                          <IoCheckmarkCircleOutline size={15} className="mr-1" />
                          {tr('Acquitter', 'Acknowledge')}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
