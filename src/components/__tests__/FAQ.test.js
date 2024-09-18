import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FAQ from '../FAQ';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, { returnObjects } = {}) => {
      if (key === 'faq_questions' && returnObjects) {
        return [
          { question: 'What is React?', answer: 'A JavaScript library for building user interfaces.' },
          { question: 'Why use React?', answer: 'It’s flexible and efficient.' },
        ];
      }
      if (key === 'faq_title') {
        return 'Frequently Asked Questions';
      }
      return key;
    },
  }),
}));

describe('FAQ Component Tests', () => {
  it('should render FAQ title and questions', () => {
    const { getByText } = render(<FAQ />);

    expect(getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(getByText('What is React?')).toBeInTheDocument();
    expect(getByText('Why use React?')).toBeInTheDocument();
  });

  it('should toggle FAQ answer visibility on question click', () => {
    const { getByText, queryByText } = render(<FAQ />);

    const answerText = 'A JavaScript library for building user interfaces.';

    const initiallyHiddenAnswer = queryByText(answerText);
    expect(initiallyHiddenAnswer).not.toBeVisible(); 

    fireEvent.click(getByText('What is React?'));
    expect(queryByText(answerText)).toBeVisible();

    fireEvent.click(getByText('What is React?'));
    expect(queryByText(answerText)).not.toBeVisible();
});
});