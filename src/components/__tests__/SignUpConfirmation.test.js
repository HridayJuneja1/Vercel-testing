import React from 'react';
import { render } from '@testing-library/react';
import SignUpConfirmation from '../SignUpConfirmation';
import '@testing-library/jest-dom';
import { useTranslation } from 'react-i18next';

jest.mock('react-i18next');

describe('SignUpConfirmation Component', () => {
  it('renders correctly', () => {
    useTranslation.mockReturnValue({
      t: (key) => key,
    });

    const { getByText } = render(<SignUpConfirmation />);

    expect(getByText('registration_successful')).toBeInTheDocument();
    expect(getByText('check_email_verification')).toBeInTheDocument();
  });
});