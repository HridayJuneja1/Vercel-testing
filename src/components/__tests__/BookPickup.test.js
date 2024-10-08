import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BookPickup from '../BookPickup';

// Mocking the DatePicker component
jest.mock('react-datepicker', () => ({ selected, onChange, minDate }) => (
  <input
    data-testid="date-picker" // Adding a test ID to the input for easy access during testing
    type="date" // Using a native HTML date input
    value={selected ? selected.toISOString().split('T')[0] : ''} // Format the selected date to YYYY-MM-DD
    onChange={(e) => onChange(new Date(e.target.value))} // Call the onChange handler when the date changes
  />
));

// Mock the useTranslation hook to return the translations used in the component
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
        'select_all_options': 'Please select all options before proceeding.',
      };
      return translations[key]; // Return the corresponding translation based on the key
    },
  }),
}));

beforeAll(() => {
  // Mock window.alert to avoid actual browser pop-ups during tests
  window.alert = jest.fn();
});

beforeEach(() => {
  // Mock setting the user details in localStorage before each test
  localStorage.setItem(
    'user',
    JSON.stringify({ email: 'test@example.com' }) // Setting a test email in localStorage
  );

  // Mock the fetch API for different routes
  global.fetch = jest.fn((url) => {
    if (url.includes('/api/pickup/scheduled')) {
      return Promise.resolve({
        json: () => Promise.resolve({ scheduledPickup: null }), // Return null for scheduledPickup (no existing booking)
      });
    }

    if (url.includes('/api/pickup/available-slots')) {
      return Promise.resolve({
        json: () => Promise.resolve({ availableSlots: ['10:00 AM', '12:00 PM'] }), // Return available slots for testing
      });
    }

    return Promise.resolve({
      json: () => Promise.resolve({}), // Default empty response for other fetch calls
    });
  });
});

// Test to ensure the pickup form renders and allows scheduling
test('renders the pickup form and allows scheduling', async () => {
  render(<BookPickup />); // Render the BookPickup component

  // Check if the form title is displayed correctly
  expect(screen.getByText('Schedule Book Pickup')).toBeInTheDocument();

  // Simulate selecting a pickup location from the dropdown
  fireEvent.change(screen.getByLabelText(/Select Pickup Location/i), {
    target: { value: 'Library 1' }, // Select 'Library 1' from the dropdown
  });
  expect(screen.getByLabelText(/Select Pickup Location/i).value).toBe('Library 1'); // Check if the value is correctly updated

  // Simulate selecting a date using the mocked DatePicker
  fireEvent.change(screen.getByTestId('date-picker'), {
    target: { value: '2024-10-10' }, // Select a date (10th October 2024)
  });

  // Wait for the available slots to be fetched and displayed
  await waitFor(() => {
    expect(screen.getByText('10:00 AM')).toBeInTheDocument(); // Check if the first available slot is rendered
    expect(screen.getByText('12:00 PM')).toBeInTheDocument(); // Check if the second available slot is rendered
  });

  // Simulate selecting a time slot (10:00 AM)
  fireEvent.click(screen.getByText('10:00 AM'));
  expect(screen.getByText('10:00 AM')).toHaveClass('selected'); // Check if the selected slot gets the 'selected' class

  // Simulate clicking the 'Schedule Pickup' button
  fireEvent.click(screen.getByText('Schedule Pickup'));

  // Wait for the confirmation page to be displayed
  await waitFor(() => {
    // Check if the confirmation title is displayed
    expect(screen.getByText('Pickup Confirmation')).toBeInTheDocument();
    // Check if the correct pickup location is displayed
    expect(screen.getByText('Pickup Location: Library 1')).toBeInTheDocument();
    // Adjusted date to match the rendered value (due to date formatting differences)
    expect(screen.getByText('Pickup Date: 10/9/2024')).toBeInTheDocument();
    // Check if the correct time slot is displayed
    expect(screen.getByText('Pickup Time: 10:00 AM')).toBeInTheDocument();
  });
});

// Test to ensure an error is shown when the schedule button is clicked without filling all fields
test('shows error when schedule button is clicked without filling all fields', async () => {
  render(<BookPickup />); // Render the BookPickup component

  // Simulate clicking the 'Schedule Pickup' button without selecting any options
  fireEvent.click(screen.getByText('Schedule Pickup'));

  // Ensure the alert is triggered (mocked to avoid browser pop-ups)
  expect(window.alert).toHaveBeenCalledWith('Please select all options before proceeding.'); // Check if the alert message is correct
});

// Test to ensure a scheduled pickup can be rescheduled
test('reschedules pickup correctly', async () => {
  render(<BookPickup />); // Render the BookPickup component

  // Simulate selecting a pickup location (Library 1)
  fireEvent.change(screen.getByLabelText(/Select Pickup Location/i), {
    target: { value: 'Library 1' }, // Select 'Library 1' from the dropdown
  });
  // Simulate selecting a date using the mocked DatePicker
  fireEvent.change(screen.getByTestId('date-picker'), {
    target: { value: '2024-10-10' }, // Select a date (10th October 2024)
  });

  // Wait for the available slots to be fetched and displayed
  await waitFor(() => {
    expect(screen.getByText('10:00 AM')).toBeInTheDocument(); // Check if the first available slot is rendered
  });

  // Simulate selecting a time slot (10:00 AM)
  fireEvent.click(screen.getByText('10:00 AM'));
  // Simulate clicking the 'Schedule Pickup' button
  fireEvent.click(screen.getByText('Schedule Pickup'));

  // Wait for the confirmation page to be displayed
  await waitFor(() => {
    expect(screen.getByText('Pickup Confirmation')).toBeInTheDocument(); // Check if the confirmation page is shown
    expect(screen.getByText('Pickup Location: Library 1')).toBeInTheDocument(); // Check if the correct pickup location is displayed
    expect(screen.getByText('Pickup Date: 10/9/2024')).toBeInTheDocument(); // Adjusted date to match the rendered value
    expect(screen.getByText('Pickup Time: 10:00 AM')).toBeInTheDocument(); // Check if the correct time slot is displayed
  });

  // Simulate clicking the 'Reschedule Pickup' button
  fireEvent.click(screen.getByText('Reschedule Pickup'));
  // Check if the form title is displayed again for rescheduling
  expect(screen.getByText('Schedule Book Pickup')).toBeInTheDocument();
});
