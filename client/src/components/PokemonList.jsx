// Displays a grid of Pokemon with infinite scroll and a modal for Pokemon details.

import { useState, useCallback } from 'react';
import { FixedSizeGrid as Grid } from 'react-window';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPokemons } from '../api/pokemonService';
import PokemonCard from './PokemonCard';
import PokemonDetailModal from './PokemonDetailModal';

const PokemonList = () => {
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['pokemons'],
    queryFn: fetchPokemons,
    getNextPageParam: (lastPage) => lastPage?.nextPage || undefined,
  });

  const pokemons = data?.pages.flatMap((page) => page.pokemons) || [];
  const errorMessage = data?.pages?.[0]?.error;

  const columnCount = 3;
  const rowCount = Math.ceil(pokemons.length / columnCount);

  const loadMoreItems = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const windowWidth = window.innerWidth;
  const gridWidth = windowWidth > 1000 ? 950 : windowWidth - 20;  // Adjust based on screen size

  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * columnCount + columnIndex;
    const pokemon = pokemons[index];

    if (!pokemon) return null;

    return (
      <div style={style}>
        <PokemonCard pokemon={pokemon} onClick={() => setSelectedPokemon(pokemon)} />
      </div>
    );
  };

  if (isLoading) {
    return <div className="loading-message">Loading Pokemon...</div>;
  }

  if (isError || errorMessage) {
    return <div className="error-message">{errorMessage || 'Error loading Pokemon'}</div>;
  }

  if (!pokemons.length) {
    return <div className="no-pokemon-message">No Pokemon found!</div>;
  }

  return (
    <div className="pokemon-list-container">
      <Grid
        columnCount={columnCount}
        columnWidth={300}
        height={600}
        rowCount={rowCount}
        rowHeight={150}
        width={gridWidth}
        onItemsRendered={({ visibleRowStopIndex }) => {
          if ((visibleRowStopIndex + 1) * columnCount >= pokemons.length - 15) {
            loadMoreItems();
          }
        }}
      >
        {Cell}
      </Grid>

      {selectedPokemon && (
        <PokemonDetailModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
};

export default PokemonList;
