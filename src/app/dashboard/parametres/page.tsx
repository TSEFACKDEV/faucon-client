'use client';
import { useState } from 'react';
import { Formik, Form } from 'formik';
import { toast } from 'react-toastify';
import { RiArrowRightSLine, RiLogoutBoxLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { profileSchema } from '@/lib/validations';
import { useDeviceStore } from '@/store/device.store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useSocket } from '@/hooks/useSocket';

export default function ParametresPage() {
  const router   = useRouter();
  const { user, clearUser } = useAuthStore();
  const { devices } = useDeviceStore();
  const { disconnect } = useSocket([]);
  const [language, setLanguage] = useState('fr');

  const handleSaveProfile = async (
    values: { userName: string; email: string; telephone: string },
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      await authService.updateProfile(values);
      toast.success('Profil mis a jour');
    } catch {
      toast.error('Erreur lors de la mise a jour');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      disconnect();
      clearUser();
      router.push('/');
    } catch {
      toast.error('Erreur lors de la deconnexion');
    }
  };

  return (
    <div className="p-8 max-w-2xl">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Parametres</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Gerez votre compte et vos preferences.
        </p>
      </div>

      {/* PROFIL */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
          Profil utilisateur
        </p>
        <Card>
          <Formik
            initialValues={{
              userName:  user?.userName  ?? '',
              email:     user?.email     ?? '',
              telephone: user?.telephone ?? '',
            }}
            validationSchema={profileSchema}
            onSubmit={handleSaveProfile}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  <Input
                    label="Nom"
                    name="userName"
                    placeholder="MAKA MAKA"
                    value={values.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.userName ? errors.userName : undefined}
                  />
                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="maka@faucon.app"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email ? errors.email : undefined}
                  />
                </div>
                <div className="w-1/2">
                  <Input
                    label="Telephone"
                    name="telephone"
                    placeholder="+237 6 55 12 34 56"
                    value={values.telephone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    variant="accent"
                    loading={isSubmitting}
                  >
                    Enregistrer
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card>
      </div>

      {/* COMPTE */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
          Compte
        </p>
        <Card padding={false}>
          <div className="flex items-center justify-between px-6 py-4">
            <span className="text-sm text-[#1A1A1A]">Dispositifs associes</span>
            <span className="text-sm font-bold text-[#1A1A1A]">{devices.length}</span>
          </div>
        </Card>
      </div>

      {/* LANGUE */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
          Langue
        </p>
        <Card padding={false}>
          <div className="px-6 py-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="
                w-64 border border-[#E5E0D8] rounded-[8px]
                px-4 py-2.5 text-sm text-[#1A1A1A] bg-white
                focus:outline-none focus:border-[#1B4332]
                cursor-pointer
              "
            >
              <option value="fr">Francais</option>
              <option value="en">English</option>
            </select>
          </div>
        </Card>
      </div>

      {/* INFORMATIONS */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-3">
          Informations
        </p>
        <Card padding={false}>
          {[
            { label: 'Politique de confidentialite', href: '#' },
            { label: 'Aide et support', href: '#' },
          ].map(({ label, href }, i) => (
            <a 
              key={label}
              href={href}
              className={`
                flex items-center justify-between px-6 py-4
                hover:bg-[#F5F0E8] transition-all cursor-pointer
                text-sm text-[#1A1A1A]
                ${i > 0 ? 'border-t border-[#F5F0E8]' : ''}
              `}
            >
              {label}
              <RiArrowRightSLine size={18} className="text-[#9CA3AF]" />
            </a>
          ))}
        </Card>
      </div>

      {/* DECONNEXION */}
      <button
        onClick={handleLogout}
        className="
          flex items-center gap-3 text-sm font-semibold text-[#EF4444]
          hover:underline cursor-pointer transition-all
        "
      >
        <RiLogoutBoxLine size={16} />
        Deconnexion
      </button>
    </div>
  );
}