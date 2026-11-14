import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin.api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { apiErrorMessage } from '../../utils/homePath';
import styles from '../admin/Admin.module.css';

function gb(bytes: number) {
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export const OrgAdmin = () => {
  const queryClient = useQueryClient();
  const org = useQuery({ queryKey: ['org', 'me'], queryFn: adminApi.myOrg });
  const lawyers = useQuery({ queryKey: ['org', 'lawyers'], queryFn: adminApi.listLawyers });

  const add = useMutation({
    mutationFn: adminApi.addLawyer,
    onSuccess: (result) => {
      toast.success(result.tempPassword ? `Lawyer added. Temporary password: ${result.tempPassword}` : 'Lawyer added.');
      queryClient.invalidateQueries({ queryKey: ['org', 'lawyers'] });
      queryClient.invalidateQueries({ queryKey: ['org', 'me'] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not add the lawyer.')),
  });

  const verify = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'verified' | 'rejected' }) => adminApi.verifyBarId(userId, status),
    onSuccess: () => {
      toast.success('Bar ID updated.');
      queryClient.invalidateQueries({ queryKey: ['org', 'lawyers'] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update Bar ID.')),
  });

  const reset = useMutation({
    mutationFn: adminApi.resetLawyerPassword,
    onSuccess: (result) => toast.success(result.tempPassword ? `Temporary password: ${result.tempPassword}` : result.message),
    onError: (error) => toast.error(apiErrorMessage(error, 'Password reset failed.')),
  });

  const remove = useMutation({
    mutationFn: adminApi.removeLawyer,
    onSuccess: () => {
      toast.success('Lawyer removed.');
      queryClient.invalidateQueries({ queryKey: ['org', 'lawyers'] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not remove the lawyer.')),
  });

  const rename = useMutation({
    mutationFn: ({ userId, name }: { userId: string; name: string }) => adminApi.updateLawyer(userId, { name }),
    onSuccess: () => {
      toast.success('Lawyer updated.');
      queryClient.invalidateQueries({ queryKey: ['org', 'lawyers'] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update the lawyer.')),
  });

  if (org.isLoading) return <Spinner />;

  return (
    <div className={styles.stack}>
      <div>
        <h1>{org.data?.name || 'Organization'}</h1>
        <p>Users {org.data?.userCount}/{org.data?.maxUsers} · Storage {gb(org.data?.usedStorageBytes || 0)} of {gb(org.data?.allocatedStorageBytes || 0)} · Forensic runs {org.data?.currentMonthForensicRuns}/{org.data?.monthlyForensicLimit}</p>
      </div>

      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          add.mutate({
            name: String(form.get('name') || ''),
            email: String(form.get('email') || ''),
            barId: String(form.get('barId') || ''),
            password: String(form.get('password') || '') || undefined,
          });
          event.currentTarget.reset();
        }}
      >
        <h2>Add lawyer</h2>
        <input name="name" placeholder="Full name" required />
        <input name="email" type="email" placeholder="Email" required />
        <input name="barId" placeholder="Bar ID" required />
        <input name="password" type="password" placeholder="Temporary password (optional)" />
        <Button type="submit" isLoading={add.isPending}>Register lawyer</Button>
      </form>

      {lawyers.isLoading ? <Spinner /> : (
        <table className={styles.table}>
          <thead><tr><th>Lawyer</th><th>Bar ID</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {(lawyers.data ?? []).filter((user) => user.role === 'lawyer').map((user) => (
              <tr key={user.id}>
                <td>{user.name}<div>{user.email}</div></td>
                <td>{user.barId}</td>
                <td><StatusBadge label={user.barIdStatus} tone={user.barIdStatus === 'verified' ? 'success' : user.barIdStatus === 'rejected' ? 'danger' : 'warning'} /></td>
                <td>
                  <Button type="button" size="sm" variant="secondary" onClick={() => verify.mutate({ userId: user.id, status: 'verified' })}>Verify</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => {
                    const name = window.prompt('Lawyer name', user.name);
                    if (name) rename.mutate({ userId: user.id, name });
                  }}>Rename</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => reset.mutate(user.id)}>Reset password</Button>
                  <Button type="button" size="sm" variant="danger" onClick={() => remove.mutate(user.id)}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
