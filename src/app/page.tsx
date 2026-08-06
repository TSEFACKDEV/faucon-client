'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { loginSchema } from '@/lib/validations';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';

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
      let message = 'Email ou mot de passe incorrect';
      if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as { response?: { data?: { message?: string } } };
        if (responseError.response?.data?.message) message = responseError.response.data.message;
      }
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-0 relative overflow-hidden px-6">
      {/* Fond doux — dégradé subtil, pas de texture agressive */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-neutral-0 to-neutral-0" />
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] rounded-full bg-primary-100/40 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] rounded-full bg-accent-100/30 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-[0_8px_40px_rgba(33,31,27,0.08)] border border-neutral-100 p-8 md:p-10"
      >
        <div className="flex flex-col items-center gap-2 mb-8">
          <Logo size={40} />
          <p className="text-sm text-neutral-600 mt-1">Dashboard d&apos;administration</p>
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
