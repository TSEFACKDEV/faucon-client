'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// CARTO Voyager : gratuit, sans clé, pensé pour un usage applicatif —
// contrairement à tile.openstreetmap.org (serveur de démo de l'OSM
// Foundation, qui bannit les apps à fort trafic sans préavis).
const OSM_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

export interface MapMarkerData {
  id: string;
  latitude: number;
  longitude: number;
  label: string;
  color?: string;
  // Halo pulsant autour du marqueur (traceur suivi / fraîchement reçu).
  pulse?: boolean;
}

export interface MapRoutePoint {
  latitude: number;
  longitude: number;
}

interface Props {
  markers: MapMarkerData[];
  selectedId?: string | null;
  onMarkerClick?: (id: string) => void;
  route?: MapRoutePoint[];
  routeColor?: string;
  // Id du marqueur à suivre : la carte recentre en continu sur son
  // déplacement (mode « traque » temps réel), sans empêcher la navigation
  // manuelle tant que le suivi est désactivé.
  followId?: string | null;
}

const createMarker = (color: string, label: string, pulse = false) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="48" viewBox="0 0 40 48">
      <defs>
        <filter id="pin-shadow" x="-40%" y="-40%" width="180%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.28)"/>
        </filter>
      </defs>
      <path d="M20 2c-8.8 0-16 7.2-16 16 0 12 16 28 16 28s16-16 16-28c0-8.8-7.2-16-16-16z"
            fill="${color}" stroke="white" stroke-width="2.5" filter="url(#pin-shadow)"/>
      <circle cx="20" cy="18" r="6.5" fill="white"/>
    </svg>
  `;
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
        ${pulse ? `<span class="map-pin-pulse" style="background:${color}"></span>` : ''}
        ${svg}
        <div style="
          background:rgba(255,255,255,0.95);border:1px solid ${color};
          border-radius:6px;padding:2px 7px;
          font-size:10px;font-weight:700;color:${color};
          white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.18)
        ">${label}</div>
      </div>
    `,
    className: '',
    iconSize:  [60, 64],
    iconAnchor: [30, 48],
  });
};

export default function MapView({
  markers,
  selectedId = null,
  onMarkerClick,
  route,
  routeColor = '#0057FF',
  followId = null,
}: Props) {
  const mapRef     = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fitDoneRef = useRef(false);
  const lastFollowRef = useRef<{ id: string; lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center:  [3.848, 11.502],
      zoom:    12,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer(OSM_URL, {
      attribution: '© OpenStreetMap contributors © CARTO',
      maxZoom: 19,
      detectRetina: true,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Cadrage initial une seule fois (tous les cas : marqueurs seuls, ou
  // route+marqueur de replay).
  useEffect(() => {
    if (!mapRef.current || fitDoneRef.current) return;
    const map = mapRef.current;

    const bounds = L.latLngBounds([]);
    if (route && route.length > 0) {
      route.forEach((p) => bounds.extend([p.latitude, p.longitude]));
    }
    if (markers.length > 0) {
      markers.forEach((m) => bounds.extend([m.latitude, m.longitude]));
    }

    if (bounds.isValid()) {
      fitDoneRef.current = true;
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: followId ? 15 : 14 });
    }
    // Cadrage volontairement "une seule fois" : `markers.length` suffit à le
    // déclencher, on ne veut PAS re-cadrer à chaque déplacement de marqueur.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route, markers.length, followId]);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const activeIds = new Set<string>();

    markers.forEach((m) => {
      activeIds.add(m.id);
      const isSelected = m.id === selectedId;
      const color = m.color ?? (isSelected ? '#0057FF' : '#00C2FF');
      const pulse = m.pulse === true || m.id === followId;
      const icon  = createMarker(color, m.label, pulse);
      const latlng: L.LatLngTuple = [m.latitude, m.longitude];

      if (markersRef.current[m.id]) {
        markersRef.current[m.id].setLatLng(latlng).setIcon(icon);
      } else {
        const marker = L.marker(latlng, { icon }).addTo(map);
        if (onMarkerClick) marker.on('click', () => onMarkerClick(m.id));
        markersRef.current[m.id] = marker;
      }
    });

    Object.keys(markersRef.current).forEach((id) => {
      if (!activeIds.has(id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });
  }, [markers, selectedId, onMarkerClick, followId]);

  // Mode « suivi » : recentre en douceur sur le marqueur qui se déplace,
  // sans zoomer/dézoomer (on garde le niveau de zoom choisi par l'admin).
  useEffect(() => {
    if (!mapRef.current || !followId) return;
    const m = markers.find((x) => x.id === followId);
    if (!m) return;

    const last = lastFollowRef.current;
    if (last && last.id === followId && last.lat === m.latitude && last.lon === m.longitude) return;

    mapRef.current.panTo([m.latitude, m.longitude], { animate: true, duration: 0.6 });
    lastFollowRef.current = { id: followId, lat: m.latitude, lon: m.longitude };
  }, [markers, followId]);

  // Trajet (polyline) — recalculé à chaque changement du tracé.
  useEffect(() => {
    if (!mapRef.current) return;

    if (!route || route.length < 2) {
      polylineRef.current?.remove();
      polylineRef.current = null;
      return;
    }

    const latlngs = route.map((p) => [p.latitude, p.longitude] as L.LatLngTuple);
    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latlngs);
    } else {
      polylineRef.current = L.polyline(latlngs, {
        color: routeColor,
        weight: 3,
        opacity: 0.85,
      }).addTo(mapRef.current);
    }
  }, [route, routeColor]);

  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const m = markers.find((x) => x.id === selectedId);
    if (!m) return;
    mapRef.current.flyTo([m.latitude, m.longitude], 14, { duration: 1 });
    // `markers` n'est consulté que pour lire la position du marqueur déjà
    // sélectionné : on ne veut voler la carte que lors d'un CHANGEMENT de
    // sélection, pas à chaque mise à jour temps réel du marqueur.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', background: '#EDF2FA' }}
    />
  );
}
