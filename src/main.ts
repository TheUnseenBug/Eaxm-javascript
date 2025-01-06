//Speciellt sätt för att importera css när man använder vite.
import "./style.css";
import axios from "axios";
import Movie from "./scripts/types";
let popularMovies: Movie[] = [];
//Cache nyckel och hur länge cache ska vara aktiv
const cacheKey = 'popularMoviesCache';
const cacheExpiration = 1000 * 60 * 60; // 1000ms * 60 = 1m * 60 = 1h 

//Eventlistener för sökknappen till sökfunktionen
document.getElementById('search-button')?.addEventListener('click', async () => {
  const query = (document.getElementById('search-input') as HTMLInputElement).value;
  if (query) {
    const searchResults = await searchMovies(query);
    await displayMovies(searchResults);
  }
});


//Hämtar populära filmer från API
async function getPopularMovies() {
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    if (Date.now() - timestamp < cacheExpiration) {
      popularMovies = data;
      await displayMovies(popularMovies);
      return;
    }
  }
  const popular = await axios({
    method: "get",
    url: "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjVmMjdlN2NmYzQ4NGJhZTQyM2UxNDQyYjkxNmUxNiIsIm5iZiI6MTcwMDY5NDA1MC44NjA5OTk4LCJzdWIiOiI2NTVlODgyMjdkZmRhNjAxMWJhZTUxNmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GWVFB8R4UZZayQOVqkvIeLtUbhdkUBQrBJnMOkYYYwQ",
    },
  });
  //Om popularMovies finns i cache så hämtas den därifrån annars hämtas den från API
  if (popular) {
    const data = await popular.data;
    popularMovies = data.results;
    //Sparar popularMovies i cache
    localStorage.setItem(cacheKey, JSON.stringify({ data: popularMovies, timestamp: Date.now() }));
    await displayMovies(popularMovies);
  } else {
    console.error("Failed to fetch popular movies");
  }
}
//Sökfunktion för att söka efter filmer
async function searchMovies(query: string): Promise<Movie[]> {
  const response = await axios({
    method: "get",
    url: `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjVmMjdlN2NmYzQ4NGJhZTQyM2UxNDQyYjkxNmUxNiIsIm5iZiI6MTcwMDY5NDA1MC44NjA5OTk4LCJzdWIiOiI2NTVlODgyMjdkZmRhNjAxMWJhZTUxNmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GWVFB8R4UZZayQOVqkvIeLtUbhdkUBQrBJnMOkYYYwQ`,
    },
  });
  if (response) {
    const data = await response.data;
    return data.results.slice(0, 9);
  } else {
    console.error("Failed to fetch search results");
    return [];
  }

}
getPopularMovies();

//Funktion för att konvertera datum till svenskt format
function convertDate(dateString: string) {
  var date = new Date(dateString);
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}

//Funktion för att hantera genre data från API och returnera en array med genres i textformat
function handleGenre(genreIds: number[]) {
  //Lägger in en array med genreid i en switch case som bestämmer genre
  const genres = genreIds.map((genreId) => {
    switch (genreId) {
      case 28:
        return "Action";
      case 12:
        return "Adventure";
      case 16:
        return "Animation";
      case 35:
        return "Comedy";
      case 80:
        return "Crime";
      case 99:
        return "Documentary";
      case 18:
        return "Drama";
      case 10751:
        return "Family";
      case 14:
        return "Fantasy";
      case 36:
        return "History";
      case 27:
        return "Horror";
      case 10402:
        return "Music";
      case 9648:
        return "Mystery";
      case 10749:
        return "Romance";
      case 878:
        return "Science Fiction";
      case 10770:
        return "TV Movie";
      case 53:
        return "Thriller";
      case 10752:
        return "War";
      case 37:
        return "Western";
      default:
        return "Unknown Genre";
    }
  });

  return genres; // Returnerar en array med genres
}

//Funktion för att rendera filmer på sidan
async function displayMovies(movies: Movie[]) {
  const wrapper = document.querySelector(".wrapper") as HTMLElement;
  wrapper.innerHTML = "";
  movies.forEach(async (movie) => {
    // Create movie elements
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const description = document.createElement("p");
    //FixME - Fixa så att descriptionen inte blir för lång
    const desc = movie.overview.slice(0, 500);
    description.textContent = desc
    description.className = "description";

    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";


    const image = document.createElement("img");
    image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    image.alt = `${movie.title} poster`;

    const releaseDate = document.createElement("p");
    const newReleaseDate = convertDate(movie.release_date);
    releaseDate.textContent = `Release Date: ${newReleaseDate}`;

    const genre = document.createElement("p");
    const movieGenresTest = handleGenre(movie.genre_ids);
    genre.textContent = `Genres: ${movieGenresTest} `;

    const favorite = document.createElement("button");
    if (checkIfFavorite(movie)) {
      favorite.textContent = "Unfavorite";
      favorite.style.backgroundColor = "AA4846"
    }
    else {
      favorite.textContent = "Favorite";
    }
    favorite.className = "favorite";

    // Append elements to movie container
    imageContainer.appendChild(image);
    imageContainer.appendChild(description);
    card.appendChild(title);
    card.appendChild(releaseDate);
    card.appendChild(genre);
    card.appendChild(imageContainer);
    card.appendChild(favorite);
    wrapper.appendChild(card);

    imageContainer.addEventListener("mouseover", () => {
      description.style.display = "flex";
    });

    imageContainer.addEventListener("mouseout", () => {
      description.style.display = "none";
    });

    favorite.addEventListener("click", () => {
      if (checkIfFavorite(movie)) {
        removeFromLocalStorage(movie);
        favorite.textContent = "Favorite";
        favorite.style.backgroundColor = "323C56";
      } else {
        addToLocalStorage(movie);
        favorite.style.backgroundColor = "AA4846";
        favorite.textContent = "Unfavorite";
      }
    });
  });
}

//Funktion för att kolla om en film är favorit i localstorage
function checkIfFavorite(movie: Movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  return favorites.some((fav: Movie) => fav.id === movie.id);
}

//Funktion för att lägga till en favorit i localstorage
function addToFavorites(movie: Movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  favorites.push(movie);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

//Funktion för att ta bort en favorit från localstorage
function removeFromFavorites(movie: Movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const newFavorites = favorites.filter((fav: Movie) => fav.id !== movie.id);
  localStorage.setItem("favorites", JSON.stringify(newFavorites));
}

//Funktion för att lägga till en favorit från localstorage
function addToLocalStorage(movie: Movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const isFavorite = favorites.some((fav: Movie) => fav.id === movie.id);
  if (isFavorite) {
    removeFromFavorites(movie);
  } else {
    addToFavorites(movie);
  }
}

//Funktion för att ta bort en favorit från localstorage
function removeFromLocalStorage(movie: Movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const newFavorites = favorites.filter((fav: Movie) => fav.id !== movie.id);
  localStorage.setItem("favorites", JSON.stringify(newFavorites));
}