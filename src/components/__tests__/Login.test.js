import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('Login Component', () => {
  const renderLoginComponent = () =>
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

  it('renders correctly', () => {
    const { getByText } = renderLoginComponent();
    expect(getByText('login_title')).toBeInTheDocument();
    expect(getByText('login_button')).toBeInTheDocument();
  });

  it('allows entering email and password', () => {
    const { getByPlaceholderText } = renderLoginComponent();
    const emailInput = getByPlaceholderText('email_placeholder');
    const passwordInput = getByPlaceholderText('password_placeholder');

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password' } });

    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('password');
  });

  it('displays alert on successful login', async () => {
    axios.post.mockResolvedValueOnce({ data: { authenticated: true, user: { id: 1, name: 'John Doe' } } });
    global.alert = jest.fn();

    const { getByText, getByPlaceholderText } = renderLoginComponent();
    const loginButton = getByText('login_button');

    fireEvent.change(getByPlaceholderText('email_placeholder'), { target: { value: 'user@example.com' } });
    fireEvent.change(getByPlaceholderText('password_placeholder'), { target: { value: 'password' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('login_successful');
    });
  });

  it('displays alert on login failure due to invalid credentials', async () => {
    axios.post.mockRejectedValueOnce({ response: { data: { error: 'Invalid credentials' } } });
    global.alert = jest.fn();

    const { getByText, getByPlaceholderText } = renderLoginComponent();
    const loginButton = getByText('login_button');

    fireEvent.change(getByPlaceholderText('email_placeholder'), { target: { value: 'wrong@example.com' } });
    fireEvent.change(getByPlaceholderText('password_placeholder'), { target: { value: 'wrong' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('login_failed_errorInvalid credentials'));
    });
  });
});
