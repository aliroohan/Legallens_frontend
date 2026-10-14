import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderPlus } from 'lucide-react';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';
import { useCreateCase } from '../../hooks/cases/useCreateCase';
import type { MatterType } from '../../types';
import styles from './CreateCase.module.css';

const matterTypes: MatterType[] = [
  'Litigation',
  'Insurance Claim',
  'Criminal Defense',
  'IP Dispute',
  'Other',
];

const createCaseSchema = z.object({
  title: z.string().min(3, 'Case title must be at least 3 characters'),
  clientName: z.string().min(2, 'Client name is required'),
  opposingParty: z.string().optional(),
  matterType: z.enum(
    ['Litigation', 'Insurance Claim', 'Criminal Defense', 'IP Dispute', 'Other'] as const,
    { message: 'Please select a matter type' }
  ),
  description: z.string().optional(),
});

type CreateCaseFormData = z.infer<typeof createCaseSchema>;

export const CreateCase = () => {
  const navigate = useNavigate();
  const createCaseMutation = useCreateCase();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCaseFormData>({
    resolver: zodResolver(createCaseSchema),
    defaultValues: {
      matterType: 'Litigation',
    },
  });

  const onSubmit = (data: CreateCaseFormData) => {
    createCaseMutation.mutate(data);
  };

  return (
    <div className={styles.container}>
      <Link to="/cases" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Cases
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>Create New Case</h1>
        <p className={styles.subtitle}>
          Open a new forensic case file and initialize secure chain of custody
        </p>
      </div>

      <div className={styles.formCard}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <InputField
            id="case-title"
            label="Case Title"
            placeholder="e.g. State v. Henderson / Insurance Loss Audit"
            hint="A clear, distinctive title for identifying this matter"
            error={errors.title?.message}
            {...register('title')}
          />

          <div className={styles.row}>
            <InputField
              id="client-name"
              label="Client Name"
              placeholder="e.g. Acme Corporation or Jane Doe"
              error={errors.clientName?.message}
              {...register('clientName')}
            />

            <InputField
              id="opposing-party"
              label="Opposing Party (Optional)"
              placeholder="e.g. John Doe / Global Logistics"
              error={errors.opposingParty?.message}
              {...register('opposingParty')}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="matter-type" className={styles.label}>
              Matter Type <span className={styles.required}>*</span>
            </label>
            <select
              id="matter-type"
              className={styles.select}
              {...register('matterType')}
            >
              {matterTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.matterType && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--status-danger-text)' }}>
                {errors.matterType.message}
              </span>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="case-description" className={styles.label}>
              Case Description & Context (Optional)
            </label>
            <textarea
              id="case-description"
              className={styles.textarea}
              placeholder="Provide background information, key allegations, or instructions for forensic examination..."
              {...register('description')}
            />
          </div>

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => navigate('/cases')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<FolderPlus size={16} />}
              isLoading={createCaseMutation.isPending}
            >
              Initialize Case File
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
