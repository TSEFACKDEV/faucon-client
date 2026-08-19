'use client';
import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import {
  IoPeopleOutline, IoAddOutline, IoTrashOutline, IoEyeOutline, IoSearchOutline,
} from 'react-icons/io5';
import { adminService } from '@/services/admin.service';
import { useAuthStore } from '@/store/auth.store';
import { UtilisateurResume, UtilisateurDetail, Role } from '@/types';
import { createUserSchema } from '@/lib/validations';
import { formatDate } from '@/lib/utils';
import { getErrorMessage } from '@/lib/errors';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function UtilisateursPage() {
  const { user: currentUser } = useAuthStore();
  const [utilisateurs, setUtilisateurs] = useState<UtilisateurResume[]>([]);
  const [detail, setDetail] = useState<UtilisateurDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<UtilisateurResume | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [roleSaving, setRoleSaving] = useState<string | null>(null);
  // Changement de rôle demandé mais pas encore confirmé — un changement de
  // droits ADMIN/UTILISATEUR est sensible (accès complet à la plateforme),
  // il ne doit pas partir d'un simple clic accidentel sur le menu déroulant.
  const [roleChange, setRoleChange] = useState<{ user: UtilisateurResume; role: Role } | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    try {
      setUtilisateurs(await adminService.getUtilisateurs());
    } catch (err) {
      console.error('[Utilisateurs]', err);
      toast.error(getErrorMessage(err, 'Impossible de charger la liste des utilisateurs. Réessayez dans un instant.'));
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

  const handleRoleChange = async (u: UtilisateurResume, role: Role) => {
    setRoleSaving(u.id);
    try {
      await adminService.setRole(u.id, role);
      setUtilisateurs((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
      toast.success('Rôle mis à jour');
    } catch (err) {
      console.error('[setRole]', err);
      toast.error(getErrorMessage(err, 'Impossible de changer le rôle de cet utilisateur. Réessayez dans un instant.'));
    } finally {
      setRoleSaving(null);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await adminService.supprimerUtilisateur(toDelete.id);
      setUtilisateurs((prev) => prev.filter((x) => x.id !== toDelete.id));
      setToDelete(null);
      toast.success('Utilisateur supprimé');
    } catch (err) {
      console.error('[supprimerUtilisateur]', err);
      toast.error(getErrorMessage(err, 'Impossible de supprimer cet utilisateur. Réessayez dans un instant.'));
    } finally {
      setDeleting(false);
    }
  };

  const openDetail = async (id: string) => {
    try {
      setDetail(await adminService.getUtilisateurById(id));
    } catch (err) {
      console.error('[detail]', err);
      toast.error(getErrorMessage(err, 'Impossible de charger le détail de cet utilisateur. Réessayez dans un instant.'));
    }
  };

  const filtered = utilisateurs.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      u.userName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.telephone ?? '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-8 flex flex-col gap-6">
      <motion.div variants={item} className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Utilisateurs</h1>
          <p className="text-sm text-neutral-600 mt-1">
            {utilisateurs.length} compte(s) enregistré(s) sur la plateforme
          </p>
        </div>
        <Button variant="primary" onClick={() => setCreating(true)}>
          <IoAddOutline size={18} />
          Créer un utilisateur
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <Card padding={false}>
          <div className="px-6 pt-5 pb-4 border-b border-neutral-100 flex items-center justify-between gap-4">
            <div className="relative w-full max-w-sm">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, email, téléphone…"
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-[10px] text-sm focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-10 text-center text-neutral-500 text-sm">
              Aucun utilisateur ne correspond à votre recherche.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                    <th className="px-6 py-3 font-semibold">Utilisateur</th>
                    <th className="px-6 py-3 font-semibold">Téléphone</th>
                    <th className="px-6 py-3 font-semibold">Rôle</th>
                    <th className="px-6 py-3 font-semibold text-center">Traceurs</th>
                    <th className="px-6 py-3 font-semibold">Inscription</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-neutral-50 hover:bg-neutral-0/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-neutral-900">{u.userName}</p>
                        <p className="text-xs text-neutral-500">{u.email}</p>
                      </td>
                      <td className="px-6 py-3.5 text-neutral-600">{u.telephone ?? '—'}</td>
                      <td className="px-6 py-3.5">
                        {roleSaving === u.id ? (
                          <span className="text-xs text-neutral-500">Enregistrement…</span>
                        ) : u.id === currentUser?.id ? (
                          <span
                            className="rounded-full text-xs font-semibold px-3 py-1 bg-primary-50 text-primary-600 border border-primary-200 cursor-not-allowed"
                            title="Vous ne pouvez pas changer votre propre rôle"
                          >
                            Admin (vous)
                          </span>
                        ) : (
                          <select
                            value={u.role}
                            onChange={(e) => setRoleChange({ user: u, role: e.target.value as Role })}
                            className={`
                              rounded-full text-xs font-semibold px-3 py-1 cursor-pointer border focus:outline-none
                              ${u.role === 'ADMIN'
                                ? 'bg-primary-50 text-primary-600 border-primary-200'
                                : 'bg-neutral-50 text-neutral-700 border-neutral-200'}
                            `}
                          >
                            <option value="UTILISATEUR">Utilisateur</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-center">
                        <Badge color={u.nbVehicules > 0 ? 'primary' : 'neutral'}>{u.nbVehicules}</Badge>
                      </td>
                      <td className="px-6 py-3.5 text-neutral-600">{formatDate(u.dateCreation)}</td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openDetail(u.id)}
                            className="p-2 rounded-lg text-neutral-500 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="Voir le détail"
                          >
                            <IoEyeOutline size={17} />
                          </button>
                          <button
                            onClick={() => u.role !== 'ADMIN' && setToDelete(u)}
                            disabled={u.role === 'ADMIN'}
                            className="p-2 rounded-lg text-neutral-500 hover:text-danger-strong hover:bg-danger-tint disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-500 disabled:cursor-not-allowed transition-colors"
                            title={u.role === 'ADMIN' ? 'Un compte administrateur ne peut pas être supprimé' : 'Supprimer'}
                          >
                            <IoTrashOutline size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>

      {/* ── Créer un utilisateur ── */}
      <Modal open={creating} onClose={() => setCreating(false)} title="Créer un utilisateur" subtitle="Le compte pourra se connecter à l'app mobile">
        <Formik
          initialValues={{ userName: '', email: '', password: '', role: 'UTILISATEUR' as Role }}
          validationSchema={createUserSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await adminService.creerUtilisateur(values.userName, values.email, values.password, values.role);
              toast.success('Utilisateur créé');
              resetForm();
              setCreating(false);
              load();
            } catch (err: unknown) {
              toast.error(getErrorMessage(err, 'Impossible de créer cet utilisateur. Vérifiez les informations saisies, puis réessayez.'));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <Input
                label="Nom d'utilisateur"
                name="userName"
                value={values.userName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.userName ? errors.userName : undefined}
                placeholder="Ex : Jean Kouamé"
                required
              />
              <Input
                label="Adresse email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
                placeholder="exemple@faucon.cm"
                required
              />
              <Input
                label="Mot de passe"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : undefined}
                placeholder="8 caractères minimum"
                required
              />
              <Select
                label="Rôle"
                name="role"
                value={values.role}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="UTILISATEUR">Utilisateur</option>
                <option value="ADMIN">Administrateur</option>
              </Select>
              <Button type="submit" loading={isSubmitting} fullWidth className="mt-1">
                Créer le compte
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* ── Détail utilisateur ── */}
      <Modal
        open={!!detail}
        onClose={() => setDetail(null)}
        title={detail?.userName ?? ''}
        subtitle={detail?.email}
        wide
      >
        {detail && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <Badge color={detail.role === 'ADMIN' ? 'primary' : 'neutral'}>
                {detail.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}
              </Badge>
              <span className="text-xs text-neutral-600">
                Inscrit le {formatDate(detail.dateCreation)}
                {detail.derniereConnexion ? ` · dernière connexion ${formatDate(detail.derniereConnexion)}` : ''}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                <IoPeopleOutline size={16} className="text-primary-600" />
                Traceurs rattachés ({detail.vehicules.length})
              </h3>
              {detail.vehicules.length === 0 ? (
                <p className="text-sm text-neutral-500 bg-neutral-50 rounded-[10px] p-4">
                  Aucun traceur rattaché à ce compte.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {detail.vehicules.map((v) => (
                    <div key={v.id} className="flex items-center justify-between bg-neutral-0 rounded-[10px] border border-neutral-100 px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-neutral-900">{v.nom}</p>
                        <p className="text-xs text-neutral-500 font-mono">
                          {v.trackerId ?? v.imei ?? 'Sans identifiant'}
                        </p>
                      </div>
                      <Badge color="neutral">{v.id.slice(0, 8)}</Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ── Confirmation changement de rôle ── */}
      <Modal
        open={!!roleChange}
        onClose={() => setRoleChange(null)}
        title="Changer le rôle de cet utilisateur ?"
        subtitle={roleChange?.user.userName}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600">
            {roleChange?.user.userName} passera du rôle{' '}
            <strong>{roleChange?.user.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}</strong> à{' '}
            <strong>{roleChange?.role === 'ADMIN' ? 'Administrateur' : 'Utilisateur'}</strong>.
            {roleChange?.role === 'ADMIN' && ' Il aura alors accès à ce tableau de bord et à toutes les données de la plateforme.'}
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setRoleChange(null)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              fullWidth
              loading={!!roleChange && roleSaving === roleChange.user.id}
              onClick={async () => {
                if (!roleChange) return;
                const { user, role } = roleChange;
                setRoleChange(null);
                await handleRoleChange(user, role);
              }}
            >
              Confirmer
            </Button>
          </div>
        </div>
      </Modal>

      {/* ── Confirmation suppression ── */}
      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Supprimer cet utilisateur ?"
        subtitle={toDelete?.userName}
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-neutral-600">
            Cette action est irréversible : le compte et tous ses traceurs rattachés seront supprimés.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" fullWidth onClick={() => setToDelete(null)}>
              Annuler
            </Button>
            <Button variant="danger" fullWidth loading={deleting} onClick={handleDelete}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}
