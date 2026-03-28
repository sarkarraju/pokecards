const API_BASE = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=150";

let pokemonDetailsData = localStorage.getItem("pokemonDetailsData")
  ? JSON.parse(localStorage.getItem("pokemonDetailsData"))
  : [];

//? ========================= Fetching All Pokemon Data =========================
async function getAllPokemons() {
  const res = await fetch(API_BASE);
  const data = await res.json();
  return data.results;
}

// ? ========================= Fetch Single Pokemon =========================
async function getSinglePoke(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

if (!pokemonDetailsData.length) {
  // * Get all pokemons data
  const allPokemons = await getAllPokemons();

  // * Preparing promise array with all pokemons
  const pokePromiseArray = allPokemons.map((pokemon) => {
    return getSinglePoke(pokemon.url);
  });

  // * Retrieving all promises at once
  const pokemonDetails = await Promise.all(pokePromiseArray);

  pokemonDetailsData = pokemonDetails.map((pokemon) => {
    return {
      name: pokemon.name,
      image:
        pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default,
    };
  });

  localStorage.setItem("pokemonDetailsData", JSON.stringify(pokemonDetailsData));
}

function renderCards(pokemonDetailsData) {
  // * Container
  const container = document.querySelector(".container");

  // * Card Wrapper
  const cardWrapper = document.querySelector(".card_wrapper");

  pokemonDetailsData.forEach((pokemon, index) => {
    // * Card Cloning
    const cardWrapperClone = cardWrapper.cloneNode(true);

    // * Data Mapping to Card
    cardWrapperClone.classList.remove("card_wrapper");
    cardWrapperClone.querySelector(".card .name").textContent = pokemon.name;
    cardWrapperClone.querySelector(".card .Sl_no").textContent = String(index + 1).padStart(3, "0");
    cardWrapperClone.querySelector(".card .image .poke_img").src = pokemon.image;

    // * Appending card to the container
    container.append(cardWrapperClone);
  });

  // * Hiding the default card
  cardWrapper.style.display = "none";
}

renderCards(pokemonDetailsData);
