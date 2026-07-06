'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  RiMailLine,
  RiLockLine,
  RiEyeLine,
  RiEyeOffLine,
  RiRadioLine,
  RiMapPinLine,
  RiBatteryChargeLine,
  RiBellLine,
  RiShareLine,
} from 'react-icons/ri';
import { loginSchema } from '@/lib/validations';
import { authService } from '@/services/auth.service';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const FEATURES = [
  { icon: RiMapPinLine, label: 'Localisation en temps reel' },
  { icon: RiBatteryChargeLine, label: 'Autonomie longue duree' },
  { icon: RiBellLine, label: 'Alertes instantanees' },
  { icon: RiShareLine, label: 'Partagez votre position' },
];

interface LoginFormValues {
  email: string;
  password: string;
  deviceId: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ): Promise<void> => {
    setIsLoading(true);
    
    try {
      await authService.login(values.email, values.password);
      toast.success('Connexion reussie');
      router.push('/dashboard/position');
    } catch (error: unknown) {
      let errorMessage = 'Email ou mot de passe incorrect';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as { response?: { data?: { message?: string } } };
        if (responseError.response?.data?.message) {
          errorMessage = responseError.response.data.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  const handleForgotPassword = (): void => {
    router.push('/auth/forgot-password');
  };

  const handlePrivacyPolicy = (): void => {
    router.push('/legal/privacy-policy');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0E8] to-[#EAE5DD] flex flex-col">
      <div className="flex-1 flex items-center px-6 md:px-12 py-8 md:py-16 gap-8 md:gap-16 max-w-7xl mx-auto w-full">
        
        {/* Section gauche - Contenu informatif */}
        <div className="flex-1 hidden lg:block">
          <div className="mb-8">
            <Image
              src="/logo.png"
              alt="Faucon - GPS Tracking Made in Cameroun"
              width={180}
              height={54}
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-[#1B4332] text-2xl md:text-3xl font-light leading-relaxed mb-10 max-w-lg">
            Faucon est un dispositif de tracking GPS Made in Cameroun qui permet de
            localiser en temps reel vos conteneurs, depuis une application mobile
            ou web simple et accessible.
          </h2>

          <div className="flex flex-col gap-4 mb-10">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 group-hover:bg-[#F59E0B]/20 transition-colors flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[#F59E0B]" />
                </div>
                <span className="text-[#1B4332] font-medium text-sm md:text-base">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Section QR Code mobile */}
          <div>
            <p className="text-sm font-semibold text-[#1B4332] mb-3">
              Application mobile
            </p>
            <div className="w-32 h-32 border-2 border-[#1B4332]/20 rounded-xl flex items-center justify-center bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center">
                <RiMapPinLine size={48} className="text-[#1B4332]/20 mx-auto mb-2" />
                <span className="text-xs text-[#1B4332]/40">QR Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section droite - Formulaire de connexion */}
        <div className="w-full max-w-md lg:w-[420px] mx-auto lg:mx-0 bg-white rounded-2xl shadow-xl p-6 md:p-10 shrink-0">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1B4332]">
              Bienvenue
            </h1>
            <p className="text-sm text-[#6B7280] mt-2">
              Connectez-vous pour acceder a votre espace
            </p>
          </div>

          <Formik
            initialValues={{ email: '', password: '', deviceId: '' }}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="flex flex-col gap-5">
                <Input
                  label="Adresse email"
                  name="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  leftIcon={<RiMailLine size={18} />}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : undefined}
                  autoComplete="email"
                  required
                />

                <div className="flex flex-col gap-1">
                  <Input
                    label="Mot de passe"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Entrez votre mot de passe"
                    leftIcon={<RiLockLine size={18} />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#9CA3AF] hover:text-[#1B4332] transition-colors"
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      >
                        {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                      </button>
                    }
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.password ? errors.password : undefined}
                    autoComplete="current-password"
                    required
                  />
                  
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs text-[#F59E0B] hover:text-[#D97706] hover:underline transition-colors"
                    >
                      Mot de passe oublie ?
                    </button>
                  </div>
                </div>

                <Input
                  label="Identifiant du dispositif"
                  name="deviceId"
                  type="text"
                  placeholder="FCN-000123"
                  leftIcon={<RiRadioLine size={18} />}
                  value={values.deviceId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.deviceId ? errors.deviceId : undefined}
                  
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isLoading}
                  fullWidth
                  className="mt-2"
                >
                  Se connecter
                </Button>

                <div className="text-center text-xs text-[#9CA3AF] mt-2">
                  En vous connectant, vous acceptez notre{' '}
                  <button
                    type="button"
                    onClick={handlePrivacyPolicy}
                    className="text-[#F59E0B] hover:text-[#D97706] hover:underline transition-colors"
                  >
                    politique de confidentialite
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Pied de page */}
      <footer className="border-t border-[#E5E0D8] bg-white/50 backdrop-blur-sm py-5 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-[#6B7280]">
            Faucon Group · +237 694 831 295 · info@faucon.com
          </p>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Copyright 2026 Faucon Group. Tous droits reserves
          </p>
        </div>
      </footer>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}