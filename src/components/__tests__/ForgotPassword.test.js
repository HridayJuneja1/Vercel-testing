const React = require('react');
import axios from 'axios';
const { render, fireEvent, waitFor, screen } = require('@testing-library/react');
require('@testing-library/jest-dom');
const ForgotPassword = require('../ForgotPassword').default;

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ data: { success: true } })),
  }));
  
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('ForgotPassword', () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  it('submits the form and displays success message', async () => {
    const mockResponse = { data: { message: 'reset_email_sent' } };
    axios.post.mockResolvedValueOnce(mockResponse);

    render(<ForgotPassword />);

    fireEvent.change(screen.getByPlaceholderText('enter_your_email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('send_reset_link'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/forgot-password', { email: 'test@example.com' });
      expect(screen.getByText('reset_email_sent')).toBeInTheDocument();
    });
  });

  it('displays an error message if the API call fails', async () => {
    axios.post.mockRejectedValueOnce(new Error('Failed to send reset email'));

    render(<ForgotPassword />);

    fireEvent.change(screen.getByPlaceholderText('enter_your_email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByText('send_reset_link'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/forgot-password', { email: 'test@example.com' });
      expect(screen.getByText('error_sending_email')).toBeInTheDocument();
    });
  });
});
