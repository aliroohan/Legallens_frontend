import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  FolderOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { useCases } from '../../hooks/cases/useCases';
import type { Case, CaseStatus, MatterType } from '../../types';
import styles from './Cases.module.css';

const matterTypes: MatterType[] = [
  'Litigation',
  'Insurance Claim',
  'Criminal Defense',
  'IP Dispute',
  'Other',
];

export const Cases = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<CaseStatus | ''>('');
  const [matterType, setMatterType] = useState<MatterType | ''>('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useCases({
    status: status || undefined,
    matterType: matterType || undefined,
    page,
    limit,
  });

  const allCases: Case[] = data?.data?.items || data?.data?.data || [];
  const total = data?.data?.total || allCases.length;
  const totalPages = Math.ceil(total / limit) || 1;

  // Filter client-side search query if backend query parameter is not supported
  const filteredCases = allCases.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.clientName.toLowerCase().includes(q) ||
      c.caseNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.headerRow}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Legal Cases</h1>
          <p className={styles.subtitle}>
            Manage and examine evidence dossiers across active legal matters
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={() => navigate('/cases/new')}
        >
          New Case
        </Button>
      </div>

      {/* Toolbar / Filters */}
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <Search size={16} color="var(--text-secondary)" />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by title, client, or case #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={16} color="var(--text-secondary)" />
            <select
              className={styles.select}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as CaseStatus | '');
                setPage(1);
              }}
              aria-label="Filter by status"
            >
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <select
            className={styles.select}
            value={matterType}
            onChange={(e) => {
              setMatterType(e.target.value as MatterType | '');
              setPage(1);
            }}
            aria-label="Filter by matter type"
          >
            <option value="">All Matter Types</option>
            {matterTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        {isLoading ? (
          <div className={styles.emptyState}>
            <Spinner size="md" />
            <p>Loading cases...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div className={styles.emptyState}>
            <FolderOpen size={48} color="var(--sage-mid)" />
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semibold)' }}>
              No cases found
            </h3>
            <p style={{ maxWidth: '360px', fontSize: 'var(--text-sm)' }}>
              {search || status || matterType
                ? 'No cases match your current filters. Try resetting the search or filter options.'
                : 'Get started by creating your first legal case file to store digital evidence.'}
            </p>
            {!search && !status && !matterType && (
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => navigate('/cases/new')}
                style={{ marginTop: 'var(--space-2)' }}
              >
                Create First Case
              </Button>
            )}
          </div>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Case #</th>
                  <th>Title</th>
                  <th>Client Name</th>
                  <th>Matter Type</th>
                  <th>Evidence</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className={styles.caseNumber}>
                        {c.caseNumber || c.id.slice(0, 8)}
                      </span>
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
                        Open Workspace <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className={styles.pagination}>
              <span>
                Showing <strong>{filteredCases.length}</strong> of <strong>{total}</strong> cases
              </span>
              <div className={styles.paginationControls}>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  icon={<ChevronLeft size={16} />}
                >
                  Previous
                </Button>
                <span style={{ padding: '0 8px', fontSize: 'var(--text-xs)' }}>
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  icon={<ChevronRight size={16} />}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
