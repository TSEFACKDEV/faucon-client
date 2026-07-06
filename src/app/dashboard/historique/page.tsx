'use client';
import { useState, useEffect } from 'react';
import { RiMapPinLine, RiPlayCircleLine, RiCalendarLine } from 'react-icons/ri';
import { deviceService } from '@/services/device.service';
import { useDevices } from '@/hooks/useDevices';
import { Position } from '@/types';
import { formatDateTime } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'react-toastify';

interface SessionItem {
  deviceId:    string;
  deviceName:  string;
  deviceImei:  string;
  date:        string;
  startPos:    Position;
  endPos:      Position;
  distanceKm:  number;
  durationMin: number;
}

const getLast30Days = () => {
  const today    = new Date();
  const start    = new Date(today);
  start.setDate(start.getDate() - 30);
  return {
    from: start.toISOString().split('T')[0],
    to:   today.toISOString().split('T')[0],
  };
};

const calcDistanceKm = (positions: Position[]): number => {
  let dist = 0;
  for (let i = 1; i < positions.length; i++) {
    const R    = 6371;
    const dLat = ((positions[i].latitude - positions[i-1].latitude) * Math.PI) / 180;
    const dLon = ((positions[i].longitude - positions[i-1].longitude) * Math.PI) / 180;
    const a    =
      Math.sin(dLat/2)**2 +
      Math.cos((positions[i-1].latitude * Math.PI)/180) *
      Math.cos((positions[i].latitude * Math.PI)/180) *
      Math.sin(dLon/2)**2;
    dist += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
  return Math.round(dist * 10) / 10;
};

export default function HistoriquePage() {
  const { devices } = useDevices();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [dateFrom, setDateFrom] = useState(getLast30Days().from);
  const [dateTo,   setDateTo]   = useState(getLast30Days().to);

  const loadSessions = async () => {
    if (devices.length === 0) return;
    setLoading(true);
    try {
      const allSessions: SessionItem[] = [];

      for (const device of devices) {
        // Charger chaque jour entre from et to
        const start = new Date(dateFrom);
        const end   = new Date(dateTo);
        const current = new Date(start);

        while (current <= end) {
          const dateStr = current.toISOString().split('T')[0];
          const positions = await deviceService.getPositionHistory(device.id, dateStr);

          if (positions.length >= 2) {
            const duration = Math.round(
              (new Date(positions[positions.length-1].horodatage).getTime() -
               new Date(positions[0].horodatage).getTime()) / 60000
            );
            allSessions.push({
              deviceId:    device.id,
              deviceName:  device.nom,
              deviceImei:  `FCN-${device.imei.slice(-4)}`,
              date:        dateStr,
              startPos:    positions[0],
              endPos:      positions[positions.length - 1],
              distanceKm:  calcDistanceKm(positions),
              durationMin: duration,
            });
          }

          current.setDate(current.getDate() + 1);
        }
      }

      // Trier par date décroissante
      allSessions.sort((a, b) =>
        new Date(b.startPos.horodatage).getTime() - new Date(a.startPos.horodatage).getTime()
      );

      setSessions(allSessions);
    } catch {
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (devices.length === 0) return;
  
  // Décaler l'appel pour sortir du cycle de rendu
  const timeoutId = setTimeout(() => {
    loadSessions();
  }, 0);
  
  return () => clearTimeout(timeoutId);
}, [devices]); // Dépend de devices

  const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m > 0 ? m + ' min' : ''}` : `${m} min`;
  };

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Historique</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Retrouvez tous les trajets effectues par vos dispositifs.
        </p>
      </div>

      {/* FILTRES DATE */}
      <Card className="mb-6">
        <div className="flex items-end gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
              Du
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="
                border border-[#E5E0D8] rounded-[8px] px-4 py-2.5
                text-sm text-[#1A1A1A] bg-white
                focus:outline-none focus:border-[#1B4332]
                cursor-pointer
              "
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
              Au
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="
                border border-[#E5E0D8] rounded-[8px] px-4 py-2.5
                text-sm text-[#1A1A1A] bg-white
                focus:outline-none focus:border-[#1B4332]
                cursor-pointer
              "
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF] uppercase tracking-wide font-semibold">
            <RiCalendarLine size={14} />
            Periode selectionnee
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={loadSessions}
            loading={loading}
          >
            Filtrer
          </Button>
        </div>
      </Card>

      {/* SESSIONS */}
      <div className="flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-[12px] animate-pulse border border-[#E5E0D8]" />
          ))
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RiHistoryLine size={48} className="text-[#E5E0D8]" />
            <p className="text-[#6B7280]">Aucun trajet sur cette periode</p>
          </div>
        ) : (
          sessions.map((session, i) => (
            <Card key={`${session.deviceId}-${session.date}-${i}`} className="hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                {/* LEFT */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Badge */}
                  <div className="mt-0.5">
                    <span className="
                      inline-block px-3 py-1 rounded-full
                      bg-[#1B4332] text-white text-xs font-bold
                    ">
                      {session.deviceImei}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <p className="text-xs text-[#9CA3AF] mb-1">
                      {formatDateTime(session.startPos.horodatage)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                        <RiMapPinLine size={14} className="text-[#1B4332]" />
                        {session.startPos.latitude.toFixed(3)}, {session.startPos.longitude.toFixed(3)}
                      </div>
                      <RiArrow size={14} />
                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#1A1A1A]">
                        <RiMapPinLine size={14} className="text-[#F59E0B]" />
                        {session.endPos.latitude.toFixed(3)}, {session.endPos.longitude.toFixed(3)}
                      </div>
                    </div>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      {session.distanceKm} km · {formatDuration(session.durationMin)}
                    </p>
                  </div>
                </div>

                {/* CTA */}
                <Button variant="secondary" size="sm">
                  <RiPlayCircleLine size={14} />
                  Rejouer
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Arrow component
const RiArrow = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Fix missing import
const RiHistoryLine = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z"/>
  </svg>
);