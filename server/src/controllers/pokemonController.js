// Controller to fetch and return a list of Pokemons with limit and offset.

import fetchAllPokemon from '../services/pokeApiService.js';

const getAllPokemons = async (req, res) => {
  const { limit = 30, offset = 0 } = req.query;

  try {
    const pokemons = await fetchAllPokemon(Number(limit), Number(offset));
    if (!pokemons || pokemons.length === 0) {
      return res.status(404).json({ error: 'Pokemons not found' });
    }
    return res.json(pokemons);
  } catch (error) {
    console.log("Error ---- ", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export { getAllPokemons };