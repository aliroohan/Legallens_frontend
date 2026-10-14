import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Folder,
  FileCheck2,
  Cpu,
  History,
  Upload,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { useCase } from '../../hooks/cases/useCase';
import { useUpdateCase } from '../../hooks/cases/useUpdateCase';
import styles from './CaseWorkspace.module.css';

type TabKey = 'overview' | 'evidence' | 'forensics' | 'history';

export const CaseWorkspace = () => {
  const { caseId = '' } = useParams();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const { data, isLoading } = useCase(caseId);
  const updateCase = useUpdateCase(caseId);

  const currentCase = data?.data;

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
        )}

        {activeTab === 'evidence' && (
          <div className={styles.emptyArea}>
            <Upload size={40} color="var(--sage-dark)" />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)' }}>
              Evidence File Vault
            </h3>
            <p style={{ maxWidth: '420px', fontSize: 'var(--text-sm)' }}>
              Upload photographic evidence, CCTV recordings, audio calls, or PDF documents to calculate cryptographic hashes and trigger AI forensics.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={<Upload size={16} />}
              onClick={() => alert('Evidence upload flow is scheduled in Phase 2!')}
            >
              Upload Evidence File
            </Button>
          </div>
        )}

        {activeTab === 'forensics' && (
          <div className={styles.emptyArea}>
            <Cpu size={40} color="var(--sage-dark)" />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)' }}>
              Forensic Analysis Dossiers
            </h3>
            <p style={{ maxWidth: '440px', fontSize: 'var(--text-sm)' }}>
              Run Error Level Analysis (ELA), EXIF metadata inspection, clone detection, and synthetic manipulation scoring.
            </p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => setActiveTab('evidence')}
            >
              Go to Evidence to Analyze Files
            </Button>
          </div>
        )}

        {activeTab === 'history' && (
          <div className={styles.infoCard}>
            <h3 className={styles.cardTitle}>
              <Clock size={18} color="var(--sage-dark)" /> Chronological Custody History
            </h3>
            <div className={styles.detailList}>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'flex-start' }}>
                <CheckCircle2 size={16} color="var(--status-success-text)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--fw-medium)' }}>
                    Case created and initialized
                  </p>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                    {new Date(currentCase.createdAt).toLocaleString()} • Chain of custody opened
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
