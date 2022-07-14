import { useEffect, useState } from 'react';
import * as API from './api';

const POKEDEX_SETTINGS = {
  allowMaxMoves: true,
  allowMaxPokemons: false,
  maxPokemons: 9,
  maxMoves: 4,
};

function App() {
  const [pokemonIndex, setPokemonIndex] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState();
  const [pokemonEvolutions, setPokemonEvolutions] = useState();
  const [viewedPokemons, setViewedPokemons] = useState();

  const fetchPokemon = async () => {
    const { results: pokemonList } = await API.fetchAllPokemon();
    const partialPokemonList = POKEDEX_SETTINGS.allowMaxPokemons
      ? pokemonList.length > 0 &&
        pokemonList.slice(0, POKEDEX_SETTINGS.maxPokemons)
      : pokemonList.length > 0 && pokemonList;

    setPokemon(partialPokemonList);
    setPokemonIndex(partialPokemonList);
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    if (!searchValue) {
      setPokemon(pokemonIndex);
    } else {
      setPokemon(
        pokemonIndex.filter(
          (monster) => monster.name.includes(searchValue) && monster
        )
      );
    }
  }, [pokemonIndex, searchValue]);

  const onSearchValueChange = (event) => {
    const value = event?.target?.value;
    setSearchValue(value);
    setPokemonDetails(null);
  };

  const onGetDetails = (name) => async () => {
    let selectedPokemonDetails, selectedPokemonEvolutions, viewedPokemon;
    let viewedPokemonsCache = viewedPokemons;
    let evolutionSpecies = [];

    if (!name) {
      console.error('name not provided');
      return;
    }

    const flattenEvolution = (evolvesTo) => {
      let evolutions = [];

      evolvesTo.forEach((evolution) => {
        evolutions.push(evolution?.species?.name);
        if (
          Array.isArray(evolution?.evolves_to) &&
          evolution.evolves_to.length > 0
        ) {
          evolutions = evolutions.concat(
            flattenEvolution(evolution?.evolves_to)
          );
        }
      });
      return evolutions;
    };

    viewedPokemon = viewedPokemons && viewedPokemons[name];

    if (viewedPokemon) {
      selectedPokemonDetails = viewedPokemon.details;
      selectedPokemonEvolutions = viewedPokemon.evolutions;
    } else {
      selectedPokemonDetails = await API.fetchPokemonDetailsByName(name);

      if (selectedPokemonDetails) {
        selectedPokemonEvolutions = await API.fetchEvolutionChainById(
          selectedPokemonDetails.id
        );

        if (!viewedPokemonsCache) {
          viewedPokemonsCache = {};
        }

        viewedPokemonsCache[name] = {
          details: selectedPokemonDetails,
          evolutions: selectedPokemonEvolutions,
        };

        setViewedPokemons(viewedPokemonsCache);
      }
    }

    if (selectedPokemonEvolutions) {
      evolutionSpecies.push(selectedPokemonEvolutions.chain.species.name);
      evolutionSpecies = evolutionSpecies.concat(
        flattenEvolution(selectedPokemonEvolutions.chain.evolves_to)
      );
    }

    setPokemonDetails(selectedPokemonDetails);
    setPokemonEvolutions(evolutionSpecies);
  };

  const renderPokemonList = () => {
    if (!pokemon || !Array.isArray(pokemon)) {
      return;
    }

    return (
      <div className={'pokedex__search-results'}>
        {pokemon.length > 0 ? (
          pokemon.map((monster) => {
            return (
              <div className={'pokedex__list-item'} key={monster.name}>
                <div>{monster.name}</div>
                <button onClick={onGetDetails(monster.name)}>
                  Get Details
                </button>
              </div>
            );
          })
        ) : (
          <div className={'pokedex__list-item center'}>No Results Found</div>
        )}
      </div>
    );
  };

  const renderPokemonDetails = () => {
    if (!pokemonDetails || !pokemonEvolutions) {
      return;
    }

    const { types, moves } = pokemonDetails;
    const evolutions = pokemonEvolutions;
    const partialMoves =
      moves.length > 0 &&
      POKEDEX_SETTINGS.allowMaxMoves &&
      moves.slice(0, POKEDEX_SETTINGS.maxMoves);

    return (
      <div className={pokemonDetails ? 'pokedex__details' : 'hidden'}>
        <div className={'pokemon__details-title bold'}>
          {pokemonDetails?.name}
        </div>
        <div className={'pokemon__details-header'}>
          <div className={'bold'}>Types</div>
          <div className={'bold'}>Moves</div>
        </div>
        <div className={'pokemon__details-items'}>
          <ul>
            {types?.length > 0 &&
              types?.map((item) => (
                <li key={item.type.name}>{item?.type?.name}</li>
              ))}
          </ul>
          <ul>
            {partialMoves.length > 0 &&
              partialMoves.map((move) => (
                <li key={move?.move?.name}>{move?.move?.name}</li>
              ))}
          </ul>
        </div>
        <div className={'pokemon__details-header'}>
          <div className={'bold'}>Evolutions</div>
        </div>
        <div className={'pokemon__details-items'}>
          {evolutions.length > 0 &&
            evolutions.map((evolution) => (
              <div key={evolution} className={'pokemon__details-item'}>
                {evolution}
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className={'pokedex__container'}>
      <div className={'pokedex__search-input'}>
        <input
          value={searchValue}
          onChange={onSearchValueChange}
          placeholder={'Search Pokemon'}
        />
      </div>
      <div className={'pokedex__content'}>
        {renderPokemonList()}
        {renderPokemonDetails()}
      </div>
    </div>
  );
}

export default App;
