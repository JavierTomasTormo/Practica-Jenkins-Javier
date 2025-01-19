import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders main heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/React Jenkins Demo/i);
  expect(headingElement).toBeInTheDocument();
});

test('counter increments when button is clicked', () => {
  render(<App />);
  const button = screen.getByText(/Increment/i);
  const counterBefore = screen.getByText(/Counter: 0/i);
  expect(counterBefore).toBeInTheDocument();
  
  fireEvent.click(button);
  const counterAfter = screen.getByText(/Counter: 1/i);
  expect(counterAfter).toBeInTheDocument();
});

test('message input updates correctly', () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Enter a message/i);
  fireEvent.change(input, { target: { value: 'Test message' } });
  const message = screen.getByText(/Your message: Test message/i);
  expect(message).toBeInTheDocument();
});
