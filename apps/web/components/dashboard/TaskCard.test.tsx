import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from './TaskCard';

describe('TaskCard', () => {
  const task = {
    id: 'task-1',
    title: 'Write unit tests',
    description: 'Add tests for TaskCard',
    priority: 'high',
    timeEstimate: '1h',
    tags: ['testing'],
    completed: false,
    dueTime: '10:00 AM',
    dueDate: '2025-06-01',
    goal: 'Testing',
    status: 'PENDING',
    createdAt: '2025-05-01T08:00:00Z',
    updatedAt: '2025-05-01T08:00:00Z',
  } as const;

  it('renders task title and status', () => {
    render(<TaskCard task={task} />);
    expect(screen.getByText('Write unit tests')).toBeTruthy();
    expect(screen.getByText(/PENDING/i)).toBeTruthy();
  });

  it('calls complete handler on complete button click', () => {
    const onComplete = jest.fn();
    render(<TaskCard task={task} onComplete={onComplete} />);
    const completeBtn = screen.getByRole('button', { name: /complete/i });
    fireEvent.click(completeBtn);
    expect(onComplete).toHaveBeenCalled();
  });
}); 