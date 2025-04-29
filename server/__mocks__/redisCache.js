export const getFromCache = jest.fn(async (key) => {
    // Simulate returning cached data for test cases
    if (key === 'pokemon:1') {
      return { id: 1, name: 'bulbasaur', types: ['grass', 'poison'] };
    }
    return null; // default fallback
});
  
export const saveToCache = jest.fn(async (key, value) => {
    // Simulate caching behavior without doing anything
});