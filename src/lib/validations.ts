import * as Yup from 'yup';

type Lang = 'fr' | 'en';
const m = (lang: Lang, fr: string, en: string) => (lang === 'en' ? en : fr);

export const getLoginSchema = (lang: Lang = 'fr') => Yup.object({
  email: Yup.string().email(m(lang, 'Email invalide', 'Invalid email')).required(m(lang, 'Email requis', 'Email required')),
  password: Yup.string().min(6, m(lang, 'Au moins 6 caractères', 'At least 6 characters')).required(m(lang, 'Mot de passe requis', 'Password required')),
});

export const getCreateUserSchema = (lang: Lang = 'fr') => Yup.object({
  userName: Yup.string()
    .min(2, m(lang, 'Au moins 2 caractères', 'At least 2 characters'))
    .max(50)
    .required(m(lang, "Nom d'utilisateur requis", 'Username required')),
  email: Yup.string().email(m(lang, 'Email invalide', 'Invalid email')).required(m(lang, 'Email requis', 'Email required')),
  password: Yup.string().min(8, m(lang, 'Au moins 8 caractères', 'At least 8 characters')).required(m(lang, 'Mot de passe requis', 'Password required')),
  role: Yup.string().oneOf(['UTILISATEUR', 'ADMIN']).required(),
});

export const getProvisionSchema = (lang: Lang = 'fr') => Yup.object({
  count: Yup.number()
    .min(1, m(lang, 'Minimum 1', 'Minimum 1'))
    .max(500, m(lang, 'Maximum 500', 'Maximum 500'))
    .required(m(lang, 'Nombre requis', 'Number required')),
  prefix: Yup.string()
    .matches(/^[A-Z0-9]{2,10}$/i, m(lang, '2 à 10 caractères alphanumériques', '2 to 10 alphanumeric characters'))
    .required(m(lang, 'Préfixe requis', 'Prefix required')),
});
