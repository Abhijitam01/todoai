import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateGoalPage from '@/app/(app)/create-goal/page';

describe('Create Goal Integration', () => {
  it('fills out the form and submits, showing success', async () => {
    render(<CreateGoalPage />);

    // Fill out step 1
    fireEvent.change(screen.getByLabelText(/Goal name/i), { target: { value: 'Test Goal' } });
    fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'learning' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Fill out step 2
    fireEvent.change(screen.getByLabelText(/Priority/i), { target: { value: 'high' } });
    fireEvent.change(screen.getByLabelText(/Duration/i), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    // Fill out step 3
    fireEvent.change(screen.getByLabelText(/Time per day/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Skill level/i), { target: { value: 'beginner' } });
    fireEvent.change(screen.getByLabelText(/Success metric/i), { target: { value: 'completion' } });
    fireEvent.click(screen.getByRole('button', { name: /Create Goal/i }));

    // Wait for success toast or plan preview redirect
    await waitFor(() => {
      expect(screen.getByText(/created successfully/i)).toBeTruthy();
    });
  });
}); 