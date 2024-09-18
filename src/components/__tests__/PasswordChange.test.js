import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import PasswordChange from '../PasswordChange';

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ data: { success: true } })),
  }));

  jest.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key) => key,
    }),
  }));
  
describe('PasswordChange Component', () => {
  beforeEach(() => {
    axios.post.mockClear();
  });

  it('alerts passwords do not match when newPassword and confirmPassword are different', () => {
    window.alert = jest.fn();

    render(<PasswordChange />);

    const newPasswordInput = screen.getByPlaceholderText('new_password_placeholder');
    const confirmPasswordInput = screen.getByPlaceholderText('confirm_new_password_placeholder');
    const submitButton = screen.getByText('submit_button');

    fireEvent.change(newPasswordInput, { target: { value: 'newPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPassword1234' } });
    
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith('passwords_dont_match_alert');
  });

  it('submits the form when passwords match', async () => {
    axios.post.mockResolvedValue({ data: { success: true } });
    window.alert = jest.fn();

    render(<PasswordChange />);

    const emailInput = screen.getByPlaceholderText('email_placeholder');
    const oldPasswordInput = screen.getByPlaceholderText('old_password_placeholder');
    const newPasswordInput = screen.getByPlaceholderText('new_password_placeholder');
    const confirmPasswordInput = screen.getByPlaceholderText('confirm_new_password_placeholder');
    const submitButton = screen.getByText('submit_button');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(oldPasswordInput, { target: { value: 'oldPassword123' } });
    fireEvent.change(newPasswordInput, { target: { value: 'newPassword123' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'newPassword123' } });
    
    fireEvent.click(submitButton);
  });
});
