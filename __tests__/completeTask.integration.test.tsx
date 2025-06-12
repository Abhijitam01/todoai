import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/(app)/dashboard/page';

describe('Complete Task Integration', () => {
  it('marks a task as complete and updates UI', async () => {
    render(<DashboardPage />);

    // Find a task that is not completed
    const taskTitle = screen.getByText(/Review Q4 performance metrics/i);
    expect(taskTitle).toBeTruthy();

    // Find the complete button (assuming it has role/button and label)
    const completeBtn = screen.getByRole('button', { name: /complete/i });
    fireEvent.click(completeBtn);

    // Wait for UI/state update (e.g., task marked as completed, strikethrough, or badge)
    await waitFor(() => {
      expect(taskTitle).toHaveClass('line-through');
    });
  });
}); 