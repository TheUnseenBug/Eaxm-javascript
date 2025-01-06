//Speciellt sätt för att importera css när man använder vite.
import "./style.css";
import Movie from "./types";


async function getItemsFromLocalStorage(key: string): Promise<any | null> {
    const item = localStorage.getItem(key);
    if (item) {
        try {
            return await JSON.parse(item);
        } catch (e) {
            console.error("Error parsing JSON from localStorage", e);
            return null;
        }
    }
    return null;
}
const movies = await getItemsFromLocalStorage("favorites");
displayMovies(movies);
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
     if (checkIfFavorite(movie)) {
       favorite.textContent = "Unfavorite";
       favorite.style.backgroundColor = "red";
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
        favorite.style.backgroundColor = "blue";
      } else {
        addToLocalStorage(movie);
        favorite.style.backgroundColor = "red";
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