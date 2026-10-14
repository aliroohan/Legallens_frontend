import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Briefcase,
  FileCheck2,
  Cpu,
  Database,
  ArrowRight,
  FolderOpen,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { useAuthStore } from '../../store/authStore';
import { useCases } from '../../hooks/cases/useCases';
import styles from './Dashboard.module.css';

import type { Case } from '../../types';

export const Dashboard = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Time-aware greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'Counsel';

  // Fetch recent cases and open cases count
  const { data: casesData, isLoading } = useCases({ limit: 5, sort: '-updatedAt' });
  const { data: openCasesData } = useCases({ status: 'Open' });

  const cases: Case[] = casesData?.data?.items || casesData?.data?.data || [];
  const totalOpen = openCasesData?.data?.total ?? cases.filter((c: Case) => c.status === 'Open').length;
  const totalEvidence = cases.reduce((acc: number, c: Case) => acc + (c.fileCount || 0), 0);

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <div className={styles.topRow}>
        <div className={styles.breadcrumb}>
          <span>Lawyer</span>
          <span>/</span>
          <span>{greeting}, {firstName}</span>
        </div>
        <div className={styles.headerRow}>
          <h1 className={styles.title}>My Dashboard</h1>
          <Button
            variant="primary"
            size="md"
            icon={<Plus size={16} />}
            onClick={() => navigate('/cases/new')}
          >
            New Case
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Active Open Cases</span>
            <div className={styles.metricIcon}>
              <Briefcase size={18} />
            </div>
          </div>
          <span className={styles.metricValue}>{totalOpen}</span>
          <span className={styles.metricMeta}>Ready for examination</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Evidence Files</span>
            <div className={styles.metricIcon}>
              <FileCheck2 size={18} />
            </div>
          </div>
          <span className={styles.metricValue}>{totalEvidence}</span>
          <span className={styles.metricMeta}>SHA-256 Verified hashes</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Forensic Analyses</span>
            <div className={styles.metricIcon}>
              <Cpu size={18} />
            </div>
          </div>
          <span className={styles.metricValue}>12</span>
          <span className={styles.metricMeta}>Completed this month</span>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <span className={styles.metricTitle}>Chain of Custody</span>
            <div className={styles.metricIcon}>
              <Database size={18} />
            </div>
          </div>
          <span className={styles.metricValue}>100%</span>
          <span className={styles.metricMeta}>Tamper-evident logs</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className={styles.banner}>
        <div className={styles.bannerContent}>
          <span className={styles.bannerTag}>DIGITAL EVIDENCE INTEGRITY</span>
          <h2 className={styles.bannerHeading}>Examine. Analyze. Uncover.</h2>
          <p className={styles.bannerDesc}>
            Verify file tamper history, detect synthetic alterations using deep neural analysis, and export court-admissible forensic audit dossiers in seconds.
          </p>
          <div className={styles.bannerActions}>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/cases/new')}
            >
              Start New Matter
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/cases')}
            >
              Browse All Cases
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Cases Section */}
      <div>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent Cases</h3>
          <Link to="/cases" className={styles.viewAllLink}>
            View all cases <ArrowRight size={14} />
          </Link>
        </div>

        <div className={styles.tableCard}>
          {isLoading ? (
            <div className={styles.emptyState}>
              <Spinner size="md" />
              <p>Loading recent cases...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className={styles.emptyState}>
              <FolderOpen size={40} color="var(--sage-mid)" />
              <p style={{ fontWeight: 'var(--fw-medium)', color: 'var(--text-primary)' }}>
                No active cases found
              </p>
              <p style={{ fontSize: 'var(--text-xs)', maxWidth: '320px' }}>
                Create your first case matter to start uploading evidence and running forensic pipelines.
              </p>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => navigate('/cases/new')}
                style={{ marginTop: 'var(--space-2)' }}
              >
                Create Case
              </Button>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Case #</th>
                  <th>Title</th>
                  <th>Client</th>
                  <th>Matter Type</th>
                  <th>Evidence</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className={styles.caseNumber}>{c.caseNumber || c.id.slice(0, 8)}</span>
                    </td>
                    <td>
                      <Link to={`/cases/${c.id}`} className={styles.caseTitle}>
                        {c.title}
                      </Link>
                    </td>
                    <td>{c.clientName}</td>
                    <td>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                        {c.matterType}
                      </span>
                    </td>
                    <td>{c.fileCount ?? 0} files</td>
                    <td>
                      <StatusBadge
                        label={c.status}
                        tone={c.status === 'Open' ? 'success' : 'neutral'}
                      />
                    </td>
                    <td>
                      <Link
                        to={`/cases/${c.id}`}
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--sage-dark)',
                          fontWeight: 'var(--fw-semibold)',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                        }}
                      >
                        Open <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
