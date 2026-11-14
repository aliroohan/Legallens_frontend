import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Folder,
  FileCheck2,
  Cpu,
  History,
  Upload,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { useCase } from '../../hooks/cases/useCase';
import { useUpdateCase } from '../../hooks/cases/useUpdateCase';
import { casesApi } from '../../api/cases.api';
import { apiErrorMessage } from '../../utils/homePath';
import { EvidencePanel } from './EvidencePanel';
import { ForensicsPanel } from './ForensicsPanel';
import { HistoryPanel } from './HistoryPanel';
import type { MatterType } from '../../types';
import styles from './CaseWorkspace.module.css';

type TabKey = 'overview' | 'evidence' | 'forensics' | 'history';

const matterTypes: MatterType[] = ['Litigation', 'Insurance Claim', 'Criminal Defense', 'IP Dispute', 'Other'];

export const CaseWorkspace = () => {
  const { caseId = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [editing, setEditing] = useState(false);
  const [confirmName, setConfirmName] = useState('');

  const { data, isLoading } = useCase(caseId);
  const updateCase = useUpdateCase(caseId);
  const currentCase = data?.data;

  const removeCase = useMutation({
    mutationFn: () => casesApi.deleteCase(caseId, confirmName),
    onSuccess: () => {
      toast.success('Closed case deleted.');
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      navigate('/cases');
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Deletion was not confirmed.')),
  });

  const handleToggleStatus = () => {
    if (!currentCase) return;
    const nextStatus = currentCase.status === 'Open' ? 'Closed' : 'Open';
    updateCase.mutate({ status: nextStatus });
  };

  if (isLoading) {
    return (
      <div style={{ padding: 'var(--space-12)', textAlign: 'center' }}>
        <Spinner size="lg" />
        <p style={{ marginTop: 'var(--space-4)', color: 'var(--text-secondary)' }}>
          Loading case workspace...
        </p>
      </div>
    );
  }

  if (!currentCase) {
    return (
      <div className={styles.emptyArea}>
        <Folder size={48} color="var(--sage-mid)" />
        <h2>Case Not Found</h2>
        <p>The requested case file does not exist or you do not have permission to access it.</p>
        <Link to="/cases" style={{ textDecoration: 'none' }}>
          <Button variant="primary" size="md">
            Return to Cases
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link to="/cases" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Cases
      </Link>

      {/* Case Header Card */}
      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <div className={styles.titleArea}>
            <div className={styles.caseMetaRow}>
              <span className={styles.caseNumber}>
                {currentCase.caseNumber || currentCase.id.slice(0, 8)}
              </span>
              <span>•</span>
              <span>{currentCase.matterType}</span>
              <span>•</span>
              <StatusBadge
                label={currentCase.status}
                tone={currentCase.status === 'Open' ? 'success' : 'neutral'}
              />
            </div>
            <h1 className={styles.title}>{currentCase.title}</h1>
          </div>

          <div className={styles.headerActions}>
            <Button variant="secondary" size="sm" onClick={() => setEditing((value) => !value)}>
              {editing ? 'Hide edit' : 'Edit details'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleStatus}
              isLoading={updateCase.isPending}
            >
              {currentCase.status === 'Open' ? 'Close Case' : 'Reopen Case'}
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Upload size={14} />}
              onClick={() => setActiveTab('evidence')}
            >
              Upload Evidence
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabBar} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Folder size={16} /> Overview
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'evidence'}
            className={`${styles.tab} ${activeTab === 'evidence' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('evidence')}
          >
            <FileCheck2 size={16} /> Evidence Files
            <span className={styles.tabBadge}>{currentCase.fileCount ?? 0}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'forensics'}
            className={`${styles.tab} ${activeTab === 'forensics' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('forensics')}
          >
            <Cpu size={16} /> Forensic Reports
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'history'}
            className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History size={16} /> Case History
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className={styles.tabContent}>
        {activeTab === 'overview' && (
          <div className={styles.tabContent}>
          {editing && (
            <form
              className={styles.infoCard}
              onSubmit={(event) => {
                event.preventDefault();
                const form = new FormData(event.currentTarget);
                updateCase.mutate({
                  title: String(form.get('title') || ''),
                  clientName: String(form.get('clientName') || ''),
                  matterType: String(form.get('matterType') || 'Other') as MatterType,
                  description: String(form.get('description') || ''),
                });
              }}
            >
              <h3 className={styles.cardTitle}>Edit case</h3>
              <div className={styles.formGrid}>
                <input name="title" defaultValue={currentCase.title} required maxLength={120} />
                <input name="clientName" defaultValue={currentCase.clientName} required />
                <select name="matterType" defaultValue={currentCase.matterType}>
                  {matterTypes.map((type) => <option key={type}>{type}</option>)}
                </select>
                <textarea name="description" defaultValue={currentCase.description || ''} maxLength={1000} rows={4} />
                <Button type="submit" size="sm" isLoading={updateCase.isPending}>Save changes</Button>
              </div>
            </form>
          )}
          <div className={styles.grid2}>
            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>
                <FileText size={18} color="var(--sage-dark)" /> Description & Matter Notes
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--lh-relaxed)' }}>
                {currentCase.description || 'No descriptive notes added for this case matter yet.'}
              </p>

              <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--sage-light)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--fw-semibold)', color: 'var(--sage-dark)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Chain of Custody Status
                </span>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Cryptographic verification enabled. All evidence files uploaded to this case matter receive immutable SHA-256 signatures and timestamped audit logs.
                </p>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3 className={styles.cardTitle}>
                <ShieldCheck size={18} color="var(--sage-dark)" /> Case Metadata
              </h3>
              <div className={styles.detailList}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Client Name</span>
                  <span className={styles.detailValue}>{currentCase.clientName}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Opposing Party</span>
                  <span className={styles.detailValue}>
                    {currentCase.opposingParty || 'None specified'}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Matter Category</span>
                  <span className={styles.detailValue}>{currentCase.matterType}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Files Stored</span>
                  <span className={styles.detailValue}>{currentCase.fileCount ?? 0}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Created Date</span>
                  <span className={styles.detailValue}>
                    {new Date(currentCase.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {currentCase.status === 'Closed' && (
            <form
              className={styles.infoCard}
              onSubmit={(event) => {
                event.preventDefault();
                removeCase.mutate();
              }}
            >
              <h3 className={styles.cardTitle}>Delete closed case</h3>
              <p className={styles.muted}>Type the exact case name to confirm deletion.</p>
              <input value={confirmName} onChange={(event) => setConfirmName(event.target.value)} placeholder={currentCase.title} />
              <Button type="submit" variant="danger" size="sm" isLoading={removeCase.isPending}>Delete case</Button>
            </form>
          )}
          </div>
        )}

        {activeTab === 'evidence' && <EvidencePanel caseId={caseId} closed={currentCase.status === 'Closed'} />}
        {activeTab === 'forensics' && <ForensicsPanel caseId={caseId} />}
        {activeTab === 'history' && <HistoryPanel caseId={caseId} />}
      </div>
    </div>
  );
};
