import api from '@/lib/axios';
import {
  ApiResponse, UtilisateurResume, UtilisateurDetail, VehiculeResume, VehiculeDetail,
  Alarme, StatsOverview, Commande, CodeCommande, Role, VehiculeProvisionne, DeviceMode,
} from '@/types';

export const adminService = {
  // ── Utilisateurs ──────────────────────────────────────────────
  getUtilisateurs: async (): Promise<UtilisateurResume[]> => {
    const { data } = await api.get<ApiResponse<UtilisateurResume[]>>('/admin/utilisateurs');
    return data.data!;
  },

  getUtilisateurById: async (id: string): Promise<UtilisateurDetail> => {
    const { data } = await api.get<ApiResponse<UtilisateurDetail>>(`/admin/utilisateurs/${id}`);
    return data.data!;
  },

  creerUtilisateur: async (
    userName: string, email: string, password: string, role: Role
  ): Promise<UtilisateurResume> => {
    const { data } = await api.post<ApiResponse<UtilisateurResume>>('/admin/utilisateurs', {
      userName, email, password, role,
    });
    return data.data! as unknown as UtilisateurResume;
  },

  setRole: async (id: string, role: Role): Promise<void> => {
    await api.patch(`/admin/utilisateurs/${id}/role`, { role });
  },

  supprimerUtilisateur: async (id: string): Promise<void> => {
    await api.delete(`/admin/utilisateurs/${id}`);
  },

  // ── Traceurs ──────────────────────────────────────────────────
  getVehicules: async (): Promise<VehiculeResume[]> => {
    const { data } = await api.get<ApiResponse<VehiculeResume[]>>('/admin/vehicules');
    return data.data!;
  },

  getVehiculeById: async (id: string): Promise<VehiculeDetail> => {
    const { data } = await api.get<ApiResponse<VehiculeDetail>>(`/admin/vehicules/${id}`);
    return data.data!;
  },

  updateVehicule: async (
    id: string, changes: { nom?: string; estActif?: boolean; utilisateurId?: string | null }
  ): Promise<void> => {
    await api.patch(`/admin/vehicules/${id}`, changes);
  },

  supprimerVehicule: async (id: string): Promise<void> => {
    await api.delete(`/admin/vehicules/${id}`);
  },

  envoyerCommande: async (id: string, codeCommande: CodeCommande, valeur?: string): Promise<Commande> => {
    const { data } = await api.post<ApiResponse<Commande>>(`/admin/vehicules/${id}/commandes`, {
      codeCommande, valeur,
    });
    return data.data!;
  },

  provisionner: async (count: number, prefix: string, apiKey?: string): Promise<VehiculeProvisionne[]> => {
    const { data } = await api.post<ApiResponse<VehiculeProvisionne[]>>(
      '/admin/vehicules/provision',
      { count, prefix },
      { headers: apiKey ? { 'x-provisioning-key': apiKey } : {} }
    );
    return data.data!;
  },

  // ── Alarmes ───────────────────────────────────────────────────
  getAlarmes: async (filtres?: { typeAlarme?: string; estAcquittee?: boolean; vehiculeId?: string }): Promise<Alarme[]> => {
    const { data } = await api.get<ApiResponse<Alarme[]>>('/admin/alarmes', { params: filtres });
    return data.data!;
  },

  acquitAlarme: async (alarmeId: string): Promise<void> => {
    await api.patch(`/admin/alarmes/${alarmeId}/acquit`);
  },

  deleteAlarme: async (alarmeId: string): Promise<void> => {
    await api.delete(`/admin/alarmes/${alarmeId}`);
  },

  // ── Configuration traceur (vue admin) ─────────────────────────
  setMode: async (id: string, mode: DeviceMode): Promise<void> => {
    await api.put(`/admin/vehicules/${id}/mode`, { mode });
  },

  setSpeedLimit: async (id: string, seuilKmh: number): Promise<void> => {
    await api.put(`/admin/vehicules/${id}/speed-limit`, { seuilKmh });
  },

  setGeofence: async (
    id: string,
    nom: string,
    centreLat: number,
    centreLon: number,
    rayonMetres: number
  ): Promise<void> => {
    await api.put(`/admin/vehicules/${id}/geofence`, { nom, centreLat, centreLon, rayonMetres });
  },

  setPhoneAlerte: async (id: string, telephone: string): Promise<void> => {
    await api.put(`/admin/vehicules/${id}/telephone-alerte`, { telephone });
  },

  // ── Statistiques ──────────────────────────────────────────────
  getStatsOverview: async (): Promise<StatsOverview> => {
    const { data } = await api.get<ApiResponse<StatsOverview>>('/admin/stats/overview');
    return data.data!;
  },
};
