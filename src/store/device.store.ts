import { create } from 'zustand';
import { Device, LivePosition, Alarm } from '@/types';

interface DeviceState {
  devices: Device[];
  livePositions: Record<string, LivePosition>;
  alarms: Alarm[];
  selectedDeviceId: string | null;

  setDevices: (devices: Device[]) => void;
  updateLivePosition: (pos: LivePosition) => void;
  addAlarm: (alarm: Alarm) => void;
  setAlarms: (alarms: Alarm[]) => void;
  updateAlarm: (id: string, patch: Partial<Alarm>) => void;
  setSelectedDeviceId: (id: string | null) => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  devices: [],
  livePositions: {},
  alarms: [],
  selectedDeviceId: null,

  setDevices: (devices) => set({ devices }),

  updateLivePosition: (pos) =>
    set((state) => ({
      livePositions: { ...state.livePositions, [pos.vehiculeId]: pos },
    })),

  addAlarm: (alarm) =>
    set((state) => {
      const exists = state.alarms.find((a) => a.id === alarm.id);
      if (exists) return state;
      return { alarms: [alarm, ...state.alarms] };
    }),

  setAlarms: (alarms) => set({ alarms }),

  updateAlarm: (id, patch) =>
    set((state) => ({
      alarms: state.alarms.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })),

  setSelectedDeviceId: (id) => set({ selectedDeviceId: id }),
}));