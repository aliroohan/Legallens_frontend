import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { filesApi } from '../../api/files.api';
import { forensicsApi } from '../../api/forensics.api';
import { reportsApi } from '../../api/reports.api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { apiErrorMessage } from '../../utils/homePath';
import type { ForensicResult, ModuleResult } from '../../types';
import styles from './CaseWorkspace.module.css';

const MODULE_KEYS = ['exif', 'ela', 'copyMove', 'noise', 'lighting', 'deepfake'] as const;

function ModuleCard({ result }: { result: ModuleResult }) {
  const title = result.details?.sourceName || 'Module';
  return (
    <div className={styles.infoCard}>
      <div className={styles.detailRow}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <StatusBadge label={result.status.replace('_', ' ')} tone={result.status === 'success' ? 'success' : result.status === 'failed' ? 'danger' : 'neutral'} />
      </div>
      <p className={styles.muted}>Score {result.subScore === null ? 'n/a' : result.subScore.toFixed(2)}</p>
      <p>{result.explanation}</p>
      {result.heatmapBase64 && (
        <img className={styles.heatmap} alt={`${title} visualization`} src={`data:image/png;base64,${result.heatmapBase64}`} />
      )}
    </div>
  );
}

export const ForensicsPanel = ({ caseId }: { caseId: string }) => {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string>('');

  const filesQuery = useQuery({ queryKey: ['files', caseId], queryFn: () => filesApi.list(caseId) });
  const resultsQuery = useQuery({
    queryKey: ['forensics', caseId],
    queryFn: () => forensicsApi.listForCase(caseId),
    refetchInterval: 8000,
  });
  const reportsQuery = useQuery({ queryKey: ['reports', caseId], queryFn: () => reportsApi.list(caseId) });

  const images = (filesQuery.data ?? []).filter((file) => file.fileCategory === 'image');
  const activeId = selectedId || images[0]?.id || '';
  const latest = (resultsQuery.data ?? []).find((result) => result.fileId === activeId);

  const analyze = useMutation({
    mutationFn: () => forensicsApi.analyze(activeId),
    onSuccess: () => {
      toast.success('Analysis finished.');
      queryClient.invalidateQueries({ queryKey: ['forensics', caseId] });
      queryClient.invalidateQueries({ queryKey: ['files', caseId] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Analysis could not be completed.')),
  });

  const reverse = useMutation({
    mutationFn: () => forensicsApi.reverseSearch(activeId),
    onSuccess: (data) => toast.success(data.message || 'Reverse search finished with no external matches.'),
    onError: (error) => toast.error(apiErrorMessage(error, 'Reverse search failed.')),
  });

  const exportReport = useMutation({
    mutationFn: () => reportsApi.exportCase(caseId),
    onSuccess: async (report) => {
      toast.success('Report generated.');
      await reportsApi.download(caseId, report.reportId);
      queryClient.invalidateQueries({ queryKey: ['reports', caseId] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not export the report.')),
  });

  if (filesQuery.isLoading || resultsQuery.isLoading) {
    return <div className={styles.emptyArea}><Spinner /></div>;
  }

  if (images.length === 0) {
    return (
      <div className={styles.emptyArea}>
        <h3>No images to analyze</h3>
        <p>Upload an image on the Evidence Files tab. Documents, video, and audio stay in the vault without image analysis.</p>
      </div>
    );
  }

  return (
    <div className={styles.tabContent}>
      <div className={styles.infoCard}>
        <label className={styles.detailLabel} htmlFor="image-select">Image</label>
        <select id="image-select" value={activeId} onChange={(event) => setSelectedId(event.target.value)}>
          {images.map((image) => (
            <option key={image.id} value={image.id}>{image.originalName}</option>
          ))}
        </select>
        <div className={styles.actions}>
          <Button type="button" size="sm" isLoading={analyze.isPending} onClick={() => analyze.mutate()}>Reanalyze</Button>
          <Button type="button" variant="secondary" size="sm" isLoading={reverse.isPending} onClick={() => reverse.mutate()}>Reverse search</Button>
          <Button type="button" variant="secondary" size="sm" isLoading={exportReport.isPending} onClick={() => exportReport.mutate()}>Export PDF</Button>
        </div>
        {reverse.data && (
          <p className={styles.muted}>
            {reverse.data.message || (reverse.data.matchesCount ? `${reverse.data.matchesCount} matches` : 'No matching images were found.')}
          </p>
        )}
      </div>

      {latest ? <ResultView result={latest} /> : (
        <div className={styles.emptyArea}>
          <h3>Analysis not stored yet</h3>
          <p>Image uploads start analysis automatically. You can also run it from here.</p>
        </div>
      )}

      <div className={styles.infoCard}>
        <h3 className={styles.cardTitle}>Saved reports</h3>
        {(reportsQuery.data ?? []).length === 0 ? <p className={styles.muted}>No reports exported yet.</p> : (
          <div className={styles.fileList}>
            {(reportsQuery.data ?? []).map((report) => (
              <div key={report.reportId} className={styles.detailRow}>
                <span>{report.title}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => reportsApi.download(caseId, report.reportId)}>Download</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function ResultView({ result }: { result: ForensicResult }) {
  const tone = result.authenticityLabel === 'Authentic' ? 'success' : result.authenticityLabel === 'Highly Manipulated' ? 'danger' : 'warning';
  return (
    <>
      <div className={styles.infoCard}>
        <div className={styles.detailRow}>
          <div>
            <div className={styles.muted}>Fusion score</div>
            <div className={styles.score}>{result.fusionScore === null ? '—' : result.fusionScore.toFixed(2)}</div>
          </div>
          <StatusBadge label={result.authenticityLabel || result.status} tone={result.authenticityLabel ? tone : 'neutral'} />
        </div>
        {result.errorMessage && <p>{result.errorMessage}</p>}
      </div>
      <div className={styles.moduleGrid}>
        {MODULE_KEYS.map((key) => <ModuleCard key={key} result={result.modules[key]} />)}
      </div>
    </>
  );
}
