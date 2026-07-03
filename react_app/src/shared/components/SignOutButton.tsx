import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/core/auth/AuthContext';
import styles from './BottomNav.module.css';

export function SignOutButton() {
  const { signOut } = useAuthContext();
  const navigate = useNavigate();

  async function handleClick() {
    await signOut();
    navigate('/login', { replace: true });
  }

  return (
    <button type="button" className={styles.tab} onClick={handleClick}>
      <span aria-hidden="true">🚪</span>
      <span>Sign Out</span>
    </button>
  );
}
