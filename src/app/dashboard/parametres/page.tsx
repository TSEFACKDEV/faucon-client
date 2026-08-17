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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ParametresPage() {
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
      toast.error(getErrorMessage(err, 'Impossible de charger votre profil. Réessayez dans un instant.'));
    } finally {
      setLoading(false);
    }
  }, []);

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
      toast.success('Profil mis à jour');
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Impossible de mettre à jour votre profil. Réessayez dans un instant.'));
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
    return <div className="p-8 text-neutral-600">Impossible de charger le profil.</div>;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-8 flex flex-col gap-6 max-w-2xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold text-neutral-900">Paramètres</h1>
        <p className="text-sm text-neutral-600 mt-1">Votre compte administrateur sur la plateforme</p>
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
              {user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
            </Badge>
          </div>

          <div className="flex flex-col gap-4">
            <Input
              label="Nom d'utilisateur"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Votre nom"
              leftIcon={<IoPersonOutline size={16} />}
            />
            <Input
              label="Adresse email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemple@faucon.cm"
            />
            <Input
              label="Téléphone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="+237XXXXXXXXX"
            />
            <Button loading={saving} onClick={saveProfile} className="self-start">
              Enregistrer le profil
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <h2 className="text-base font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <IoInformationCircleOutline size={18} className="text-primary-600" />
            Informations de session
          </h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Compte créé le</span>
              <span className="font-medium text-neutral-900">{formatDateTime(user.dateCreation)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Rôle</span>
              <Badge color="primary">{user.role}</Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">Déconnexion</h2>
              <p className="text-sm text-neutral-600 mt-0.5">
                Terminer la session et revenir à l&apos;écran de connexion
              </p>
            </div>
            <Button variant="danger" loading={logoutLoading} onClick={handleLogout}>
              <IoLogOutOutline size={16} />
              Se déconnecter
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
