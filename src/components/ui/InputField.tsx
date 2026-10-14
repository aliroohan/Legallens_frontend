import type { InputHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import styles from './InputField.module.css';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  rightElement?: ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, rightElement, id, className = '', ...rest }, ref) => {
    const inputId = id ?? `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
        <div className={[styles.inputWrapper, error ? styles.hasError : ''].filter(Boolean).join(' ')}>
          <input
            ref={ref}
            id={inputId}
            className={styles.input}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...rest}
          />
          {rightElement && (
            <div className={styles.rightElement}>{rightElement}</div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className={styles.errorMsg} role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className={styles.hint}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';
