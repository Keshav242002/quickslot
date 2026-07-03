import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { isValidEmail } from '../utils/validators';
import { Button } from '@/shared/components/Button';
import styles from './Auth.module.css';

export function LoginPage() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle, submitting, actionError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;
    try {
      await signInWithEmail(email, password);
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

  const isFormEmpty = !email || !password;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <p className={styles.brand}>QuickSlot</p>
        <h1 className={styles.heading}>Welcome back</h1>

        {actionError ? (
          <div className={styles.errorBanner} role="alert">
            {actionError}
          </div>
        ) : null}

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className={styles.input}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'login-email-error' : undefined}
            />
            {fieldErrors.email ? (
              <span id="login-email-error" className={styles.fieldError}>
                {fieldErrors.email}
              </span>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? 'login-password-error' : undefined}
            />
            {fieldErrors.password ? (
              <span id="login-password-error" className={styles.fieldError}>
                {fieldErrors.password}
              </span>
            ) : null}
          </div>

          <Button type="submit" loading={submitting} disabled={isFormEmpty}>
            Sign In
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
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
