import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import BookCard from '../BookCard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('BookCard', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const bookMock = {
        id: '1',
        title: 'Test Book Title',
        cover: 'test_cover.jpg',
    };

    it('renders correctly', () => {
        render(
            <BrowserRouter>
                <BookCard book={bookMock} />
            </BrowserRouter>
        );
    });

    it('navigates to the correct page on title click', () => {
        render(
            <BrowserRouter>
                <BookCard book={bookMock} />
            </BrowserRouter>
        );

        const title = screen.getByText(bookMock.title);
        fireEvent.click(title);

        expect(mockNavigate).toHaveBeenCalledWith(`/book/${bookMock.id}`);
    });
});
