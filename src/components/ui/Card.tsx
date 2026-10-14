import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = ({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
  ...rest
}: CardProps) => {
  return (
    <div
      className={`
        ${styles.card}
        ${styles[`pad-${padding}`]}
        ${hoverable ? styles.hoverable : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </div>
  );
};
