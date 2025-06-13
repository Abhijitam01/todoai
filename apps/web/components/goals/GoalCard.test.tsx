import { render, screen, fireEvent } from '@testing-library/react';
import { GoalCard, Goal } from './GoalCard';

describe('GoalCard', () => {
  const goal: Goal = {
    id: 'goal-1',
    title: 'Learn Python',
    startDate: '2025-06-01',
    endDate: '2025-09-01',
    progress: 40,
    status: 'active',
  };

  it('renders goal title and status badge', () => {
    render(<GoalCard goal={goal} />);
    expect(screen.getByText('Learn Python')).toBeInTheDocument();
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
  });

  it('calls console.log on View Details click', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<GoalCard goal={goal} />);
    fireEvent.click(screen.getByRole('button', { name: /View Details/i }));
    expect(logSpy).toHaveBeenCalledWith('goal-1');
    logSpy.mockRestore();
  });
}); 