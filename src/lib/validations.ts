import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string().email('Email invalide').required('Email requis'),
  password: Yup.string().min(6, 'Au moins 6 caractères').required('Mot de passe requis'),
});

export const createUserSchema = Yup.object({
  userName: Yup.string().min(2, 'Au moins 2 caractères').max(50).required("Nom d'utilisateur requis"),
  email: Yup.string().email('Email invalide').required('Email requis'),
  password: Yup.string().min(8, 'Au moins 8 caractères').required('Mot de passe requis'),
  role: Yup.string().oneOf(['UTILISATEUR', 'ADMIN']).required(),
});

export const provisionSchema = Yup.object({
  count: Yup.number().min(1, 'Minimum 1').max(500, 'Maximum 500').required('Nombre requis'),
  prefix: Yup.string()
    .matches(/^[A-Z0-9]{2,10}$/i, '2 à 10 caractères alphanumériques')
    .required('Préfixe requis'),
});

export const phoneAlerteSchema = Yup.object({
  telephone: Yup.string()
    .matches(/^\+[1-9]\d{7,14}$/, 'Format attendu : +237XXXXXXXXX')
    .required('Numéro requis'),
});
