'use client';
import { useEffect, useState } from 'react';

// Force un re-render périodique — sans ça, un statut dérivé de `Date.now()`
// (ex. isOnline(derniereCommunication)) ne se réévalue que lorsque le
// composant re-render pour une AUTRE raison (nouvelle trame temps réel sur
// CE traceur précis). Un traceur qui cesse d'émettre (batterie coupée,
// arraché) resterait alors affiché "En ligne" indéfiniment jusqu'au
// prochain rechargement de page — critique sur un produit anti-vol où ce
// badge est ce sur quoi un opérateur se base.
export const useTick = (intervalMs = 30_000): number => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return tick;
};
