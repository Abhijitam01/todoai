import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SnoozeDialog } from '../SnoozeDialog';
import { Task } from '@/lib/stores/taskStore';

expect.extend(toHaveNoViolations);

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock useTaskStore
const mockSnoozeTask = jest.fn();
const mockUseTaskStore = jest.fn(() => ({
  snoozeTask: mockSnoozeTask,
}));

jest.mock('@/lib/stores/taskStore', () => ({
  __esModule: true,
  default: mockUseTaskStore,
}));

// Mock useTaskToasts
const mockOnTaskSnoozed = jest.fn();
const mockUseTaskToasts = jest.fn(() => ({
  onTaskSnoozed: mockOnTaskSnoozed,
}));

jest.mock('@/components/ui/toast', () => ({
  useTaskToasts: mockUseTaskToasts,
}));

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  priority: 'medium',
  timeEstimate: '2 hours',
  tags: ['work', 'urgent'],
  completed: false,
  dueTime: '10:00 AM',
  dueDate: '2024-01-15',
  goal: 'Test Goal',
  status: 'PENDING',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

describe('SnoozeDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
    task: mockTask,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when open', () => {
    render(<SnoozeDialog {...defaultProps} />);
    
    expect(screen.getByText('Snooze Task')).toBeInTheDocument();
    expect(screen.getByText('When would you like to be reminded?')).toBeInTheDocument();
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<SnoozeDialog {...defaultProps} open={false} />);
    
    expect(screen.queryByText('Snooze Task')).not.toBeInTheDocument();
  });

  it('displays task information correctly', () => {
    render(<SnoozeDialog {...defaultProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('Due: 2024-01-15')).toBeInTheDocument();
  });

  it('displays all snooze preset options', () => {
    render(<SnoozeDialog {...defaultProps} />);
    
    expect(screen.getByText('2 Hours')).toBeInTheDocument();
    expect(screen.getByText('End of Day')).toBeInTheDocument();
    expect(screen.getByText('Tomorrow Morning')).toBeInTheDocument();
    expect(screen.getByText('Tomorrow Afternoon')).toBeInTheDocument();
    expect(screen.getByText('Next Week')).toBeInTheDocument();
  });

  it('displays custom time option', () => {
    render(<SnoozeDialog {...defaultProps} />);
    
    expect(screen.getByText('Custom Time')).toBeInTheDocument();
  });

  it('selects a preset option when clicked', async () => {
    const user = userEvent.setup();
    render(<SnoozeDialog {...defaultProps} />);
    
    const twoHoursOption = screen.getByText('2 Hours').closest('button');
    await user.click(twoHoursOption!);
    
    // Should show as selected (implementation specific - adjust based on your styling)
    expect(twoHoursOption).toHaveClass('border-blue-500/50');
  });

  it('shows custom date/time inputs when custom option is selected', async () => {
    const user = userEvent.setup();
    render(<SnoozeDialog {...defaultProps} />);
    
    const customOption = screen.getByText('Custom Time').closest('button');
    await user.click(customOption!);
    
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
  });

  it('shows preview when a preset is selected', async () => {
    const user = userEvent.setup();
    render(<SnoozeDialog {...defaultProps} />);
    
    const tomorrowOption = screen.getByText('Tomorrow Morning').closest('button');
    await user.click(tomorrowOption!);
    
    expect(screen.getByText('Will be reminded on:')).toBeInTheDocument();
  });

  it('calls snoozeTask and shows toast when confirming preset', async () => {
    const user = userEvent.setup();
    render(<SnoozeDialog {...defaultProps} />);
    
    // Select a preset
    const twoHoursOption = screen.getByText('2 Hours').closest('button');
    await user.click(twoHoursOption!);
    
    // Click confirm button
    const confirmButton = screen.getByText('Snooze Task');
    await user.click(confirmButton);
    
    expect(mockSnoozeTask).toHaveBeenCalledWith('1', expect.any(String));
    expect(mockOnTaskSnoozed).toHaveBeenCalledWith('Test Task', expect.any(String));
  });

  it('calls snoozeTask with custom date/time', async () => {
    const user = userEvent.setup();
    render(<SnoozeDialog {...defaultProps} />);
    
    // Select custom option
    const customOption = screen.getByText('Custom Time').closest('button');
    await user.click(customOption!);
    
    // Set custom date and time
    const dateInput = screen.getByLabelText('Date');
    const timeInput = screen.getByLabelText('Time');
    
    await user.type(dateInput, '2024-02-01');
    await user.type(timeInput, '14:30');
    
    // Click confirm button
    const confirmButton = screen.getByText('Snooze Task');
    await user.click(confirmButton);
    
    expect(mockSnoozeTask).toHaveBeenCalledWith('1', '2024-02-01T14:30:00.000Z');
  });

  it('handles keyboard shortcuts correctly', async () => {
    const user = userEvent.setup();
    render(<SnoozeDialog {...defaultProps} />);
    
    // Test number key selection
    await user.keyboard('1');
    
    // Should select first preset (implementation specific)
    const firstPreset = screen.getByText('2 Hours').closest('button');
    expect(firstPreset).toHaveClass('border-blue-500/50');
    
    // Test Enter to confirm
    await user.keyboard('{Enter}');
    
    expect(mockSnoozeTask).toHaveBeenCalled();
  });

  it('closes dialog when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(<SnoozeDialog {...defaultProps} onOpenChange={onOpenChange} />);
    
    await user.keyboard('{Escape}');
    
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('disables confirm button when no option is selected', () => {
    render(<SnoozeDialog {...defaultProps} />);
    
    const confirmButton = screen.getByText('Snooze Task');
    expect(confirmButton).toBeDisabled();
  });

  it('shows keyboard shortcuts hint', () => {
    render(<SnoozeDialog {...defaultProps} />);
    
    expect(screen.getByText(/Press 1-5 for quick selection/)).toBeInTheDocument();
    expect(screen.getByText(/Enter to confirm/)).toBeInTheDocument();
    expect(screen.getByText(/Esc to cancel/)).toBeInTheDocument();
  });

  it('handles cancel button click', async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    render(<SnoozeDialog {...defaultProps} onOpenChange={onOpenChange} />);
    
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SnoozeDialog {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper ARIA labels', () => {
    render(<SnoozeDialog {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toBeInTheDocument();
    expect(screen.getByLabelText('Time')).toBeInTheDocument();
  });

  it('manages focus correctly', async () => {
    const user = userEvent.setup();
    render(<SnoozeDialog {...defaultProps} />);
    
    // Focus should be trapped within the dialog
    expect(document.activeElement).toBe(screen.getByRole('dialog'));
    
    // Tab should move focus within dialog
    await user.tab();
    expect(document.activeElement).toBeInTheDocument();
  });

  it('handles high priority task smart suggestion', () => {
    const highPriorityTask = { ...mockTask, priority: 'high' as const };
    render(<SnoozeDialog {...defaultProps} task={highPriorityTask} />);
    
    // Should pre-select appropriate option based on time and priority
    // Implementation specific - verify the smart suggestion logic
  });

  it('handles different time periods correctly', () => {
    // Test during different times of day to verify smart suggestions
    const originalDate = Date;
    
    // Mock morning time
    global.Date = class extends originalDate {
      constructor() {
        super();
        return new originalDate('2024-01-15T08:00:00Z');
      }
      static now() {
        return new originalDate('2024-01-15T08:00:00Z').getTime();
      }
    } as any;
    
    render(<SnoozeDialog {...defaultProps} />);
    
    // Verify morning suggestions are appropriate
    expect(screen.getByText('2 Hours')).toBeInTheDocument();
    
    global.Date = originalDate;
  });

  it('formats dates correctly in preview', async () => {
    const user = userEvent.setup();
    render(<SnoozeDialog {...defaultProps} />);
    
    const tomorrowOption = screen.getByText('Tomorrow Morning').closest('button');
    await user.click(tomorrowOption!);
    
    // Should show formatted date in preview
    expect(screen.getByText(/Will be reminded on:/)).toBeInTheDocument();
    // Date formatting should be consistent and readable
  });

  it('handles edge cases for custom date validation', async () => {
    const user = userEvent.setup();
    render(<SnoozeDialog {...defaultProps} />);
    
    const customOption = screen.getByText('Custom Time').closest('button');
    await user.click(customOption!);
    
    // Try to confirm without setting date/time
    const confirmButton = screen.getByText('Snooze Task');
    await user.click(confirmButton);
    
    // Should not call snoozeTask if validation fails
    expect(mockSnoozeTask).not.toHaveBeenCalled();
  });
}); 