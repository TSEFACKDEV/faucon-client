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
  markers,
  selectedId = null,
  onMarkerClick,
  route,
  routeColor = '#363F70',
}: Props) {
  const mapRef     = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const polylineRef = useRef<L.Polyline | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fitDoneRef = useRef(false);

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

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const activeIds = new Set<string>();

    markers.forEach((m) => {
      activeIds.add(m.id);
      const isSelected = m.id === selectedId;
      const color = m.color ?? (isSelected ? '#363F70' : '#F2884D');
      const icon  = createMarker(color, m.label);
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

    // Cadrage automatique une seule fois, dès que des marqueurs arrivent —
    // pas à chaque mise à jour, pour ne pas gêner un admin en train de
    // naviguer sur la carte.
    if (!fitDoneRef.current && markers.length > 0) {
      fitDoneRef.current = true;
      const bounds = L.latLngBounds(markers.map((m) => [m.latitude, m.longitude] as L.LatLngTuple));
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }, [markers, selectedId, onMarkerClick]);

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

  // Cadrage sur le trajet quand il n'y a pas de marqueurs (replay seul).
  useEffect(() => {
    if (!mapRef.current || fitDoneRef.current) return;
    if (route && route.length > 0 && markers.length === 0) {
      fitDoneRef.current = true;
      const bounds = L.latLngBounds(route.map((p) => [p.latitude, p.longitude] as L.LatLngTuple));
      mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
  }, [route, markers.length]);

  useEffect(() => {
    if (!mapRef.current || !selectedId) return;
    const m = markers.find((x) => x.id === selectedId);
    if (!m) return;
    mapRef.current.flyTo([m.latitude, m.longitude], 14, { duration: 1 });
  }, [selectedId]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', background: '#F3F1EE' }}
    />
  );
}
