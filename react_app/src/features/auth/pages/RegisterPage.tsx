import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail, isValidPassword } from '../utils/validators';
import { Button } from '@/shared/components/Button';
import styles from './Auth.module.css';

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle, submitting, actionError } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!name) errors.name = 'Name is required';
    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
      errors.password = 'Password must be at least 8 characters';
    }
    if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    try {
      await signUpWithEmail(name, email, password);
      navigate('/venues', { replace: true });
    } catch {
      // actionError is already set by useAuth
    }
  }

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
      navigate('/venues', { replace: true });
    } catch {
      // actionError is already set by useAuth
    }
  }

  const isFormEmpty = !name || !email || !password || !confirmPassword;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.brand}>QuickSlot</p>
        <h1 className={styles.heading}>Create account</h1>

        {actionError ? (
          <div className={styles.errorBanner} role="alert">
            {actionError}
          </div>
        ) : null}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-name">
              Display name
            </label>
            <input
              id="register-name"
              className={styles.input}
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? 'register-name-error' : undefined}
            />
            {fieldErrors.name ? (
              <span id="register-name-error" className={styles.fieldError}>
                {fieldErrors.name}
              </span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'register-email-error' : undefined}
            />
            {fieldErrors.email ? (
              <span id="register-email-error" className={styles.fieldError}>
                {fieldErrors.email}
              </span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-password">
              Password
            </label>
            <input
              id="register-password"
              className={styles.input}
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'register-password-error' : undefined}
            />
            {fieldErrors.password ? (
              <span id="register-password-error" className={styles.fieldError}>
                {fieldErrors.password}
              </span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-confirm-password">
              Confirm password
            </label>
            <input
              id="register-confirm-password"
              className={styles.input}
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={
                fieldErrors.confirmPassword ? 'register-confirm-password-error' : undefined
              }
            />
            {fieldErrors.confirmPassword ? (
              <span id="register-confirm-password-error" className={styles.fieldError}>
                {fieldErrors.confirmPassword}
              </span>
            ) : null}
          </div>

          <Button type="submit" loading={submitting} disabled={isFormEmpty}>
            Create Account
          </Button>
        </form>

        <div className={styles.divider}>or</div>

        <Button
          type="button"
          variant="secondary"
          className={styles.googleButton}
          onClick={handleGoogleSignIn}
          disabled={submitting}
        >
          Continue with Google
        </Button>

        <p className={styles.footerLink}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
