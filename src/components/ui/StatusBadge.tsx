import styles from './StatusBadge.module.css';

type BadgeTone = 'success' | 'warning' | 'danger' | 'neutral';

interface StatusBadgeProps {
  label: string;
  tone: BadgeTone;
  className?: string;
}

export const StatusBadge = ({ label, tone, className = '' }: StatusBadgeProps) => {
  return (
    <span
      className={[styles.badge, styles[tone], className].filter(Boolean).join(' ')}
      aria-label={`Status: ${label}`}
    >
      {label}
    </span>
  );
};

/**
 * Helper: map backend processing status to badge tone
 */
export const processingStatusTone = (status: string): BadgeTone => {
  switch (status) {
    case 'Completed': return 'success';
    case 'Processing': return 'warning';
    case 'Failed': return 'danger';
    default: return 'neutral';
  }
};

/**
 * Helper: map authenticity label to badge tone
 */
export const authenticityTone = (label: string): BadgeTone => {
  switch (label) {
    case 'Authentic': return 'success';
    case 'Suspicious': return 'warning';
    case 'Highly Manipulated': return 'danger';
    default: return 'neutral';
  }
};
