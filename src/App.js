import { memo, useEffect, useState } from 'react';
import * as API from './api';

function App() {
  const [pokemonIndex, setPokemonIndex] = useState([]);
  const [pokemon, setPokemon] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [pokemonDetails, setPokemonDetails] = useState();
  const [pokemonEvolutions, setPokemonEvolutions] = useState();
  const [viewPokemon, setViewPokemon] = useState();
  const [viewedPokemons, setViewedPokemons] = useState();

  const fetchPokemon = async () => {
    const { results: pokemonList } = await API.fetchAllPokemon();

    setPokemon(pokemonList);
    setPokemonIndex(pokemonList);
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
    let selectedPokemonDetails, selectedPokemonEvo;
    let evolutionSpecies = [];
    let cachedPokemons = {};

    if (!name) {
      console.error('name not provided');
      return;
    }

    setViewPokemon(name);

    // TODO: delete this
    // console.clear();

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

    selectedPokemonDetails = await API.fetchPokemonDetailsByName(name);

    if (selectedPokemonDetails) {
      selectedPokemonEvo = await API.fetchEvolutionChainById(
        selectedPokemonDetails.id
      );
    }

    if (selectedPokemonEvo) {
      evolutionSpecies.push(selectedPokemonEvo.chain.species.name);
      evolutionSpecies = evolutionSpecies.concat(
        flattenEvolution(selectedPokemonEvo.chain.evolves_to)
      );
    }

    if (!viewedPokemons) {
      cachedPokemons[name] = {
        name,
        details: selectedPokemonDetails,
        evolutions: evolutionSpecies,
      };
    } else {
      cachedPokemons = viewedPokemons;
      cachedPokemons[name] = {
        name,
        details: selectedPokemonDetails,
        evolutions: evolutionSpecies,
      };
    }

    setViewedPokemons(cachedPokemons);
    setPokemonDetails(selectedPokemonDetails);
    setPokemonEvolutions(evolutionSpecies);

    // TODO: delete this
    console.log('selectedPokemonDetails: ', selectedPokemonDetails);
    console.log('selectedPokemonEvo: ', selectedPokemonEvo);
    console.log('evolutionSpecies: ', evolutionSpecies);
    console.log('viewedPokemons: ', viewedPokemons);
  };

  const pokemonList = () => {
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
    // if (!viewedPokemons) {
    //   return;
    // }

    // console.log('viewedPokemons: ', viewedPokemons);
    // console.log('viewPokemon: ', viewPokemon);
    // console.log(
    //   'viewedPokemons[viewPokemon]?.details: ',
    //   viewedPokemons[viewPokemon]?.details
    // );
    // console.log(
    //   'viewedPokemons[viewPokemon].evolutions: ',
    //   viewedPokemons[viewPokemon].evolutions
    // );

    const { types, moves } = pokemonDetails;
    const evolutions = pokemonEvolutions;
    // const { types, moves } = viewedPokemons[viewPokemon]?.details;
    // const evolutions = viewedPokemons[viewPokemon].evolutions;

    const partialMoves = moves.length > 0 && moves.slice(0, 4);

    return (
      //   <div className={pokemonDetails ? 'pokedex__details' : 'hidden'}>
      //     <div className={'pokemon__details-title bold'}>
      //       {viewedPokemons[viewPokemon]?.name}
      //     </div>
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
          onInput={onSearchValueChange}
          placeholder={'Search Pokemon'}
        />
      </div>
      <div className={'pokedex__content'}>
        {pokemonList()}
        {renderPokemonDetails()}
      </div>
    </div>
  );
}

export default memo(App);
