import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import ResetPassword from '../ResetPassword';

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { success: true, message: 'password_reset_success_message' } })),
}));

jest.mock('react-router-dom', () => ({
  useParams: () => ({
    token: 'test-reset-token',
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Mock the translation function to return the key
  }),
}));

// Mock window.alert to avoid JSDOM errors for unimplemented features
global.alert = jest.fn();

describe('ResetPassword Component', () => {
  beforeEach(() => {
    axios.post.mockClear(); // Clear any mock calls between tests
  });

  it('displays a message if passwords do not match', () => {
    render(<ResetPassword />);
    const newPasswordInput = screen.getByPlaceholderText('new_password_placeholder');
    const confirmPasswordInput = screen.getByPlaceholderText('confirm_new_password_placeholder');
    const submitButton = screen.getByText('submit_button');

    fireEvent.change(newPasswordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password1234' } });
    fireEvent.click(submitButton);

    const messageParagraph = screen.getByText('passwords_not_match_message');
    expect(messageParagraph).toBeInTheDocument();
  });

  it('submits new password when passwords match and displays success message', async () => {
    axios.post.mockResolvedValue({ data: { message: 'password_reset_success_message' } });

    render(<ResetPassword />);
    const newPasswordInput = screen.getByPlaceholderText('new_password_placeholder');
    const confirmPasswordInput = screen.getByPlaceholderText('confirm_new_password_placeholder');
    const submitButton = screen.getByText('submit_button');

    fireEvent.change(newPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    const successMessage = await screen.findByText((content, element) =>
      content.includes('password_reset_success_message')
    );
    expect(successMessage).toBeInTheDocument();
  });

  it('displays an error message on API call failure', async () => {
    axios.post.mockRejectedValue(new Error('API call failed'));

    render(<ResetPassword />);
    const newPasswordInput = screen.getByPlaceholderText('new_password_placeholder');
    const confirmPasswordInput = screen.getByPlaceholderText('confirm_new_password_placeholder');
    const submitButton = screen.getByText('submit_button');

    fireEvent.change(newPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText((content, element) =>
      content.includes('password_reset_fail_message')
    );
    expect(errorMessage).toBeInTheDocument();
  });
});
