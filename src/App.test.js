import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Paavan storefront', async () => {
  render(<App />);
  expect(await screen.findByText(/aavan/i)).toBeInTheDocument();
});
