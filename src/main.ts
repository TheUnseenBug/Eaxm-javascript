//Speciellt sätt för att importera css när man använder vite.
import "./style.css";
import axios from "axios";
import Movie from "./types";
let popularMovies: Movie[] = [];
const cacheKey = 'popularMoviesCache';
const cacheExpiration = 1000 * 60 * 60; // 1 hour

document.getElementById('search-button')?.addEventListener('click', async () => {
  const query = (document.getElementById('search-input') as HTMLInputElement).value;
  if (query) {
    const searchResults = await searchMovies(query);
    await displayMovies(searchResults);
  }
});


async function serverRequest() {
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
  const data = await popular.data;
  popularMovies = data.results;
  localStorage.setItem(cacheKey, JSON.stringify({ data: popularMovies, timestamp: Date.now() }));
  await displayMovies(popularMovies);
}

async function searchMovies(query: string): Promise<Movie[]> {
  const response = await axios({
    method: "get",
    url: `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjVmMjdlN2NmYzQ4NGJhZTQyM2UxNDQyYjkxNmUxNiIsIm5iZiI6MTcwMDY5NDA1MC44NjA5OTk4LCJzdWIiOiI2NTVlODgyMjdkZmRhNjAxMWJhZTUxNmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GWVFB8R4UZZayQOVqkvIeLtUbhdkUBQrBJnMOkYYYwQ`,
    },
  });
  const data = await response.data;
  console.log(data.results);
  return data.results.slice(0, 9);
}
serverRequest();

function convertDate(dateString: string) {
  var date = new Date(dateString);
  return (
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
  );
}

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
    const desc = movie.overview.slice(0, 170);
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
    // if (checkIfFavorite(movie)) {
    //   favorite.classList.add("active");
    //   favorite.textContent = "Unfavorite";
    // }
    // else {
    //   favorite.classList.remove("active");
    // }
    favorite.textContent = "Favorite";
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
        favorite.classList.remove("active");
        favorite.textContent = "Favorite";
      } else {
        addToLocalStorage(movie);
        favorite.classList.toggle("active");
        favorite.textContent = "Unfavorite";
      }
    });
  });
}

function checkIfFavorite(movie: Movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  return favorites.some((fav: Movie) => fav.id === movie.id);
}

function addToFavorites(movie: Movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  favorites.push(movie);
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFromFavorites(movie: Movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const newFavorites = favorites.filter((fav: Movie) => fav.id !== movie.id);
  localStorage.setItem("favorites", JSON.stringify(newFavorites));
}

function addToLocalStorage(movie: Movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const isFavorite = favorites.some((fav: Movie) => fav.id === movie.id);
  if (isFavorite) {
    removeFromFavorites(movie);
  } else {
    addToFavorites(movie);
  }
}

function removeFromLocalStorage(movie: Movie) {
  const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
  const newFavorites = favorites.filter((fav: Movie) => fav.id !== movie.id);
  localStorage.setItem("favorites", JSON.stringify(newFavorites));
}