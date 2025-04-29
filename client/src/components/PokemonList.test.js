import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PokemonList from '../components/PokemonList';
import * as pokemonService from '../api/pokemonService';
import userEvent from '@testing-library/user-event';

// Mock fetchPokemons function
jest.mock('../api/pokemonService');

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithQueryClient = (ui) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

test('shows loading message while fetching pokemons', async () => {
    pokemonService.fetchPokemons.mockReturnValue(
      new Promise(() => {}) // Never resolves
    );
  
    renderWithQueryClient(<PokemonList />);
    expect(screen.getByText(/loading pokemon/i)).toBeInTheDocument();
});
  
test('shows error message if API fails', async () => {
    pokemonService.fetchPokemons.mockRejectedValue(new Error('Network error'));
  
    renderWithQueryClient(<PokemonList />);
  
    await waitFor(() =>
      expect(screen.getByText(/error loading pokemon/i)).toBeInTheDocument()
    );
});
  
test('shows message when no pokemons are returned', async () => {
    pokemonService.fetchPokemons.mockResolvedValue({
      pokemons: [],
      nextPage: undefined,
    });
  
    renderWithQueryClient(<PokemonList />);
  
    await waitFor(() =>
      expect(screen.getByText(/no pokemon found/i)).toBeInTheDocument()
    );
});

test('renders a grid of pokemons', async () => {
    pokemonService.fetchPokemons.mockResolvedValue({
      pokemons: [
        { id: 1, name: 'bulbasaur', types: ['t1', 't2'] },
        { id: 2, name: 'ivysaur', types: ['t1', 't2'] },
        { id: 3, name: 'venusaur', types: ['t1', 't2'] },
      ],
      nextPage: undefined,
    });
  
    renderWithQueryClient(<PokemonList />);
  
    // Wait until some Pokemon cards are rendered
    await waitFor(() =>
      expect(screen.getAllByRole('img').length).toBeGreaterThan(0)
    );
});
  
test('opens modal when a Pokemon card is clicked', async () => {
    pokemonService.fetchPokemons.mockResolvedValue({
      pokemons: [{ id: 1, name: 'pikachu', types: ['t1', 't2'] }],
      nextPage: undefined,
    });
  
    renderWithQueryClient(<PokemonList />);
  
    const pokemonCard = await screen.findByText(/pikachu/i);
    userEvent.click(pokemonCard);
  
    await waitFor(() =>
      expect(screen.getByText(/pikachu/i)).toBeInTheDocument()
    );
});
  