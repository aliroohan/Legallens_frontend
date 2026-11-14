import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../../api/audit.api';
import { Spinner } from '../../components/ui/Spinner';
import styles from './CaseWorkspace.module.css';

export const HistoryPanel = ({ caseId }: { caseId: string }) => {
  const history = useQuery({ queryKey: ['history', caseId], queryFn: () => auditApi.caseHistory(caseId) });

  if (history.isLoading) return <div className={styles.emptyArea}><Spinner /></div>;

  const entries = history.data ?? [];
  if (entries.length === 0) {
    return <div className={styles.emptyArea}><h3>No history yet</h3><p>Actions on this case will appear here.</p></div>;
  }

  return (
    <div className={styles.infoCard}>
      <div className={styles.detailList}>
        {entries.map((entry) => (
          <div key={entry.logId} className={styles.detailRow}>
            <div>
              <div className={styles.fileName}>{entry.action.replaceAll('_', ' ')}</div>
              <div className={styles.muted}>{entry.userEmail || 'System'}</div>
            </div>
            <span className={styles.muted}>{new Date(entry.timestamp).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
