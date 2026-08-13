'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import Image from 'next/image';
import { loginSchema } from '@/lib/validations';
import { getErrorMessage } from '@/lib/errors';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ): Promise<void> => {
    try {
      const { user } = await authService.login(values.email, values.password);

      if (user.role !== 'ADMIN') {
        await authService.logout();
        toast.error('Ce compte n\'a pas accès au dashboard admin');
        return;
      }

      setUser(user);
      toast.success(`Bienvenue, ${user.userName}`);
      router.push('/dashboard');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Email ou mot de passe incorrect. Vérifiez vos identifiants et réessayez.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      {/* Fond : dégradé de marque + quadrillé « tour de contrôle » très discret */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-700 to-primary-800" />
      <div className="absolute inset-0 bg-blueprint opacity-[0.15]" />
      <div className="absolute -top-48 -right-40 w-[560px] h-[560px] rounded-full bg-accent-500/25 blur-3xl animate-float-slow" />
      <div className="absolute -bottom-48 -left-40 w-[460px] h-[460px] rounded-full bg-white/10 blur-3xl animate-float-slower" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-[0_24px_70px_rgba(9,11,26,0.45)] border border-white/60 p-8 md:p-10"
      >
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary-600 shadow-lg shadow-primary-600/30 flex items-center justify-center">
            <Image src="/mark.png" alt="Faucon" width={30} height={30} />
          </div>
          <p className="text-sm font-semibold text-primary-600 mt-2 tracking-wide">FAUCON</p>
          <p className="text-sm text-neutral-600 mt-1">Tour de contrôle des traceurs</p>
        </div>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="flex flex-col gap-5">
              <Input
                label="Adresse email"
                name="email"
                type="email"
                placeholder="admin@faucon.com"
                leftIcon={<IoMailOutline size={18} />}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
                autoComplete="email"
                required
              />

              <Input
                label="Mot de passe"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                leftIcon={<IoLockClosedOutline size={18} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-neutral-500 hover:text-primary-600 transition-colors"
                    aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  >
                    {showPassword ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
                  </button>
                }
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : undefined}
                autoComplete="current-password"
                required
              />

              <Button type="submit" variant="primary" size="lg" loading={isSubmitting} fullWidth className="mt-2">
                Se connecter
              </Button>
            </Form>
          )}
        </Formik>

        <p className="text-center text-xs text-neutral-500 mt-8">
          Accès réservé au personnel Faucon
        </p>
      </motion.div>

      <ToastContainer position="top-right" autoClose={3500} closeOnClick pauseOnHover theme="light" />
    </div>
  );
}
