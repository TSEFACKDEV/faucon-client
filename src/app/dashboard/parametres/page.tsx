'use client';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  IoPersonOutline, IoShieldCheckmarkOutline, IoInformationCircleOutline,
  IoLogOutOutline,
} from 'react-icons/io5';
import { authService } from '@/services/auth.service';
import { useLogout } from '@/hooks/useLogout';
import { User } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useLanguage } from '@/i18n/LanguageProvider';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ParametresPage() {
  const { tr } = useLanguage();
  const { handleLogout, loading: logoutLoading } = useLogout();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');

  const load = useCallback(async () => {
    try {
      const u = await authService.me();
      setUser(u);
      setUserName(u.userName);
      setEmail(u.email);
      setTelephone(u.telephone ?? '');
    } catch (err) {
      console.error('[Parametres]', err);
      toast.error(getErrorMessage(err, tr('Impossible de charger votre profil. Réessayez dans un instant.', 'Unable to load your profile. Try again in a moment.')));
    } finally {
      setLoading(false);
    }
  }, [tr]);

  useEffect(() => {
    const initial = async () => {
      await load();
    };
    initial();
  }, [load]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const u = await authService.updateProfile({ userName, email, telephone: telephone || undefined });
      setUser(u);
      toast.success(tr('Profil mis à jour', 'Profile updated'));
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, tr('Impossible de mettre à jour votre profil. Réessayez dans un instant.', 'Unable to update your profile. Try again in a moment.')));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <div className="p-8 text-neutral-600">{tr('Impossible de charger le profil.', 'Unable to load the profile.')}</div>;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-8 flex flex-col gap-6 max-w-2xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold text-neutral-900">{tr('Paramètres', 'Settings')}</h1>
        <p className="text-sm text-neutral-600 mt-1">{tr('Votre compte administrateur sur la plateforme', 'Your administrator account on the platform')}</p>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <div className="flex items-center gap-4 pb-5 border-b border-neutral-100 mb-5">
            <div className="w-12 h-12 rounded-[12px] bg-primary-50 text-primary-600 flex items-center justify-center text-lg font-bold">
              {user.userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-neutral-900">{user.userName}</p>
              <p className="text-sm text-neutral-600">{user.email}</p>
            </div>
            <Badge color="primary">
              <IoShieldCheckmarkOutline size={13} className="mr-1" />
              {user.role === 'ADMIN' ? tr('Administrateur', 'Administrator') : tr('Utilisateur', 'User')}
            </Badge>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label={tr('Nom d’utilisateur', 'Username')}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={tr('Votre nom', 'Your name')}
              leftIcon={<IoPersonOutline size={16} />}
            />
            <Input
              label={tr('Adresse email', 'Email address')}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@faucon.cm"
            />
            <Input
              label={tr('Téléphone', 'Phone')}
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+237XXXXXXXXX"
            />
            <Button loading={saving} onClick={saveProfile} className="self-start">
              {tr('Enregistrer le profil', 'Save profile')}
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <IoInformationCircleOutline size={18} className="text-primary-600" />
            {tr('Informations de session', 'Session information')}
          </h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">{tr('Compte créé le', 'Account created on')}</span>
              <span className="font-medium text-neutral-900">{formatDateTime(user.dateCreation)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">{tr('Rôle', 'Role')}</span>
              <Badge color="primary">{user.role}</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">{tr('Déconnexion', 'Sign out')}</h2>
              <p className="text-sm text-neutral-600 mt-0.5">
                {tr('Terminer la session et revenir à l’écran de connexion', 'End the session and return to the sign-in screen')}
              </p>
            </div>
            <Button variant="danger" loading={logoutLoading} onClick={handleLogout}>
              <IoLogOutOutline size={16} />
              {tr('Se déconnecter', 'Sign out')}
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
