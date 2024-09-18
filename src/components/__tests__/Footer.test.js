import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../Footer';

// Mock the i18n translations
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key, // Mock translation function
  }),
}));

describe('Footer Component', () => {
  it('renders the footer component correctly', () => {
    render(<Footer />);

    // Check if the main title is rendered
    expect(screen.getByText('footer_title')).toBeInTheDocument();

    // Check if the description and reserved rights are rendered
    expect(screen.getByText('footer_description')).toBeInTheDocument();
    expect(screen.getByText('rights_reserved')).toBeInTheDocument();

    // Check if the quick links section is rendered
    expect(screen.getByText('quick_links')).toBeInTheDocument();
    expect(screen.getByText('home')).toBeInTheDocument();
    expect(screen.getByText('catalog')).toBeInTheDocument();
    expect(screen.getByText('your_cart')).toBeInTheDocument();

    // Check if the connect section is rendered
    expect(screen.getByText('connect')).toBeInTheDocument();
    expect(screen.getByText('facebook')).toBeInTheDocument();
    expect(screen.getByText('instagram')).toBeInTheDocument();
    expect(screen.getByText('twitter')).toBeInTheDocument();

    // Check if the copyright text is rendered
    expect(screen.getByText('copyright')).toBeInTheDocument();
  });

  it('renders links correctly', () => {
    render(<Footer />);

    // Check if the links have the correct href attributes
    expect(screen.getByText('home')).toHaveAttribute('href', '/');
    expect(screen.getByText('catalog')).toHaveAttribute('href', '/MyBooks');
    expect(screen.getByText('your_cart')).toHaveAttribute('href', '/cart');
    expect(screen.getByText('facebook')).toHaveAttribute('href', 'https://facebook.com');
    expect(screen.getByText('instagram')).toHaveAttribute('href', 'https://instagram.com');
    expect(screen.getByText('twitter')).toHaveAttribute('href', 'https://twitter.com');
  });
});
