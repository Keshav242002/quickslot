import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SportFilterBar } from '../components/SportFilterBar';

describe('SportFilterBar', () => {
  it('renders "All" chip always', () => {
    render(<SportFilterBar sports={[]} selected="all" onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument();
  });

  it('renders one chip per unique sport', () => {
    render(
      <SportFilterBar
        sports={['badminton', 'football']}
        selected="all"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('tab', { name: /badminton/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /football/i })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('"All" chip is active by default (selected="all")', () => {
    render(<SportFilterBar sports={['badminton']} selected="all" onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'true');
  });

  it('clicking a sport chip calls onChange with sport name', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SportFilterBar sports={['badminton']} selected="all" onChange={onChange} />);

    await user.click(screen.getByRole('tab', { name: /badminton/i }));

    expect(onChange).toHaveBeenCalledWith('badminton');
  });

  it('clicking "All" chip calls onChange with "all"', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SportFilterBar sports={['badminton']} selected="badminton" onChange={onChange} />);

    await user.click(screen.getByRole('tab', { name: 'All' }));

    expect(onChange).toHaveBeenCalledWith('all');
  });

  it('active chip has accent styling', () => {
    render(<SportFilterBar sports={['badminton']} selected="badminton" onChange={vi.fn()} />);

    expect(screen.getByRole('tab', { name: /badminton/i })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'All' })).toHaveAttribute('aria-selected', 'false');
  });
});
