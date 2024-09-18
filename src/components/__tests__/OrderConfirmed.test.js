import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OrderConfirmed from '../OrderConfirmed';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('OrderConfirmed', () => {
  it('renders the order confirmation message, image, and additional info correctly', () => {
    render(<OrderConfirmed />);

    const confirmationImage = screen.getByAltText('order_confirmed');
    expect(confirmationImage).toBeInTheDocument();
    expect(confirmationImage).toHaveAttribute('src', 'https://cdn.pixabay.com/photo/2016/03/31/14/37/check-mark-1292787_1280.png');

    expect(screen.getByText('order_confirmed')).toBeInTheDocument();
    expect(screen.getByText('thank_you_for_shopping')).toBeInTheDocument();
    expect(screen.getByText('check_email_confirmation')).toBeInTheDocument();
  });
});
