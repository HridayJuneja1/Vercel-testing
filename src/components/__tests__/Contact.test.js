import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Contact from '../Contact';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ message: 'Message sent successfully' }),
    })
  );

  fetch.mockClear();
  window.alert = jest.fn();
});

describe('<Contact />', () => {
  test('renders and can change inputs', () => {
    render(<Contact />);

    const nameInput = screen.getByLabelText('name_label');
    const emailInput = screen.getByLabelText('email_label');
    const messageTextarea = screen.getByLabelText('message_label');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageTextarea, { target: { value: 'Hello there!' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(messageTextarea.value).toBe('Hello there!');
  });

  test('submits the form and displays alert on success', async () => {
    render(<Contact />);
    const submitButton = screen.getByText('send_button');

    fireEvent.change(screen.getByLabelText('name_label'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('email_label'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('message_label'), { target: { value: 'Hello there!' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('Message sent successfully');
    });
  });

  test('displays error alert when submission fails', async () => {
    fetch.mockImplementationOnce(() => Promise.reject(new Error('Network error')));

    render(<Contact />);
    const submitButton = screen.getByText('send_button');

    fireEvent.change(screen.getByLabelText('name_label'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('email_label'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('message_label'), { target: { value: 'A test message' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith('Failed to send the message. Please try again later.');
    });
  });
});
