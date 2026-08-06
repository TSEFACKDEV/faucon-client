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
} from 'react-icons/io5';
import { adminService } from '@/services/admin.service';
import { VehiculeDetail, DeviceMode, CodeCommande, StatutCommande } from '@/types';
import {
  MODE_LABELS, ALARM_LABELS, formatDateTime, timeAgo, getBatteryColor, formatCoords, isOnline,
} from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';

const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

const STATUT_STYLE: Record<StatutCommande, { color: 'success' | 'warning' | 'danger' | 'neutral'; label: string }> = {
  SUCCESS: { color: 'success', label: 'Exécutée' },
  FAILED:  { color: 'danger', label: 'Échec' },
  TIMEOUT: { color: 'warning', label: 'Expirée' },
  PENDING: { color: 'neutral', label: 'En attente' },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function TraceurDetailPage() {
  const params = useParams<{ id: string }>();
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
    } catch (err) {
      console.error('[TraceurDetail]', err);
      toast.error('Impossible de charger le traceur');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const initial = async () => {
      await load();
    };
    initial();
  }, [load]);

  const route = useMemo(() => {
    if (!vehicule || vehicule.positions.length < 2) return undefined;
    return vehicule.positions
      .slice()
      .sort((a, b) => new Date(a.horodatage).getTime() - new Date(b.horodatage).getTime())
      .map((p) => ({ latitude: p.latitude, longitude: p.longitude }));
  }, [vehicule]);

  const send = async (codeCommande: CodeCommande, valeur?: string) => {
    if (!vehicule) return;
    setSending(codeCommande);
    try {
      await adminService.envoyerCommande(vehicule.id, codeCommande, valeur);
      toast.success('Commande envoyée au traceur');
      load();
    } catch (err) {
      console.error('[commande]', err);
      toast.error('Impossible d\'envoyer la commande');
    } finally {
      setSending(null);
    }
  };

  const refresh = async () => {
    await load();
    toast.success('Traceur actualisé');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  if (!vehicule) {
    return (
      <div className="p-8">
        <p className="text-neutral-600">Traceur introuvable.</p>
      </div>
    );
  }

  const batColor = getBatteryColor(vehicule.niveauBatterie);
  const dernierPoint = vehicule.positions[vehicule.positions.length - 1];

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
            title="Retour à la liste"
          >
            <IoArrowBackOutline size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-neutral-900">{vehicule.nom}</h1>
              <Badge color={isOnline(vehicule.derniereCommunication) ? 'success' : 'neutral'} dot>
                {isOnline(vehicule.derniereCommunication) ? 'En ligne' : 'Hors ligne'}
              </Badge>
              <Badge color={vehicule.estActif ? 'primary' : 'warning'}>
                {vehicule.estActif ? 'Actif' : 'Désactivé'}
              </Badge>
            </div>
            <p className="text-sm text-neutral-600 mt-1 font-mono">
              {vehicule.trackerId ?? vehicule.imei ?? 'Sans identifiant'}
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={refresh}>
          <IoPulseOutline size={16} />
          Actualiser
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Colonne gauche ── */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          <motion.div variants={item}>
            <Card padding={false} className="overflow-hidden">
              <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">Position</h2>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    {vehicule.positions.length} point(s) reçus
                    {dernierPoint ? ` · ${formatDateTime(dernierPoint.horodatage)}` : ''}
                  </p>
                </div>
                {dernierPoint && (
                  <Badge color="primary">
                    <IoLocationOutline size={13} className="mr-1" />
                    {formatCoords(dernierPoint.latitude, dernierPoint.longitude)}
                  </Badge>
                )}
              </div>
              <div className="h-[380px]">
                {dernierPoint ? (
                  <MapView
                    markers={[{
                      id: vehicule.id,
                      latitude: dernierPoint.latitude,
                      longitude: dernierPoint.longitude,
                      label: vehicule.nom,
                      color: isOnline(vehicule.derniereCommunication) ? '#1F7A50' : '#B23434',
                    }]}
                    route={route}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-neutral-500">
                    Aucune position reçue pour le moment
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <h2 className="text-base font-semibold text-neutral-900 mb-1">Commandes rapides</h2>
              <p className="text-xs text-neutral-600 mb-4">
                Envoyées au traceur via MQTT — action différée au prochain cycle
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="secondary"
                  loading={sending === 'LOCALISER'}
                  disabled={!!sending}
                  onClick={() => send('LOCALISER')}
                >
                  <IoLocationOutline size={16} />
                  Localiser
                </Button>
                <Button
                  variant="secondary"
                  loading={sending === 'REDEMARRER'}
                  disabled={!!sending}
                  onClick={() => send('REDEMARRER')}
                >
                  <IoRadioOutline size={16} />
                  Redémarrer
                </Button>
                <Button
                  variant="secondary"
                  loading={sending === 'RESET_USINE'}
                  disabled={!!sending}
                  onClick={() => send('RESET_USINE')}
                >
                  <IoHardwareChipOutline size={16} />
                  Reset usine
                </Button>
                <Button
                  variant="secondary"
                  loading={sending === 'MODE'}
                  disabled={!!sending}
                  onClick={() => send('MODE', 'WORK')}
                >
                  <IoPulseOutline size={16} />
                  Repasser en WORK
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card padding={false}>
              <div className="px-6 pt-5 pb-3">
                <h2 className="text-base font-semibold text-neutral-900">Historique des commandes</h2>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {vehicule.commandes.length} commande(s) sur ce traceur
                </p>
              </div>
              {vehicule.commandes.length === 0 ? (
                <div className="px-6 pb-6 text-sm text-neutral-500">Aucune commande envoyée.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                        <th className="px-6 py-3 font-semibold">Code</th>
                        <th className="px-6 py-3 font-semibold">Paramètres</th>
                        <th className="px-6 py-3 font-semibold">Statut</th>
                        <th className="px-6 py-3 font-semibold">Envoyée le</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicule.commandes.map((c) => {
                        const s = STATUT_STYLE[c.statutExecution];
                        return (
                          <tr key={c.id} className="border-b border-neutral-50">
                            <td className="px-6 py-3 font-mono font-semibold text-neutral-900">{c.codeCommande}</td>
                            <td className="px-6 py-3 text-neutral-600 font-mono text-xs">
                              {c.parametres?.valeur ?? c.parametres?.detail ?? '—'}
                            </td>
                            <td className="px-6 py-3">
                              <Badge color={s.color} dot>{s.label}</Badge>
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
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Informations</h2>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoPersonOutline size={16} /> Propriétaire
                  </span>
                  {vehicule.utilisateur ? (
                    <div className="text-right">
                      <p className="font-semibold text-neutral-900">{vehicule.utilisateur.userName}</p>
                      <p className="text-xs text-neutral-500">{vehicule.utilisateur.email}</p>
                    </div>
                  ) : (
                    <Badge color="warning">Non attribué</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoHardwareChipOutline size={16} /> IMEI
                  </span>
                  <span className="font-mono text-neutral-900">{vehicule.imei ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoHardwareChipOutline size={16} /> Pin d&apos;activation
                  </span>
                  <span className="font-mono text-neutral-900">{vehicule.pinActivation ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoCallOutline size={16} /> Tél. alerte
                  </span>
                  <span className="font-mono text-neutral-900">{vehicule.telephoneAlerte ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoPulseOutline size={16} /> Mode
                  </span>
                  <Badge color="primary">{MODE_LABELS[vehicule.modeActuel]}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoBatteryHalfOutline size={16} /> Batterie
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-14 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${vehicule.niveauBatterie}%`, backgroundColor: batColor }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: batColor }}>{vehicule.niveauBatterie}%</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <IoPulseOutline size={16} /> Dernière comm.
                  </span>
                  <span className="text-neutral-900">
                    {vehicule.derniereCommunication ? timeAgo(vehicule.derniereCommunication) : 'Jamais'}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card>
              <h2 className="text-base font-semibold text-neutral-900 mb-4">Configuration</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Mode de transmission</label>
                  <Select
                    name="mode"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as DeviceMode)}
                  >
                    <option value="WORK">Continu (WORK)</option>
                    <option value="MOVE">Adaptatif (MOVE)</option>
                    <option value="STANDBY">Veille (STANDBY)</option>
                  </Select>
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="mt-2"
                    loading={configuring === 'mode'}
                    disabled={!vehicule.estActif || mode === vehicule.modeActuel}
                    onClick={async () => {
                      setConfiguring('mode');
                      try {
                        await adminService.setMode(vehicule.id, mode);
                        toast.success('Mode enregistré');
                        load();
                      } catch {
                        toast.error('Impossible de configurer le mode');
                      } finally {
                        setConfiguring(null);
                      }
                    }}
                  >
                    Enregistrer le mode
                  </Button>
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Limite de vitesse (km/h)</label>
                  <Input
                    name="seuil"
                    type="number"
                    min={1}
                    max={200}
                    value={seuil}
                    onChange={(e) => setSeuil(e.target.value)}
                    placeholder="Ex : 80"
                    rightIcon={<IoSpeedometerOutline size={16} className="text-neutral-400" />}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="mt-2"
                    loading={configuring === 'speed'}
                    disabled={!vehicule.estActif || !seuil}
                    onClick={async () => {
                      setConfiguring('speed');
                      try {
                        await adminService.setSpeedLimit(vehicule.id, Number(seuil));
                        toast.success('Limite de vitesse enregistrée');
                        load();
                      } catch {
                        toast.error('Impossible de configurer la limite');
                      } finally {
                        setConfiguring(null);
                      }
                    }}
                  >
                    Enregistrer la limite
                  </Button>
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Zone de sécurité (géofence)</label>
                  <Input name="geoNom" value={geoNom} onChange={(e) => setGeoNom(e.target.value)} placeholder="Nom de la zone (ex : Domicile)" />
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input name="geoLat" value={geoLat} onChange={(e) => setGeoLat(e.target.value)} placeholder="Latitude" />
                    <Input name="geoLon" value={geoLon} onChange={(e) => setGeoLon(e.target.value)} placeholder="Longitude" />
                  </div>
                  <Input name="geoRayon" type="number" min={50} value={geoRayon} onChange={(e) => setGeoRayon(e.target.value)} placeholder="Rayon (mètres)" className="mt-2" />
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="mt-2"
                    loading={configuring === 'geofence'}
                    disabled={!vehicule.estActif || !geoNom || !geoLat || !geoLon || !geoRayon}
                    onClick={async () => {
                      setConfiguring('geofence');
                      try {
                        await adminService.setGeofence(
                          vehicule.id, geoNom, Number(geoLat), Number(geoLon), Number(geoRayon)
                        );
                        toast.success('Zone de sécurité enregistrée');
                        load();
                      } catch {
                        toast.error('Impossible de configurer la zone');
                      } finally {
                        setConfiguring(null);
                      }
                    }}
                  >
                    Enregistrer la zone
                  </Button>
                </div>

                <div className="border-t border-neutral-100 pt-4">
                  <label className="text-xs font-semibold text-neutral-700 mb-1 block">Numéro d&apos;alerte SMS</label>
                  <Input
                    name="telephone"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    placeholder="Ex : +237690000000"
                    rightIcon={<IoCallOutline size={16} className="text-neutral-400" />}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    fullWidth
                    className="mt-2"
                    loading={configuring === 'phone'}
                    disabled={!vehicule.estActif || !telephone}
                    onClick={async () => {
                      setConfiguring('phone');
                      try {
                        await adminService.setPhoneAlerte(vehicule.id, telephone);
                        toast.success('Numéro SMS enregistré');
                        load();
                      } catch {
                        toast.error('Impossible de configurer le numéro');
                      } finally {
                        setConfiguring(null);
                      }
                    }}
                  >
                    Enregistrer le numéro
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card padding={false}>
              <div className="px-6 pt-5 pb-3">
                <h2 className="text-base font-semibold text-neutral-900">Alarmes</h2>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {vehicule.alarmes.length} enregistrée(s) · {vehicule.alarmes.filter((a) => !a.estAcquittee).length} non acquittée(s)
                </p>
              </div>
              {vehicule.alarmes.length === 0 ? (
                <div className="px-6 pb-6 text-sm text-neutral-500">Aucune alarme.</div>
              ) : (
                <div className="flex flex-col">
                  {vehicule.alarmes.slice(0, 5).map((a) => (
                    <div key={a.id} className="flex items-center justify-between px-6 py-3 border-t border-neutral-50">
                      <div className="flex items-center gap-3">
                        <IoWarningOutline size={16} className="text-warning-strong shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{ALARM_LABELS[a.typeAlarme]}</p>
                          <p className="text-xs text-neutral-500">{formatDateTime(a.horodatage)}</p>
                        </div>
                      </div>
                      {a.estAcquittee ? (
                        <Badge color="success">
                          <IoCheckmarkDoneOutline size={13} className="mr-1" /> Acquittée
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await adminService.acquitAlarme(a.id);
                              toast.success('Alarme acquittée');
                              load();
                            } catch {
                              toast.error('Impossible d\'acquitter');
                            }
                          }}
                        >
                          <IoCheckmarkCircleOutline size={15} className="mr-1" />
                          Acquitter
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
