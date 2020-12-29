import { render, screen } from '@testing-library/react';
import LobbyApp from './LobbyApp';

test('renders learn react link', () => {
  render(<LobbyApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
