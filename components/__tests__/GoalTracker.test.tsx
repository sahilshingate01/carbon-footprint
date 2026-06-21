import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GoalTracker from '../GoalTracker';

describe('GoalTracker component', () => {
  test('renders prompt to set goal when no goal is present', () => {
    render(<GoalTracker weeklyGoal={null} latestEmissions={80.5} onUpdateGoal={() => {}} />);
    expect(screen.getByText(/Set a weekly carbon budget/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Set Weekly Goal/i })).toBeInTheDocument();
  });

  test('renders congratulations when emissions are under goal', () => {
    render(<GoalTracker weeklyGoal={100} latestEmissions={85.3} onUpdateGoal={() => {}} />);
    expect(screen.getByText(/Great job! You are under your weekly carbon budget/i)).toBeInTheDocument();
    expect(screen.getByText('85% utilized')).toBeInTheDocument();
  });

  test('renders warning when emissions exceed goal', () => {
    render(<GoalTracker weeklyGoal={100} latestEmissions={120.4} onUpdateGoal={() => {}} />);
    expect(screen.getByText(/You are 20.4 kg CO₂ over your target this week/i)).toBeInTheDocument();
  });

  test('opens editing form and submits updated goal', () => {
    const updateSpy = vi.fn();
    render(<GoalTracker weeklyGoal={100} latestEmissions={50} onUpdateGoal={updateSpy} />);

    const editBtn = screen.getByRole('button', { name: /Edit weekly goal/i });
    fireEvent.click(editBtn);

    const input = screen.getByLabelText(/Target emissions/i);
    fireEvent.change(input, { target: { value: '150' } });

    const saveBtn = screen.getByRole('button', { name: /Save goal/i });
    fireEvent.click(saveBtn);

    expect(updateSpy).toHaveBeenCalledWith(150);
  });

  test('cancels edit and restores previous goal value', () => {
    render(<GoalTracker weeklyGoal={100} latestEmissions={50} onUpdateGoal={() => {}} />);

    const editBtn = screen.getByRole('button', { name: /Edit weekly goal/i });
    fireEvent.click(editBtn);

    const input = screen.getByLabelText(/Target emissions/i);
    fireEvent.change(input, { target: { value: '250' } });

    const cancelBtn = screen.getByRole('button', { name: /Cancel editing/i });
    fireEvent.click(cancelBtn);

    expect(screen.queryByLabelText(/Target emissions/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Target:/)).toBeInTheDocument();
    expect(screen.getByText(/100\.0/)).toBeInTheDocument();
  });

  test('opens editing form when clicking Set Weekly Goal and submits empty input to clear', () => {
    const updateSpy = vi.fn();
    render(<GoalTracker weeklyGoal={null} latestEmissions={50} onUpdateGoal={updateSpy} />);

    const setGoalBtn = screen.getByRole('button', { name: /Set Weekly Goal/i });
    fireEvent.click(setGoalBtn);

    const input = screen.getByLabelText(/Target emissions/i);
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: '' } });

    const form = input.closest('form')!;
    fireEvent.submit(form);

    expect(updateSpy).toHaveBeenCalledWith(null);
  });
});
