import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import SignUp from '../SignUp';

// Mock axios for API calls
jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: { success: true } })),
}));

// Mock react-i18next for translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock useNavigate for navigation
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock window.alert to avoid JSDOM errors for unimplemented features
global.alert = jest.fn();

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();  // Clear mocks before each test
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<SignUp />);
    expect(getByPlaceholderText('name_placeholder')).toBeInTheDocument();
    expect(getByPlaceholderText('email_placeholder')).toBeInTheDocument();
    expect(getByPlaceholderText('password_placeholder')).toBeInTheDocument();
    expect(getByPlaceholderText('confirm_password_placeholder')).toBeInTheDocument();
  });

  it('shows an alert if passwords do not match', () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    fireEvent.change(getByPlaceholderText('name_placeholder'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('email_placeholder'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('password_placeholder'), { target: { value: 'password123' } });
    fireEvent.change(getByPlaceholderText('confirm_password_placeholder'), { target: { value: 'password1234' } });

    fireEvent.click(getByText('sign_up_button'));

    expect(global.alert).toHaveBeenCalledWith('passwords_not_match_alert');
  });

  it('shows an alert if password does not meet requirements', () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    fireEvent.change(getByPlaceholderText('name_placeholder'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('email_placeholder'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('password_placeholder'), { target: { value: 'password' } });
    fireEvent.change(getByPlaceholderText('confirm_password_placeholder'), { target: { value: 'password' } });

    fireEvent.click(getByText('sign_up_button'));

    expect(global.alert).toHaveBeenCalledWith('password_requirements_alert');
  });

  it('submits the form with the provided information', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    fireEvent.change(getByPlaceholderText('name_placeholder'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('email_placeholder'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('password_placeholder'), { target: { value: 'Password123!' } });
    fireEvent.change(getByPlaceholderText('confirm_password_placeholder'), { target: { value: 'Password123!' } });

    fireEvent.click(getByText('sign_up_button'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/users/register', {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });
    });

    expect(mockedNavigate).toHaveBeenCalledWith('/signup-confirmation');
  });

  it('shows an alert if registration fails', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: 'Registration failed' } },
    });

    const { getByPlaceholderText, getByText } = render(<SignUp />);

    fireEvent.change(getByPlaceholderText('name_placeholder'), { target: { value: 'John Doe' } });
    fireEvent.change(getByPlaceholderText('email_placeholder'), { target: { value: 'john@example.com' } });
    fireEvent.change(getByPlaceholderText('password_placeholder'), { target: { value: 'Password123!' } });
    fireEvent.change(getByPlaceholderText('confirm_password_placeholder'), { target: { value: 'Password123!' } });

    fireEvent.click(getByText('sign_up_button'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Registration failed');
    });
  });
});
