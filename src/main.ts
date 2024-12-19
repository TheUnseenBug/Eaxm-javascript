import axios from "axios"
import Movie from "./types"
let popularMovies:Movie[] = [];

async function serverRequest()  {
const popular = await axios({
    method: 'get',
    url: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjVmMjdlN2NmYzQ4NGJhZTQyM2UxNDQyYjkxNmUxNiIsIm5iZiI6MTcwMDY5NDA1MC44NjA5OTk4LCJzdWIiOiI2NTVlODgyMjdkZmRhNjAxMWJhZTUxNmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GWVFB8R4UZZayQOVqkvIeLtUbhdkUBQrBJnMOkYYYwQ'
      }
}).then((response) =>    popularMovies = response.data.results)
console.log(popular)

const byId = {}

const getPoster = {}
await displayMovies(popularMovies)
}
serverRequest()

function displayMovies(movies: Movie[]) {
  const wrapper = document.querySelector(".wrapper") as HTMLElement;
  movies.forEach((movie) => {
    // Create movie elements
    const card = document.createElement("div")
    card.className = "card"

    const title = document.createElement("h3");
    title.textContent = movie.title;

    const description = document.createElement("p");
    description.textContent = movie.overview;

    const image = document.createElement("img");
    image.src = movie.poster_path;
    image.alt = `${movie.title} poster`;

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `Release Date: ${movie.release_date}`;

    const genre = document.createElement("p");
    genre.textContent = `Genre: ${movie.genre_ids}`;

    // Append elements to movie container
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(image);
    card.appendChild(releaseDate);
    card.appendChild(genre);
    wrapper.appendChild(card)
  });
}

