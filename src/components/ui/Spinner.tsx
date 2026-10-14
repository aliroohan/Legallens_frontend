import styles from './Spinner.module.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const Spinner = ({ size = 'md', className = '', label = 'Loading...' }: SpinnerProps) => {
  return (
    <div
      className={[styles.spinner, styles[size], className].filter(Boolean).join(' ')}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
};

export const PageSpinner = () => (
  <div className={styles.pageSpinner}>
    <Spinner size="lg" />
  </div>
);
