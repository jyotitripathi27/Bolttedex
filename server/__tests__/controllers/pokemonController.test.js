import { beforeAll, jest } from '@jest/globals';
// Use top-level await as ESModules require
import request from 'supertest';
import express from 'express';

// Mock the service before importing the controller
const mockFetchAllPokemon = jest.fn();

await jest.unstable_mockModule('../../src/services/pokeApiService.js', () => ({
  default: mockFetchAllPokemon
}));

// Import controller after mocking
const { getAllPokemons } = await import('../../src/controllers/pokemonController.js');

// Setup Express app and route for isolated testing
const app = express();
app.get('/api/pokemons', getAllPokemons);

describe('GET /api/pokemons', () => {
  it('should return a list of pokemons with status 200', async () => {
    const mockPokemons = [
      { id: 1, name: 'bulbasaur' },
      { id: 2, name: 'ivysaur' }
    ];

    mockFetchAllPokemon.mockResolvedValue(mockPokemons);

    const res = await request(app).get('/api/pokemons?limit=2&offset=0');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockPokemons);
    expect(mockFetchAllPokemon).toHaveBeenCalledWith(2, 0);
  });

  it('should return 404 if no pokemons found', async () => {
    mockFetchAllPokemon.mockResolvedValue([]);

    const res = await request(app).get('/api/pokemons?limit=2&offset=0');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Pokemons not found' });
  });

  it('should return 500 on internal server error', async () => {
    mockFetchAllPokemon.mockRejectedValue(new Error('Unexpected error'));

    const res = await request(app).get('/api/pokemons');

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal server error' });
  });
});
