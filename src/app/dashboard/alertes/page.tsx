'use client';
import { useEffect, useState } from 'react';
import {
  RiAlertLine, RiBatteryLine, RiPauseCircleLine,
  RiMapPinLine, RiSpeedMiniLine,
} from 'react-icons/ri';
import { useDeviceStore } from '@/store/device.store';
import { useDevices } from '@/hooks/useDevices';
import { deviceService } from '@/services/device.service';
import { Alarm, AlarmType } from '@/types';
import { formatDateTime, ALARM_LABELS, ALARM_COLORS } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';

const ALARM_ICONS: Record<AlarmType, React.ElementType> = {
  SORTIE_ZONE:         RiMapPinLine,
  VITESSE_EXCESSIVE:   RiSpeedMiniLine,
  DECOLLEMENT_TRACEUR: RiAlertLine,
  NON_MOUVEMENT:       RiPauseCircleLine,
  BATTERIE_FAIBLE:     RiBatteryLine,
};

const ALARM_BADGE_COLOR: Record<AlarmType, 'red' | 'orange' | 'yellow'> = {
  SORTIE_ZONE:         'red',
  VITESSE_EXCESSIVE:   'orange',
  DECOLLEMENT_TRACEUR: 'red',
  NON_MOUVEMENT:       'orange',
  BATTERIE_FAIBLE:     'orange',
};

export default function AlertesPage() {
  const { devices } = useDevices();
  const { alarms, setAlarms, updateAlarm } = useDeviceStore();
  const [loading,     setLoading]     = useState(true);
  const [acquitting,  setAcquitting]  = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (devices.length === 0) return;
      try {
        const all: Alarm[] = [];
        for (const d of devices) {
          const deviceAlarms = await deviceService.getAlarmes(d.id);
          all.push(...deviceAlarms);
        }
        all.sort((a, b) =>
          new Date(b.horodatage).getTime() - new Date(a.horodatage).getTime()
        );
        setAlarms(all);
      } catch {
        toast.error('Erreur chargement alertes');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [devices]);

  const getDeviceName = (vehiculeId: string): string =>
    devices.find((d) => d.id === vehiculeId)?.imei.slice(-4)
      ? `FCN-${devices.find((d) => d.id === vehiculeId)!.imei.slice(-4)}`
      : vehiculeId;

  const handleAcquit = async (alarm: Alarm) => {
    setAcquitting(alarm.id);
    try {
      await deviceService.acquitAlarme(alarm.vehiculeId, alarm.id);
      updateAlarm(alarm.id, { estAcquittee: true });
      toast.success('Alerte acquittee');
    } catch {
      toast.error('Erreur lors de l\'acquittement');
    } finally {
      setAcquitting(null);
    }
  };

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Alertes</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Evenements critiques concernant vos dispositifs.
        </p>
      </div>

      {/* LISTE */}
      <div className="flex flex-col gap-4 max-w-3xl">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-[12px] animate-pulse border border-[#E5E0D8]" />
          ))
        ) : alarms.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-4">
            <RiAlertLine size={48} className="text-[#E5E0D8]" />
            <p className="text-[#6B7280]">Aucune alerte</p>
          </div>
        ) : (
          alarms.map((alarm) => {
            const Icon    = ALARM_ICONS[alarm.typeAlarme];
            const color   = ALARM_COLORS[alarm.typeAlarme];
            const bgColor = alarm.typeAlarme === 'SORTIE_ZONE' || alarm.typeAlarme === 'DECOLLEMENT_TRACEUR'
              ? '#FEF2F2'
              : '#FFFBEB';

            return (
              <Card key={alarm.id} className={alarm.estAcquittee ? 'opacity-60' : ''}>
                <div className="flex items-start gap-4">

                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: bgColor }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <Badge
                        color={ALARM_BADGE_COLOR[alarm.typeAlarme]}
                      >
                        {ALARM_LABELS[alarm.typeAlarme]}
                      </Badge>
                      <span className="text-sm font-semibold text-[#6B7280]">
                        {getDeviceName(alarm.vehiculeId)}
                      </span>
                      {!alarm.estAcquittee && (
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0 ml-auto" />
                      )}
                    </div>

                    <p className="text-base font-semibold text-[#1A1A1A] mb-0.5">
                      {alarm.typeAlarme === 'BATTERIE_FAIBLE' && alarm.valeurMesuree
                        ? `Batterie faible — ${alarm.valeurMesuree}%`
                        : alarm.typeAlarme === 'NON_MOUVEMENT'
                        ? 'Immobilisation depuis 4h'
                        : alarm.typeAlarme === 'DECOLLEMENT_TRACEUR'
                        ? 'Dispositif retire'
                        : ALARM_LABELS[alarm.typeAlarme]
                      }
                    </p>

                    <p className="text-xs text-[#9CA3AF]">
                      {formatDateTime(alarm.horodatage)}
                    </p>
                  </div>

                  {/* Acquit */}
                  {!alarm.estAcquittee && (
                    <button
                      onClick={() => handleAcquit(alarm)}
                      disabled={acquitting === alarm.id}
                      className="
                        shrink-0 w-5 h-5 rounded-full border-2 border-[#E5E0D8]
                        cursor-pointer hover:border-[#1B4332] transition-all
                        disabled:opacity-40 mt-1
                      "
                      title="Acquitter"
                    />
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}