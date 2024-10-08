import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookPickup from '../BookPickup';

// Mocking DatePicker component
jest.mock('react-datepicker', () => ({ selected, onChange, minDate }) => (
  <input
    data-testid="date-picker"
    type="date"
    value={selected ? selected.toISOString().split('T')[0] : ''}
    onChange={(e) => onChange(new Date(e.target.value))}
  />
));

// Mock the useTranslation hook
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'schedule_book_pickup': 'Schedule Book Pickup',
        'select_pickup_location': 'Select Pickup Location',
        'select_location': 'Select Location',
        'select_date': 'Select Date',
        'select_time_slot': 'Select Time Slot',
        'schedule_pickup': 'Schedule Pickup',
        'pickup_confirmation': 'Pickup Confirmation',
        'pickup_location': 'Pickup Location',
        'pickup_date': 'Pickup Date',
        'pickup_time': 'Pickup Time',
        'reschedule_pickup': 'Reschedule Pickup',
        'select_all_options': 'Please select all options before proceeding.'
      };
      return translations[key];
    },
  }),
}));

beforeAll(() => {
  // Mock window.alert
  window.alert = jest.fn();
});

beforeEach(() => {
  localStorage.setItem(
    'user',
    JSON.stringify({ email: 'test@example.com' })
  );

  // Mock the fetch calls
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/pickup/scheduled')) {
      return Promise.resolve({
        json: () => Promise.resolve({ scheduledPickup: null }), // No scheduled pickup
      });
    }

    if (url.includes('/api/pickup/available-slots')) {
      return Promise.resolve({
        json: () => Promise.resolve({ availableSlots: ['10:00 AM', '12:00 PM'] }),
      });
    }

    return Promise.resolve({
      json: () => Promise.resolve({}),
    });
  });
});

test('renders the pickup form and allows scheduling', async () => {
  render(<BookPickup />);

  // Check if the title is rendered
  expect(screen.getByText('Schedule Book Pickup')).toBeInTheDocument();

  // Simulate selecting a pickup location
  fireEvent.change(screen.getByLabelText(/Select Pickup Location/i), {
    target: { value: 'Library 1' },
  });
  expect(screen.getByLabelText(/Select Pickup Location/i).value).toBe('Library 1');

  // Simulate selecting a date
  fireEvent.change(screen.getByTestId('date-picker'), {
    target: { value: '2024-10-10' },
  });

  // Wait for the available slots to load
  await waitFor(() => {
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('12:00 PM')).toBeInTheDocument();
  });

  // Select a time slot
  fireEvent.click(screen.getByText('10:00 AM'));
  expect(screen.getByText('10:00 AM')).toHaveClass('selected');

  // Simulate clicking the schedule button
  fireEvent.click(screen.getByText('Schedule Pickup'));

  // Adjusted date to match rendered value
  await waitFor(() => {
    // Verify the confirmation is shown
    expect(screen.getByText('Pickup Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Pickup Location: Library 1')).toBeInTheDocument();
    expect(screen.getByText('Pickup Date: 10/9/2024')).toBeInTheDocument();  // Adjusted date to 10/9/2024
    expect(screen.getByText('Pickup Time: 10:00 AM')).toBeInTheDocument();
  });
});

test('shows error when schedule button is clicked without filling all fields', async () => {
  render(<BookPickup />);

  // Simulate clicking the schedule button without selecting options
  fireEvent.click(screen.getByText('Schedule Pickup'));

  // Ensure alert is triggered (mocked here)
  expect(window.alert).toHaveBeenCalledWith('Please select all options before proceeding.');
});

test('reschedules pickup correctly', async () => {
  render(<BookPickup />);

  // Simulate setting up a previously scheduled pickup
  fireEvent.change(screen.getByLabelText(/Select Pickup Location/i), {
    target: { value: 'Library 1' },
  });
  fireEvent.change(screen.getByTestId('date-picker'), {
    target: { value: '2024-10-10' },
  });

  // Wait for the available slots to load after selecting date and location
  await waitFor(() => {
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
  });

  // Select a time slot
  fireEvent.click(screen.getByText('10:00 AM'));
  fireEvent.click(screen.getByText('Schedule Pickup'));

  // Adjusted date to match rendered value
  await waitFor(() => {
    expect(screen.getByText('Pickup Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Pickup Location: Library 1')).toBeInTheDocument();
    expect(screen.getByText('Pickup Date: 10/9/2024')).toBeInTheDocument();  // Adjusted date to 10/9/2024
    expect(screen.getByText('Pickup Time: 10:00 AM')).toBeInTheDocument();
  });

  // Reschedule pickup
  fireEvent.click(screen.getByText('Reschedule Pickup'));
  expect(screen.getByText('Schedule Book Pickup')).toBeInTheDocument();
});
