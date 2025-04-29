import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const fetchPokemons = async ({ pageParam = 0 }) => {
  const limit = 30;
  const offset = pageParam * limit;

  try {
    const response = await axios.get(`${BASE_URL}/pokemons?limit=${limit}&offset=${offset}`);
    const data = response.data;
    return {
      pokemons: data,
      nextPage: data.length === limit ? pageParam + 1 : undefined,
    };
  } catch (error) {
    const errorMessage = `Failed to load pokemons. Please try again later.`;
    return {
      pokemons: [],
      nextPage: undefined,
      error: errorMessage
    };
  }
};

