import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';
import { filesApi } from '../../api/files.api';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Spinner } from '../../components/ui/Spinner';
import { apiErrorMessage } from '../../utils/homePath';
import type { EvidenceFile } from '../../types';
import styles from './CaseWorkspace.module.css';

const LIMITS: Record<string, number> = {
  image: 5 * 1024 * 1024,
  audio: 5 * 1024 * 1024,
  document: 25 * 1024 * 1024,
  video: 100 * 1024 * 1024,
};

function categoryFor(file: File): keyof typeof LIMITS | null {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf' || file.type.includes('word') || file.type === 'text/plain') return 'document';
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) return 'image';
  if (['pdf', 'docx', 'doc', 'txt'].includes(ext || '')) return 'document';
  if (['mp4', 'mov', 'avi', 'mkv', 'mpeg', 'mpg', '3gp', 'webm'].includes(ext || '')) return 'video';
  if (['wav', 'mp3', 'm4a', 'aac', 'flac', 'amr'].includes(ext || '')) return 'audio';
  return null;
}

function formatBytes(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.round(size / 1024))} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export const EvidencePanel = ({ caseId, closed }: { caseId: string; closed: boolean }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<{ name: string; url: string; type: string } | null>(null);

  const filesQuery = useQuery({
    queryKey: ['files', caseId],
    queryFn: () => filesApi.list(caseId),
    refetchInterval: (query) => {
      const files = query.state.data ?? [];
      return files.some((file) => file.processingStatus === 'Pending' || file.processingStatus === 'Processing')
        ? 4000
        : false;
    },
  });

  const upload = useMutation({
    mutationFn: (selected: File[]) => filesApi.upload(caseId, selected),
    onSuccess: () => {
      toast.success('Evidence uploaded.');
      queryClient.invalidateQueries({ queryKey: ['files', caseId] });
      queryClient.invalidateQueries({ queryKey: ['cases', caseId] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Upload failed.')),
  });

  const remove = useMutation({
    mutationFn: (fileId: string) => filesApi.remove(fileId),
    onSuccess: () => {
      toast.success('File removed from the case view. The audit copy is retained.');
      queryClient.invalidateQueries({ queryKey: ['files', caseId] });
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not delete the file.')),
  });

  const onFiles = (list: FileList | null) => {
    if (!list || closed) return;
    const selected = Array.from(list);
    const rejected: string[] = [];
    const accepted = selected.filter((file) => {
      const category = categoryFor(file);
      if (!category) {
        rejected.push(`${file.name}: unsupported type`);
        return false;
      }
      if (file.size > LIMITS[category]) {
        rejected.push(`${file.name}: exceeds the ${category} size limit`);
        return false;
      }
      return true;
    });
    if (rejected.length) toast.error(rejected.join(' '));
    if (accepted.length) upload.mutate(accepted);
  };

  const openPreview = async (file: EvidenceFile) => {
    try {
      const url = await filesApi.previewUrl(file.id);
      setPreview({ name: file.originalName, url, type: file.mimeType });
    } catch (error) {
      toast.error(apiErrorMessage(error, 'Preview is unavailable.'));
    }
  };

  const files = filesQuery.data ?? [];

  return (
    <div className={styles.tabContent}>
      {!closed && (
        <div
          className={styles.dropzone}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            onFiles(event.dataTransfer.files);
          }}
        >
          <Upload size={28} color="var(--sage-dark)" />
          <p>Drop evidence here, or choose files. Images and audio up to 5MB, documents 25MB, video 100MB.</p>
          <Button type="button" variant="primary" size="sm" isLoading={upload.isPending} onClick={() => inputRef.current?.click()}>
            Choose files
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            onChange={(event) => {
              onFiles(event.target.files);
              event.target.value = '';
            }}
          />
        </div>
      )}

      {filesQuery.isLoading ? (
        <div className={styles.emptyArea}><Spinner /></div>
      ) : files.length === 0 ? (
        <div className={styles.emptyArea}>
          <h3>No evidence yet</h3>
          <p>Upload images, documents, video, or audio for this case.</p>
        </div>
      ) : (
        <div className={styles.fileList}>
          {files.map((file) => (
            <div key={file.id} className={styles.fileRow}>
              <div>
                <div className={styles.fileName}>{file.originalName}</div>
                <div className={styles.muted}>{file.fileCategory} · {formatBytes(file.size)} · {file.sha256Hash.slice(0, 12)}…</div>
              </div>
              <span className={styles.muted}>{new Date(file.createdAt).toLocaleString()}</span>
              <StatusBadge
                label={file.processingStatus}
                tone={file.processingStatus === 'Completed' ? 'success' : file.processingStatus === 'Failed' ? 'danger' : 'warning'}
              />
              <div className={styles.actions}>
                <Button type="button" variant="secondary" size="sm" onClick={() => openPreview(file)}>Preview</Button>
                <Button type="button" variant="ghost" size="sm" disabled={closed || remove.isPending} onClick={() => remove.mutate(file.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {preview && (
        <div className={styles.infoCard}>
          <h3 className={styles.cardTitle}>{preview.name}</h3>
          {preview.type.startsWith('image/') ? (
            <img src={preview.url} alt={preview.name} className={styles.heatmap} />
          ) : preview.type.startsWith('video/') || preview.type.startsWith('audio/') ? (
            preview.type.startsWith('video/') ? <video src={preview.url} controls className={styles.heatmap} /> : <audio src={preview.url} controls />
          ) : (
            <iframe title={preview.name} src={preview.url} style={{ width: '100%', minHeight: 420, border: 0 }} />
          )}
        </div>
      )}
    </div>
  );
};
