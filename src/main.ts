import axios from "axios"
import Movie from "./types"

async function serverRequest()  {
const popular = await axios({
    method: 'get',
    url: 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMjVmMjdlN2NmYzQ4NGJhZTQyM2UxNDQyYjkxNmUxNiIsIm5iZiI6MTcwMDY5NDA1MC44NjA5OTk4LCJzdWIiOiI2NTVlODgyMjdkZmRhNjAxMWJhZTUxNmQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.GWVFB8R4UZZayQOVqkvIeLtUbhdkUBQrBJnMOkYYYwQ'
      }
}).then((data) => console.log(data.data.results))
console.log(popular)

const byId = {}

const getPoster = {}
}
serverRequest()

function displayMovies(movies: Movie[]) {
movies.forEach((movie) => {
    
})
}