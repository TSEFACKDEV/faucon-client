'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  RiMapPinLine, RiSpeedMiniLine, RiBatteryLine,
  RiWifiLine, RiTimeLine, RiAddLine, RiArrowDownSLine,
  RiCloseLine,
} from 'react-icons/ri';
import { useDeviceStore } from '@/store/device.store';
import { useDevices } from '@/hooks/useDevices';
import { Device, LivePosition } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import {
  formatCoords, formatSpeed, timeAgo, formatTime,
} from '@/lib/utils';
import { useRouter } from 'next/navigation';

// Leaflet ne fonctionne pas en SSR
const MapView = dynamic(() => import('@/components/map/MapView'), { ssr: false });

export default function PositionPage() {
  const router = useRouter();
  const { devices } = useDevices();
  const { livePositions } = useDeviceStore();

  const [selectedId, setSelectedId]     = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [detailOpen,   setDetailOpen]   = useState(false);
  const [mapStyle,     setMapStyle]     = useState<'route' | 'satellite'>('route');

  


  const activeCount = devices.filter((d) =>
    d.id in livePositions
  ).length;


// Supprimez complètement le useEffect et utilisez une valeur calculée
// directement dans le rendu ou avec useMemo

const selected = useMemo(() => {
  // Si un dispositif est sélectionné, le garder
  if (selectedId) {
    const found = devices.find((d) => d.id === selectedId);
    if (found) return found;
  }
  // Sinon, prendre le premier dispositif
  return devices[0] ?? null;
}, [devices, selectedId]);

  const selectedPos = selected ? livePositions[selected.id] : null;
// Et initialiser selectedId si nécessaire
useEffect(() => {
  // Ne faire que si selectedId est null et qu'on a des devices
  if (devices.length > 0 && !selectedId) {
    // Utiliser requestAnimationFrame pour éviter le rendu synchrone
    requestAnimationFrame(() => {
      setSelectedId(devices[0].id);
    });
  }
}, [devices, selectedId]);

  const handleSelectDevice = (device: Device) => {
    setSelectedId(device.id);
    setDropdownOpen(false);
    setDetailOpen(true);
  };

  return (
    <div className="relative h-screen flex flex-col">

      {/* TOPBAR */}
      <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">

        {/* Device selector */}
        <Card padding={false} className="!p-0 overflow-visible w-[300px]">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center gap-3 p-4 cursor-pointer hover:bg-[#F5F0E8] rounded-[12px] transition-all"
          >
            <div className="flex-1 text-left">
              <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
                Dispositif suivi
              </p>
              <p className="text-sm font-semibold text-[#1A1A1A] mt-0.5">
                {selected ? `${selected.nom} — ${selected.imei.slice(-4).padStart(4, '0') }` : 'Choisir un dispositif'}
              </p>
            </div>
            <RiArrowDownSLine
              size={18}
              className={`text-[#6B7280] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 w-full bg-white border border-[#E5E0D8] rounded-[12px] shadow-lg mt-1 overflow-hidden">
              {devices.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDevice(d)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 text-sm cursor-pointer
                    hover:bg-[#F5F0E8] transition-all text-left
                    ${d.id === selectedId ? 'bg-[#F5F0E8] text-[#1B4332] font-semibold' : 'text-[#1A1A1A]'}
                  `}
                >
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
                  {d.nom} — FCN-{d.imei.slice(-4)}
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Stats strip */}
        <Card padding={false}>
          <div className="flex items-center gap-4 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span className="text-xs text-[#6B7280]">{activeCount} dispositifs actifs</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/dispositifs')}
              className="!text-[#1B4332] !font-semibold"
            >
              <RiAddLine size={14} />
              Ajouter un dispositif
            </Button>
          </div>
        </Card>
      </div>

      {/* CARTE */}
      <div className="flex-1">
        <MapView
          devices={devices}
          livePositions={livePositions}
          selectedId={selectedId}
          mapStyle={mapStyle}
          onMarkerClick={(id) => {
            setSelectedId(id);
            setDetailOpen(true);
          }}
        />
      </div>

      {/* TOGGLE CARTE / SATELLITE */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000]">
        <div className="flex bg-[#1A1A1A] rounded-[10px] p-1 gap-1">
          {(['route', 'satellite'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setMapStyle(s)}
              className={`
                px-5 py-2 rounded-[7px] text-sm font-medium cursor-pointer transition-all
                ${mapStyle === s
                  ? 'bg-white text-[#1A1A1A]'
                  : 'text-white/70 hover:text-white'
                }
              `}
            >
              {s === 'route' ? 'Carte' : 'Satellite'}
            </button>
          ))}
        </div>
      </div>

      {/* DETAIL PANEL */}
      {detailOpen && selected && (
        <div className="absolute top-4 right-4 z-[1000] w-[280px]">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
                  Details
                </p>
                <p className="text-base font-bold text-[#1A1A1A] mt-0.5">
                  {selected.nom} — FCN-{selected.imei.slice(-4)}
                </p>
              </div>
              <button
                onClick={() => setDetailOpen(false)}
                className="text-[#9CA3AF] hover:text-[#1A1A1A] cursor-pointer"
              >
                <RiCloseLine size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <DetailRow
                icon={<RiMapPinLine size={16} className="text-[#1B4332]" />}
                label="Coordonnees"
                value={
                  selectedPos
                    ? formatCoords(selectedPos.latitude, selectedPos.longitude)
                    : 'Non disponible'
                }
              />
              <DetailRow
                icon={<RiSpeedMiniLine size={16} className="text-[#1B4332]" />}
                label="Vitesse"
                value={selectedPos ? formatSpeed(selectedPos.vitesse) : '--'}
              />
              <DetailRow
                icon={<RiBatteryLine size={16} className="text-[#1B4332]" />}
                label="Batterie"
                value={`${selected.niveauBatterie}%`}
              />
              <DetailRow
                icon={<RiWifiLine size={16} className="text-[#1B4332]" />}
                label="Connexion"
                value={selectedPos ? 'En ligne' : 'Hors ligne'}
              />
              <DetailRow
                icon={<RiTimeLine size={16} className="text-[#1B4332]" />}
                label="Derniere mise a jour"
                value={selectedPos ? timeAgo(selectedPos.horodatage) : '--'}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

const DetailRow = ({
  icon, label, value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 rounded-full bg-[#F5F0E8] flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm font-semibold text-[#1A1A1A]">{value}</p>
    </div>
  </div>
);