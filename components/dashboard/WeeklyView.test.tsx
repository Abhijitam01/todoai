import { render, screen } from '@testing-library/react';
import WeeklyView from './WeeklyView';

describe('WeeklyView', () => {
  it('renders all days of the week', () => {
    render(<WeeklyView />);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
      expect(screen.getByText(day)).toBeTruthy();
    });
  });

  it('renders at least one task or event', () => {
    render(<WeeklyView />);
    // This test assumes at least one task/event is rendered
    expect(screen.getAllByTestId('weekly-task').length).toBeGreaterThan(0);
  });
}); 