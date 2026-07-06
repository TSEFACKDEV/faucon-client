'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Device, LivePosition } from '@/types';

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const SAT_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

interface Props {
  devices: Device[];
  livePositions: Record<string, LivePosition>;
  selectedId: string | null;
  mapStyle: 'route' | 'satellite';
  onMarkerClick: (id: string) => void;
}

const createMarker = (color: string, label: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
      <circle cx="20" cy="20" r="18" fill="${color}" stroke="white" stroke-width="3"/>
      <circle cx="20" cy="20" r="8" fill="white"/>
      <polygon points="20,38 12,28 28,28" fill="${color}"/>
    </svg>
  `;
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
        ${svg}
        <div style="
          background:white;border:1px solid ${color};
          border-radius:4px;padding:1px 6px;
          font-size:10px;font-weight:700;color:${color};
          white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.15)
        ">${label}</div>
      </div>
    `,
    className: '',
    iconSize:  [60, 64],
    iconAnchor: [30, 48],
  });
};

export default function MapView({
  devices,
  livePositions,
  selectedId,
  mapStyle,
  onMarkerClick,
}: Props) {
  const mapRef     = useRef<L.Map | null>(null);
  const tileRef    = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialiser la carte
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center:  [3.848, 11.502],
      zoom:    12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    tileRef.current = L.tileLayer(OSM_URL, {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Changer le style de carte
  useEffect(() => {
    if (!mapRef.current || !tileRef.current) return;
    tileRef.current.setUrl(mapStyle === 'satellite' ? SAT_URL : OSM_URL);
  }, [mapStyle]);

  // Mettre à jour les marqueurs
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    devices.forEach((device) => {
      const pos = livePositions[device.id];
      if (!pos) return;

      const isSelected = device.id === selectedId;
      const color = isSelected ? '#1B4332' : '#F59E0B';
      const label = `FCN-${device.imei.slice(-4)}`;
      const icon  = createMarker(color, label);
      const latlng: L.LatLngTuple = [pos.latitude, pos.longitude];

      if (markersRef.current[device.id]) {
        markersRef.current[device.id]
          .setLatLng(latlng)
          .setIcon(icon);
      } else {
        const marker = L.marker(latlng, { icon })
          .addTo(map)
          .on('click', () => onMarkerClick(device.id));
        markersRef.current[device.id] = marker;
      }
    });
  }, [devices, livePositions, selectedId]);

  // Centrer sur le device sélectionné
  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const pos = livePositions[selectedId];
    if (!pos) return;
    mapRef.current.flyTo([pos.latitude, pos.longitude], 14, { duration: 1 });
  }, [selectedId, livePositions]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', background: '#E8E4DC' }}
    />
  );
}