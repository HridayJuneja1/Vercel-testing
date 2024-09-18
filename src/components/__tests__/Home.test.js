import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Banner, HomeFeature, FAQSection } from '../Home';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockedNavigate,
}));

describe('Banner', () => {
  it('renders correctly and navigates on button click', () => {
    render(<Banner />);
    expect(screen.getByText('banner_title')).toBeInTheDocument();
    expect(screen.getByText('banner_description')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('browse_books'));
    expect(mockedNavigate).toHaveBeenCalledWith('/browse-books');
    
    fireEvent.click(screen.getByText('sign_up'));
    expect(mockedNavigate).toHaveBeenCalledWith('/signup');
  });
});

describe('HomeFeature', () => {
  it('renders correctly', () => {
    render(<HomeFeature />);
    expect(screen.getByText('home_feature_title')).toBeInTheDocument();
    expect(screen.getByText('home_feature_description')).toBeInTheDocument();
    expect(screen.getByText('feature_user_registration')).toBeInTheDocument();
    expect(screen.getByText('feature_book_transactions')).toBeInTheDocument();
    expect(screen.getByText('feature_advanced_features')).toBeInTheDocument();
  });
});

describe('FAQSection', () => {
  it('renders correctly', () => {
    render(<FAQSection />);
    expect(screen.getByText('faq_title')).toBeInTheDocument();
    expect(screen.getByText('faq_how_to_borrow_books')).toBeInTheDocument();
    expect(screen.getByText('faq_borrow_books_answer')).toBeInTheDocument();
  });
});
