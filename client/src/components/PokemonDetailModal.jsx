// Modal component displaying detailed information of a selected Pokemon.

const PokemonDetailModal = ({ pokemon, onClose }) => {
  if (!pokemon) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <img className="modal-image" src={pokemon.frontImage} alt={pokemon.name} />
        {pokemon.backImage && (
          <img className="modal-image" src={pokemon.backImage} alt={`${pokemon.name} back`} />
        )}
        <h2>{pokemon.name} <span className="pokemon-id">#{pokemon.id}</span></h2>
        <p><strong>Type:</strong></p>
        <div className="pokemon-types">
          {pokemon.types.map((type) => (
            <span key={type} className={`type-badge type-${type.toLowerCase()}`}>{type}</span>
          ))}
        </div>
      
        <p><strong>Weaknesses:</strong></p>
        <div className="pokemon-types">
          {pokemon.weaknesses.map((weakness) => (
            <span key={weakness} className={`type-badge type-${weakness.toLowerCase()}`}>{weakness}</span>
          ))}
        </div>
        <p><strong>Region:</strong> {pokemon.region}</p>
      </div>
    </div>
  );
}
export default PokemonDetailModal;
