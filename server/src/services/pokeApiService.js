
import axios from 'axios';
import { getFromCache, saveToCache } from '../cache/redisCache.js';
import { POKEDEX_TO_REGION_MAP } from '../constants/regionMapping.js';

const POKE_API_URL = process.env.POKE_API_URL;
const POKE_SPECIES_URL = process.env.POKE_SPECIES_URL;
const POKE_TYPE_URL = process.env.POKE_TYPE_URL;

/**
 * Fetches detailed Pokemon data by ID, including types, images, weaknesses, and region.
 * Utilizes Redis caching for optimization.
 *
 * @param {number} id - The Pokemon's unique identifier.
 * @returns {Promise<Object>} The Pokemon data object or an error object.
 */
const fetchPokemonData = async (id) => {
    try {
        const cacheKey = `pokemon:${id}`;
        const cachedData = await getFromCache(cacheKey);
        if (cachedData) return cachedData;

        const [pokemonResponse, speciesResponse] = await Promise.all([
            axios.get(`${POKE_API_URL}/${id}`),
            axios.get(`${POKE_SPECIES_URL}/${id}`)
        ]);

        const pokemon = {
            id: pokemonResponse.data.id,
            name: pokemonResponse.data.name,
            types: pokemonResponse.data.types.map(type => type.type.name),
            frontImage: pokemonResponse.data.sprites.front_default,
            backImage: pokemonResponse.data.sprites.back_default,
            weaknesses: await getTypeWeaknesses(pokemonResponse.data.types.map(type => type.type.name)),
            region: getRegionBySpeciesData(speciesResponse.data)
        };

        await saveToCache(cacheKey, pokemon);
        return pokemon;
    } catch (error) {
        console.error(`Error fetching pokemon id ${id}:`, error.message || error);
        return null; // Returning null, instead of throwing error to gracefully handle if a Pokemon ID doesn’t exist
    }
};

/**
 * Fetches and computes type weaknesses for a given set of Pokemon types.
 * @param {string[]} types - Array of Pokemon type names.
 * @returns {Promise<string[]>} List of effective weaknesses.
 */
const getTypeWeaknesses = async (types) => {
    try {
        const typeDataResponses = await Promise.all(
            types.map(type => axios.get(`${POKE_TYPE_URL}/${type}`))
        );

        const weaknessesSet = new Set();
        const resistancesSet = new Set();
        const immunitiesSet = new Set();
        const halfDamageSet = new Set();

        typeDataResponses.forEach(response => {
            const damageRelations = response.data.damage_relations;

            damageRelations.double_damage_from.forEach(type => weaknessesSet.add(type.name));
            damageRelations.double_damage_to.forEach(type => resistancesSet.add(type.name));
            damageRelations.no_damage_from.forEach(type => immunitiesSet.add(type.name));
            damageRelations.half_damage_from.forEach(type => halfDamageSet.add(type.name));
        });

        weaknessesSet.forEach(weakness => {
            if (resistancesSet.has(weakness) || immunitiesSet.has(weakness) || halfDamageSet.has(weakness)) {
                weaknessesSet.delete(weakness);
            }
        });

        return Array.from(weaknessesSet);
    } catch (error) {
        console.error('Error fetching type weaknesses:', error);
        return [];
    }
};

/**
 * Determines the Pokemon's region based on species data.
 * @param {Object} speciesData
 * @returns {string} Region name
 */
const getRegionBySpeciesData = (speciesData) => {
    const pokedexEntries = speciesData.pokedex_numbers || [];

    for (const entry of pokedexEntries) {
        const pokedexName = entry.pokedex?.name;
        if (pokedexName && pokedexName !== "national") {
            return POKEDEX_TO_REGION_MAP[pokedexName] || "Unknown";
        }
    }
    return "Unknown";
};

/**
 * Fetches multiple Pokemon by limit and offset.
 * @param {number} limit 
 * @param {number} offset 
 * @returns {Promise<Object[]>}
 */
const fetchAllPokemon = async (limit = 30, offset = 0) => {
    const promises = Array.from({ length: limit }, (_, i) => fetchPokemonData(i + offset + 1));
    
    const results = await Promise.allSettled(promises);

    const successfulPokemons = results
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => result.value);

    return successfulPokemons;
};

export default fetchAllPokemon;
