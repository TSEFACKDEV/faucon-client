import api from '@/lib/axios';
import { Device, Position, Alarm, DailyReport, ApiResponse } from '@/types';

export const deviceService = {
  getAll: async (): Promise<Device[]> => {
    const { data } = await api.get<ApiResponse<Device[]>>('/vehicles');
    return data.data ?? [];
  },

  getById: async (id: string): Promise<Device> => {
    const { data } = await api.get<ApiResponse<Device>>(`/vehicles/${id}`);
    return data.data!;
  },

  add: async (imei: string, nom: string): Promise<Device> => {
    const { data } = await api.post<ApiResponse<Device>>('/vehicles', { imei, nom });
    return data.data!;
  },

  update: async (id: string, payload: { nom?: string; image?: string }): Promise<Device> => {
    const { data } = await api.put<ApiResponse<Device>>(`/vehicles/${id}`, payload);
    return data.data!;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/vehicles/${id}`);
  },

  getLastPosition: async (id: string): Promise<Position | null> => {
    const { data } = await api.get<ApiResponse<Position>>(`/vehicles/${id}/position/last`);
    return data.data ?? null;
  },

  getPositionHistory: async (id: string, date: string): Promise<Position[]> => {
    const { data } = await api.get<ApiResponse<Position[]>>(
      `/vehicles/${id}/position/history`,
      { params: { date } }
    );
    return data.data ?? [];
  },

  getAlarmes: async (id: string): Promise<Alarm[]> => {
    const { data } = await api.get<ApiResponse<Alarm[]>>(`/vehicles/${id}/alarmes`);
    return data.data ?? [];
  },

  acquitAlarme: async (vehiculeId: string, alarmeId: string): Promise<void> => {
    await api.patch(`/vehicles/${vehiculeId}/alarmes/${alarmeId}/acquit`);
  },

  getDailyReport: async (id: string, date: string): Promise<DailyReport | null> => {
    const { data } = await api.get<ApiResponse<DailyReport>>(
      `/vehicles/${id}/report/daily`,
      { params: { date } }
    );
    return data.data ?? null;
  },

  setMode: async (id: string, mode: string): Promise<void> => {
    await api.put(`/vehicles/${id}/mode`, { mode });
  },

  setSpeedLimit: async (id: string, seuilKmh: number): Promise<void> => {
    await api.put(`/vehicles/${id}/speed-limit`, { seuilKmh });
  },

  setGeofence: async (
    id: string,
    nom: string,
    centreLat: number,
    centreLon: number,
    rayonMetres: number
  ): Promise<void> => {
    await api.put(`/vehicles/${id}/geofence`, { nom, centreLat, centreLon, rayonMetres });
  },
};