const React = require('react');
const { render, fireEvent, waitFor, screen } = require('@testing-library/react');
const Checkout = require('../Checkout').default;

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: 'Order confirmed!' }),
  })
);

window.alert = jest.fn();

describe('Checkout Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Order confirmed!' }),
          })
        );
        window.alert = jest.fn();
      });      

  it('submits the form with valid data and shows a confirmation alert', async () => {
    render(<Checkout />);

    fireEvent.change(screen.getByPlaceholderText('first_name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('last_name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('email_address'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('phone_number'), { target: { value: '1234567890' } });
    
    fireEvent.click(screen.getByText('submit_order'));
  });

  it('submits the form with valid data and shows a confirmation alert', async () => {
    render(<Checkout />);
  
    fireEvent.change(screen.getByPlaceholderText('first_name'), { target: { value: 'John' } });
    fireEvent.change(screen.getByPlaceholderText('last_name'), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByPlaceholderText('email_address'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('phone_number'), { target: { value: '1234567890' } });
  
    fireEvent.click(screen.getByText('submit_order'));
  
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  
    expect(window.alert).toHaveBeenCalledWith('Order confirmed!');
    });
});