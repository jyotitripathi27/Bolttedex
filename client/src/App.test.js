import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a fresh QueryClient for each test to avoid state sharing
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries to make failures clearer
      },
    },
  });

test('renders App component', () => {
  const queryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );

  // Expect your test logic here (this is a placeholder)
  const titleElement = screen.getByText(/Bolttedex/i);
  expect(titleElement).toBeInTheDocument();
});
