import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavBar from '../NavBar';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
    },
  }),
}));

const setupLocalStorageMock = (user) => {
  const mockLocalStorage = {
    getItem: jest.fn((key) => key === 'user' ? JSON.stringify(user) : null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
  });
  return mockLocalStorage;
};
beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        set href(url) {
          this._href = url;
        },
        get href() {
          return this._href || "http://localhost/";
        },
        replace: jest.fn(),
      },
      writable: true,
    });
  });
  

describe('NavBar Component', () => {
  test('renders correctly for authenticated users', () => {
    setupLocalStorageMock({ name: 'John Doe' });
    render(<NavBar />);
    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText('logout')).toBeInTheDocument();
  });

  test('renders correctly for unauthenticated users', () => {
    setupLocalStorageMock(null);
    render(<NavBar />);
    expect(screen.getByText('log_in')).toBeInTheDocument();
    expect(screen.getByText('sign_up')).toBeInTheDocument();
  });

  test('changes language on button click and updates localStorage', () => {
    const mockLocalStorage = setupLocalStorageMock(null);
    render(<NavBar />);
    fireEvent.click(screen.getByText('EN'));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('language', 'en');
  });

  test('logs out user on logout button click', () => {
    setupLocalStorageMock({ name: 'John Doe' });
    render(<NavBar />);
    fireEvent.click(screen.getByText('logout'));
    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(window.location.href).toBe('/login');
  });
  
});
