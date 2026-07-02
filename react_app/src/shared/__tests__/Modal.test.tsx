import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from '../components/Modal';

describe('Modal', () => {
  it('renders children when isOpen=true', () => {
    render(
      <Modal isOpen title="Test" onClose={() => {}}>
        <p>Body content</p>
      </Modal>,
    );
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('does not render when isOpen=false', () => {
    render(
      <Modal isOpen={false} title="Test" onClose={() => {}}>
        <p>Body content</p>
      </Modal>,
    );
    expect(screen.queryByText('Body content')).not.toBeInTheDocument();
  });

  it('calls onClose when Escape pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen title="Test" onClose={onClose}>
        <p>Body content</p>
      </Modal>,
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen title="Test" onClose={onClose}>
        <p>Body content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByRole('dialog').parentElement!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when modal body clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen title="Test" onClose={onClose}>
        <p>Body content</p>
      </Modal>,
    );
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('has correct ARIA attributes', () => {
    render(
      <Modal isOpen title="Test title" onClose={() => {}}>
        <p>Body content</p>
      </Modal>,
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  it('traps focus inside modal', () => {
    render(
      <Modal isOpen title="Test" onClose={() => {}}>
        <button>First</button>
        <button>Last</button>
      </Modal>,
    );
    const first = screen.getByText('First');
    const last = screen.getByText('Last');

    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});
