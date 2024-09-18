import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerificationSuccess from '../VerificationSuccess';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: key => key }),
}));

describe('VerificationSuccess', () => {
  it('renders verification success message', () => {
    render(<VerificationSuccess />);
    
    expect(screen.getByText('account_verified')).toBeInTheDocument();
    expect(screen.getByText('account_verified_message')).toBeInTheDocument();
  });
});
