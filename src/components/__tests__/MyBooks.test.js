import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header, FeatureSection } from '../MyBooks';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

describe('Header', () => {
  it('renders correctly and navigates on button click', () => {
    render(<Header />);
    expect(screen.getByText('header_title')).toBeInTheDocument();
    expect(screen.getByText('header_subtitle')).toBeInTheDocument();

    fireEvent.click(screen.getByText('browse_books_button'));
    expect(mockedNavigate).toHaveBeenCalledWith('/browse-books');
    
    fireEvent.click(screen.getByText('contact_us_button'));
    expect(mockedNavigate).toHaveBeenCalledWith('/contact');
  });
});

describe('FeatureSection', () => {
  it('renders correctly', () => {
    render(<FeatureSection />);
    expect(screen.getByText('feature_section_title')).toBeInTheDocument();
    expect(screen.getByText('feature_section_subtitle')).toBeInTheDocument();
    
    expect(screen.getByText('feature_list_wide_selection')).toBeInTheDocument();
    expect(screen.getByText('feature_list_detailed_descriptions')).toBeInTheDocument();
    expect(screen.getByText('feature_list_easy_navigation')).toBeInTheDocument();
    
    const image = screen.getByAltText('Busy city street');
    expect(image).toHaveAttribute('src', expect.stringContaining('unsplash.com'));
  });
});
