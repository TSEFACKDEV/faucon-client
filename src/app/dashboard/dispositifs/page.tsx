'use client';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  RiAddLine, RiEditLine, RiDeleteBinLine,
  RiMapPinLine, RiHistoryLine, RiShareLine,
  RiBatteryLine, RiSpeedMiniLine, RiCloseLine,
} from 'react-icons/ri';
import { useDevices } from '@/hooks/useDevices';
import { deviceService } from '@/services/device.service';
import { Device } from '@/types';
import { addDeviceSchema } from '@/lib/validations';
import { getBatteryColor } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useDeviceStore } from '@/store/device.store';

export default function DispositifsPage() {
  const { devices, refetch } = useDevices();
  const { livePositions }    = useDeviceStore();
  const [showModal, setShowModal] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

const handleAdd = async (
  values: { imei: string; nom: string },
  { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
) => {
  try {
    await deviceService.add(values.imei, values.nom);
    toast.success(`${values.nom} ajoute avec succes`);
    resetForm();
    setShowModal(false);
    refetch();
  } catch (err: unknown) {
    // Remplacer 'any' par 'unknown' et ajouter des vérifications de type
    const errorMessage = 
      err && typeof err === 'object' && 'response' in err &&
      err.response && typeof err.response === 'object' && 'data' in err.response &&
      err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String(err.response.data.message)
        : 'Erreur lors de l\'ajout';
    toast.error(errorMessage);
  } finally {
    setSubmitting(false);
  }
};

  const handleDelete = async (id: string, nom: string) => {
    if (!confirm(`Supprimer ${nom} ?`)) return;
    setDeletingId(id);
    try {
      await deviceService.remove(id);
      toast.success(`${nom} supprime`);
      refetch();
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-8">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Dispositifs</h1>
          <p className="text-sm text-[#6B7280] mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block" />
            {devices.length} dispositifs enregistres
          </p>
        </div>
        <Button
          variant="accent"
          size="md"
          onClick={() => setShowModal(true)}
        >
          <RiAddLine size={16} />
          Ajouter un dispositif
        </Button>
      </div>

      {/* GRID */}
      {devices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <RiMapPinLine size={48} className="text-[#E5E0D8]" />
          <p className="text-[#6B7280]">Aucun dispositif enregistre</p>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            <RiAddLine size={16} />
            Ajouter votre premier dispositif
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {devices.map((device) => {
            const pos = livePositions[device.id];
            const battColor = getBatteryColor(device.niveauBatterie);

            return (
              <Card key={device.id}>
                {/* HEADER carte */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">
                      {device.nom} — FCN-{device.imei.slice(-4)}
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditDevice(device)}
                    className="text-[#9CA3AF] hover:text-[#1B4332] cursor-pointer transition-all"
                  >
                    <RiEditLine size={16} />
                  </button>
                </div>

                {/* BATTERIE */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide">
                      <RiBatteryLine size={14} />
                      Batterie
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: battColor }}
                    >
                      {device.niveauBatterie}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#F5F0E8] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width:           `${device.niveauBatterie}%`,
                        backgroundColor: battColor,
                      }}
                    />
                  </div>
                </div>

                {/* VITESSE */}
                <div className="flex items-center justify-between py-3 border-t border-[#F5F0E8]">
                  <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                    <RiSpeedMiniLine size={16} />
                    Vitesse
                  </div>
                  <span className="text-sm font-bold text-[#1A1A1A]">
                    {pos ? `${Math.round(pos.vitesse)} km/h` : '0 km/h'}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F5F0E8]">
                  <div className="flex items-center gap-3">
                    <button
                      title="Position"
                      className="text-[#9CA3AF] hover:text-[#1B4332] cursor-pointer transition-all"
                    >
                      <RiMapPinLine size={18} />
                    </button>
                    <button
                      title="Historique"
                      className="text-[#9CA3AF] hover:text-[#1B4332] cursor-pointer transition-all"
                    >
                      <RiHistoryLine size={18} />
                    </button>
                    <button
                      title="Partager"
                      className="text-[#9CA3AF] hover:text-[#1B4332] cursor-pointer transition-all"
                    >
                      <RiShareLine size={18} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(device.id, device.nom)}
                    disabled={deletingId === device.id}
                    className="text-[#EF4444] hover:text-[#DC2626] cursor-pointer transition-all disabled:opacity-40"
                  >
                    <RiDeleteBinLine size={18} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* MODAL AJOUT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[16px] shadow-xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1A1A1A]">Ajouter un dispositif</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#9CA3AF] hover:text-[#1A1A1A] cursor-pointer"
              >
                <RiCloseLine size={22} />
              </button>
            </div>

            <Formik
              initialValues={{ imei: '', nom: '' }}
              validationSchema={addDeviceSchema}
              onSubmit={handleAdd}
            >
              {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                <Form className="flex flex-col gap-5">
                  <Input
                    label="IMEI (15 chiffres)"
                    name="imei"
                    placeholder="358000000000001"
                    maxLength={15}
                    value={values.imei}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.imei ? errors.imei : undefined}
                  />
                  <Input
                    label="Nom du dispositif"
                    name="nom"
                    placeholder="Ex: Container Nord"
                    value={values.nom}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.nom ? errors.nom : undefined}
                  />

                  <div className="bg-[#F5F0E8] rounded-[10px] p-4 text-xs text-[#6B7280]">
                    L&apos;IMEI est le code unique de 15 chiffres inscrit sous votre traceur GPS Faucon.
                  </div>

                  <div className="flex gap-3 mt-2">
                    <Button
                      type="button"
                      variant="secondary"
                      fullWidth
                      onClick={() => setShowModal(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      loading={isSubmitting}
                    >
                      Connecter
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}