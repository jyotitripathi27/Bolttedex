// Displays a Pokemon card with its front image, name, and types.

import {useState, useEffect} from 'react';

const PokemonCard = ({ pokemon, onClick }) => {
  const [isFrontImageLoaded, setIsFrontImageLoaded] = useState(false);

  useEffect(() => {
    // Preloading back image when the card is mounted for ensuring that the back image loads instantly when the modal is triggered
    const frontImage = new Image();
    const backImage = new Image();

    frontImage.src = pokemon.frontImage;
    backImage.src = pokemon.backImage;

    frontImage.onload = () => setIsFrontImageLoaded(true);
    frontImage.onerror = () => setIsFrontImageLoaded(false);
  }, [pokemon]);

  return (
    <div className="pokemon-card" onClick={onClick}>
      <img
        src={pokemon.frontImage}
        alt={pokemon.name}
        className={`pokemon-image ${isFrontImageLoaded ? '' : 'loading image'}`}
      />
      <div className="pokemon-info">
        <h3 className="pokemon-name">{pokemon.name}</h3>
        <div className="pokemon-types">
          {pokemon.types.map((type) => (
            <span key={type} className={`type-badge type-${type.toLowerCase()}`}>{type}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
