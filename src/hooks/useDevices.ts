'use client';
import { useEffect, useCallback } from 'react';
import { deviceService } from '@/services/device.service';
import { useDeviceStore } from '@/store/device.store';

export const useDevices = () => {
  const { devices, setDevices } = useDeviceStore();

  const fetch = useCallback(async () => {
    try {
      const data = await deviceService.getAll();
      setDevices(data);
    } catch (err) {
      console.error('[useDevices]', err);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, []);

  return { devices, refetch: fetch };
};