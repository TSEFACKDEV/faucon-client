'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import {
  IoKeyOutline, IoHardwareChipOutline, IoCopyOutline, IoDownloadOutline,
  IoCheckmarkCircleOutline, IoInformationCircleOutline,
} from 'react-icons/io5';
import { adminService } from '@/services/admin.service';
import { VehiculeProvisionne } from '@/types';
import { getProvisionSchema } from '@/lib/validations';
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

export default function ProvisionnerPage() {
  const { tr, language } = useLanguage();
  const [provisioned, setProvisioned] = useState<VehiculeProvisionne[]>([]);
  const [batchId, setBatchId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (value: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(value);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 1500);
      }
      toast.success(tr('Copié', 'Copied'));
    } catch {
      toast.error(tr('Impossible de copier dans le presse-papiers. Vérifiez les autorisations du navigateur.', 'Unable to copy to the clipboard. Check browser permissions.'));
    }
  };

  const downloadCsv = () => {
    if (provisioned.length === 0) return;
    const header = 'trackerId,pinActivation\n';
    const rows = provisioned.map((p) => `${p.trackerId},${p.pinActivation}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `provision_faucon_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="p-8 flex flex-col gap-6 max-w-3xl">
      <motion.div variants={item}>
        <h1 className="text-2xl font-semibold text-neutral-900">{tr('Provisionner des traceurs', 'Provision trackers')}</h1>
        <p className="text-sm text-neutral-600 mt-1">
          {tr('Génère en série des identifiants de traceurs (tracker ID + pin d’activation)', 'Generates tracker identifiers in batches (tracker ID + activation PIN)')}
        </p>
      </motion.div>

      <motion.div variants={item}>
        <Card>
          <div className="flex items-start gap-3 bg-primary-50 border border-primary-200 rounded-[10px] p-4 mb-6">
            <IoInformationCircleOutline size={20} className="text-primary-600 shrink-0 mt-0.5" />
            <p className="text-sm text-primary-700">
              {tr('Outil interne d’exploitation : la clé de provisioning est fournie par l’équipe, elle n’est jamais stockée. Maximum', 'Internal operations tool: the provisioning key is provided by the team and is never stored. Maximum')} <strong>500</strong> {tr('traceurs par lot.', 'trackers per batch.')}
            </p>
          </div>

          <Formik
            initialValues={{ count: 10, prefix: 'FCN', apiKey: '' }}
            validationSchema={getProvisionSchema(language)}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const result = await adminService.provisionner(values.count, values.prefix, values.apiKey || undefined);
                setProvisioned(result);
                setBatchId(Date.now());
                setCopiedId(null);
                toast.success(`${result.length} ${tr('traceur(s) provisionné(s)', 'tracker(s) provisioned')}`);
              } catch (err: unknown) {
                toast.error(getErrorMessage(err, tr('Échec du provisioning. Vérifiez la clé et le nombre demandé, puis réessayez.', 'Provisioning failed. Check the key and requested count, then try again.')));
                setProvisioned([]);
                setBatchId(null);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label={tr('Clé de provisioning', 'Provisioning key')}
                    name="apiKey"
                    type="password"
                    autoComplete="off"
                    value={values.apiKey}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={tr('Saisissez la clé API', 'Enter the API key')}
                    rightIcon={<IoKeyOutline size={16} className="text-neutral-400" />}
                  />
                  <Input
                    label={tr('Nombre de traceurs', 'Number of trackers')}
                    name="count"
                    type="number"
                    min={1}
                    max={500}
                    value={values.count}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.count ? errors.count : undefined}
                    rightIcon={<IoHardwareChipOutline size={16} className="text-neutral-400" />}
                  />
                </div>
                <Input
                  label={tr('Préfixe du tracker ID', 'Tracker ID prefix')}
                  name="prefix"
                  value={values.prefix}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.prefix ? errors.prefix : undefined}
                  placeholder={tr('Ex : FCN', 'E.g. FCN')}
                />
                <Button type="submit" loading={isSubmitting} className="mt-1 self-start">
                  <IoHardwareChipOutline size={16} />
                  {tr('Provisionner', 'Provision')}
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </motion.div>

      {provisioned.length > 0 && (
        <motion.div variants={item}>
          <Card padding={false}>
            <div className="px-6 pt-5 pb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold text-neutral-900">{tr('Lot généré', 'Generated batch')}</h2>
                <Badge color="success">
                  <IoCheckmarkCircleOutline size={13} className="mr-1" />
                  {provisioned.length} {tr('traceur(s)', 'tracker(s)')}
                </Badge>
                {batchId && <span className="text-xs text-neutral-500">{tr('Lot', 'Batch')} #{batchId}</span>}
              </div>
              <Button variant="secondary" size="sm" onClick={downloadCsv}>
                <IoDownloadOutline size={15} />
                {tr('Export CSV', 'Export CSV')}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                    <th className="px-6 py-3 font-semibold">#</th>
                    <th className="px-6 py-3 font-semibold">Tracker ID</th>
                    <th className="px-6 py-3 font-semibold">{tr('Pin d’activation', 'Activation PIN')}</th>
                    <th className="px-6 py-3 font-semibold text-right">{tr('Copier', 'Copy')}</th>
                  </tr>
                </thead>
                <tbody>
                  {provisioned.map((p, i) => (
                    <tr key={`${batchId}-${i}`} className="border-b border-neutral-50 hover:bg-neutral-0/50">
                      <td className="px-6 py-3 text-neutral-500">{i + 1}</td>
                      <td className="px-6 py-3 font-mono font-semibold text-neutral-900">{p.trackerId}</td>
                      <td className="px-6 py-3">
                        <button
                          className="font-mono text-primary-600 hover:underline"
                          onClick={() => copy(p.pinActivation, `${batchId}-${i}`)}
                        >
                          {p.pinActivation}
                        </button>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copy(`${p.trackerId},${p.pinActivation}`, `${batchId}-${i}`)}
                        >
                          {copiedId === `${batchId}-${i}` ? (
                            <IoCheckmarkCircleOutline size={15} className="text-success-strong" />
                          ) : (
                            <IoCopyOutline size={15} />
                          )}
                          {tr('Copier', 'Copy')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
