import clsx from 'clsx';
import styles from './Skeleton.module.css';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  count?: number;
  variant?: 'text' | 'rect' | 'circle';
  className?: string;
}

export function Skeleton({
  width,
  height,
  count = 1,
  variant = 'text',
  className,
}: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={clsx(styles.skeleton, styles[variant], className)}
          style={{ width, height }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
