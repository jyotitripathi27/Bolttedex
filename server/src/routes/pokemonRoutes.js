// Defines routes for fetching Pokemon data.

import express from 'express';
import { getAllPokemons } from '../controllers/pokemonController.js';

const router = express.Router();

router.get('/pokemons', getAllPokemons);

export default router;
