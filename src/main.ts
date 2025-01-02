//Speciellt sätt för att importera css när man använder vite.
import "./style.css";

import axios from "axios";
import Movie from "./types";
let popularMovies: Movie[] = [];

async function serverRequest() {
  const popular = await axios({
    method: "get",
    url: "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjVmMjdlN2NmYzQ4NGJhZTQyM2UxNDQyYjkxNmUxNiIsIm5iZiI6MTcwMDY5NDA1MC44NjA5OTk4LCJzdWIiOiI2NTVlODgyMjdkZmRhNjAxMWJhZTUxNmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GWVFB8R4UZZayQOVqkvIeLtUbhdkUBQrBJnMOkYYYwQ",
    },
  }).then((response) => (popularMovies = response.data.results));
  console.log(popular);
  await displayMovies(popularMovies);
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
  movies.forEach(async (movie) => {
    // Create movie elements
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const description = document.createElement("p");
    // description.textContent = movie.overview;

    const image = document.createElement("img");
    image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    image.alt = `${movie.title} poster`;

    const releaseDate = document.createElement("p");
    const newReleaseDate = convertDate(movie.release_date);
    releaseDate.textContent = `Release Date: ${newReleaseDate}`;

    const genre = document.createElement("p");
    const movieGenresTest = handleGenre(movie.genre_ids);
    genre.textContent = `Genres: ${movieGenresTest} `;

    // Append elements to movie container
    card.appendChild(title);
    card.appendChild(releaseDate);
    card.appendChild(genre);
    card.appendChild(image);
    card.appendChild(description);
    wrapper.appendChild(card);

    card.addEventListener("click", () => {
      description.textContent = movie.overview;
    });
  });
}
