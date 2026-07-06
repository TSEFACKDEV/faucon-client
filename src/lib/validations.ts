import * as Yup from 'yup';

export const loginSchema = Yup.object({
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(6, 'Au moins 6 caractères')
    .required('Mot de passe requis'),
  deviceId: Yup.string()
    .required('ID dispositif requis'),
});

export const registerSchema = Yup.object({
  userName: Yup.string()
    .min(3, 'Au moins 3 caractères')
    .required('Nom requis'),
  email: Yup.string()
    .email('Email invalide')
    .required('Email requis'),
  password: Yup.string()
    .min(6, 'Au moins 6 caractères')
    .required('Mot de passe requis'),
});

export const addDeviceSchema = Yup.object({
  imei: Yup.string()
    .matches(/^\d{15}$/, 'IMEI : exactement 15 chiffres')
    .required('IMEI requis'),
  nom: Yup.string()
    .min(2, 'Au moins 2 caractères')
    .max(50, 'Maximum 50 caractères')
    .required('Nom requis'),
});

export const profileSchema = Yup.object({
  userName: Yup.string().min(2, 'Au moins 2 caractères').required('Nom requis'),
  email: Yup.string().email('Email invalide').required('Email requis'),
  telephone: Yup.string().optional(),
});

export const speedLimitSchema = Yup.object({
  seuilKmh: Yup.number()
    .min(10, 'Minimum 10 km/h')
    .max(250, 'Maximum 250 km/h')
    .required('Seuil requis'),
});

export const geofenceSchema = Yup.object({
  nom: Yup.string().required('Nom requis'),
  centreLat: Yup.number().required('Latitude requise'),
  centreLon: Yup.number().required('Longitude requise'),
  rayonMetres: Yup.number()
    .min(50, 'Minimum 50 m')
    .max(50000, 'Maximum 50 km')
    .required('Rayon requis'),
});