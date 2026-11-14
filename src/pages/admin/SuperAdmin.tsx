import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminApi } from '../../api/admin.api';
import { auditApi } from '../../api/audit.api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { apiErrorMessage } from '../../utils/homePath';
import type { Organization } from '../../types';
import styles from './Admin.module.css';

type Tab = 'organizations' | 'storage' | 'bar' | 'quotas' | 'audit';

function gb(bytes: number) {
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export const SuperAdmin = () => {
  const [tab, setTab] = useState<Tab>('organizations');
  const queryClient = useQueryClient();

  const orgs = useQuery({ queryKey: ['admin', 'orgs'], queryFn: adminApi.listOrganizations });
  const storage = useQuery({ queryKey: ['admin', 'storage'], queryFn: adminApi.storageOverview, enabled: tab === 'storage' });
  const pending = useQuery({
    queryKey: ['admin', 'pending'],
    queryFn: () => adminApi.listUsers({ barIdStatus: 'pending' }),
    enabled: tab === 'bar',
  });
  const independents = useQuery({
    queryKey: ['admin', 'independents'],
    queryFn: () => adminApi.listUsers({ isIndependent: true }),
    enabled: tab === 'quotas',
  });
  const logs = useQuery({ queryKey: ['admin', 'audit'], queryFn: auditApi.platform, enabled: tab === 'audit' });

  const createOrg = useMutation({
    mutationFn: adminApi.createOrganization,
    onSuccess: (result) => {
      const password = result.adminCredentials?.tempPassword;
      toast.success(password ? `Organization created. Temporary password: ${password}` : 'Organization created and credentials emailed.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'orgs'] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not create the organization.')),
  });

  const updateOrg = useMutation({
    mutationFn: ({ orgId, payload }: { orgId: string; payload: Partial<Organization> }) => adminApi.updateOrganization(orgId, payload),
    onSuccess: () => {
      toast.success('Organization updated.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'orgs'] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Update failed.')),
  });

  const verify = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: 'verified' | 'rejected' }) => adminApi.verifyBarId(userId, status),
    onSuccess: () => {
      toast.success('Bar ID decision saved.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'pending'] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update Bar ID status.')),
  });

  const quotas = useMutation({
    mutationFn: ({ userId, monthlyForensicLimit, allocatedStorageBytes }: { userId: string; monthlyForensicLimit: number; allocatedStorageBytes: number }) =>
      adminApi.updateQuotas(userId, { monthlyForensicLimit, allocatedStorageBytes }),
    onSuccess: () => {
      toast.success('Quota updated.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'independents'] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update quotas.')),
  });

  return (
    <div className={styles.stack}>
      <div>
        <h1>Platform</h1>
        <p className={styles.form}>Organizations, storage, Bar ID review, and audit. Case files stay private to each firm.</p>
      </div>
      <div className={styles.tabs}>
        {(['organizations', 'storage', 'bar', 'quotas', 'audit'] as Tab[]).map((item) => (
          <Button key={item} type="button" size="sm" variant={tab === item ? 'primary' : 'secondary'} onClick={() => setTab(item)}>
            {item}
          </Button>
        ))}
      </div>

      {tab === 'organizations' && (
        <>
          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              createOrg.mutate({
                name: String(form.get('name') || ''),
                adminName: String(form.get('adminName') || ''),
                adminEmail: String(form.get('adminEmail') || ''),
                adminPassword: String(form.get('adminPassword') || ''),
                maxUsers: Number(form.get('maxUsers') || 5),
                monthlyForensicLimit: Number(form.get('monthlyForensicLimit') || 50),
              });
              event.currentTarget.reset();
            }}
          >
            <h2>Register organization</h2>
            <input name="name" placeholder="Firm name" required />
            <input name="adminName" placeholder="Admin name" required />
            <input name="adminEmail" type="email" placeholder="Admin email" required />
            <input name="adminPassword" type="password" placeholder="Temporary password" minLength={6} required />
            <input name="maxUsers" type="number" min={1} defaultValue={5} />
            <input name="monthlyForensicLimit" type="number" min={0} defaultValue={50} />
            <Button type="submit" isLoading={createOrg.isPending}>Create organization</Button>
          </form>
          {orgs.isLoading ? <Spinner /> : (
            <table className={styles.table}>
              <thead>
                <tr><th>Firm</th><th>Status</th><th>Users</th><th>Storage</th><th>Forensic runs</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {(orgs.data ?? []).map((org) => (
                  <tr key={org.orgId}>
                    <td>{org.name}<div>{org.adminEmail}</div></td>
                    <td><StatusBadge label={org.status} tone={org.status === 'active' ? 'success' : 'warning'} /></td>
                    <td>{org.userCount}/{org.maxUsers}</td>
                    <td>{gb(org.usedStorageBytes)} / {gb(org.allocatedStorageBytes)}</td>
                    <td>{org.currentMonthForensicRuns}/{org.monthlyForensicLimit}</td>
                    <td>
                      <Button type="button" size="sm" variant="secondary" onClick={() => updateOrg.mutate({ orgId: org.orgId, payload: { status: org.status === 'suspended' ? 'active' : 'suspended' } })}>
                        {org.status === 'suspended' ? 'Activate' : 'Suspend'}
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => updateOrg.mutate({ orgId: org.orgId, payload: { status: 'deactivated' } })}>Deactivate</Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => {
                        const maxUsers = Number(window.prompt('User limit', String(org.maxUsers)));
                        const monthlyForensicLimit = Number(window.prompt('Monthly forensic limit', String(org.monthlyForensicLimit)));
                        const gbValue = Number(window.prompt('Allocated storage (GB)', String(org.allocatedStorageBytes / (1024 ** 3))));
                        if (!Number.isFinite(maxUsers) || !Number.isFinite(monthlyForensicLimit) || !Number.isFinite(gbValue)) return;
                        updateOrg.mutate({
                          orgId: org.orgId,
                          payload: { maxUsers, monthlyForensicLimit, allocatedStorageBytes: Math.round(gbValue * 1024 ** 3) },
                        });
                      }}>Limits</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {tab === 'storage' && (
        storage.isLoading ? <Spinner /> : <pre>{JSON.stringify(storage.data, null, 2)}</pre>
      )}

      {tab === 'bar' && (
        pending.isLoading ? <Spinner /> : (
          <table className={styles.table}>
            <thead><tr><th>Lawyer</th><th>Bar ID</th><th>Decision</th></tr></thead>
            <tbody>
              {(pending.data ?? []).map((user) => (
                <tr key={user.id}>
                  <td>{user.name}<div>{user.email}</div></td>
                  <td>{user.barId}</td>
                  <td>
                    <Button type="button" size="sm" onClick={() => verify.mutate({ userId: user.id, status: 'verified' })}>Verify</Button>
                    <Button type="button" size="sm" variant="danger" onClick={() => verify.mutate({ userId: user.id, status: 'rejected' })}>Reject</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {tab === 'quotas' && (
        independents.isLoading ? <Spinner /> : (
          <table className={styles.table}>
            <thead><tr><th>Independent lawyer</th><th>Storage</th><th>Monthly runs</th><th></th></tr></thead>
            <tbody>
              {(independents.data ?? []).map((user) => (
                <tr key={user.id}>
                  <td>{user.name}<div>{user.email}</div></td>
                  <td>{gb(user.usedStorageBytes || 0)} / {gb(user.allocatedStorageBytes || 0)}</td>
                  <td>{user.currentMonthForensicRuns || 0}/{user.monthlyForensicLimit || 0}</td>
                  <td>
                    <Button type="button" size="sm" variant="secondary" onClick={() => {
                      const monthlyForensicLimit = Number(window.prompt('Monthly forensic limit', String(user.monthlyForensicLimit || 15)));
                      const gbValue = Number(window.prompt('Allocated storage (GB)', String((user.allocatedStorageBytes || 0) / (1024 ** 3))));
                      if (!Number.isFinite(monthlyForensicLimit) || !Number.isFinite(gbValue)) return;
                      quotas.mutate({ userId: user.id, monthlyForensicLimit, allocatedStorageBytes: Math.round(gbValue * 1024 ** 3) });
                    }}>Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {tab === 'audit' && (
        logs.isLoading ? <Spinner /> : (
          <table className={styles.table}>
            <thead><tr><th>When</th><th>Action</th><th>Actor</th></tr></thead>
            <tbody>
              {(logs.data ?? []).map((log) => (
                <tr key={log.logId}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.action}</td>
                  <td>{log.userEmail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};
