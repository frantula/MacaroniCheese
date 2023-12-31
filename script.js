// Titles: https://omdbapi.com/?s=thor&page=1&apikey=fc1fef96
// details: http://www.omdbapi.com/?i=tt3896198&apikey=fc1fef96

const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
const info = document.getElementById('info');

// load movies from API
async function loadMovies(searchTerm){
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(`${URL}`);
    const data = await res.json();
    // console.log(data.Search);
    if(data.Response == "True") displayMovieList(data.Search);
}

function findMovies() {
    let searchTerm = (movieSearchBox.value).trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        info.style.display = 'none';
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
        info.style.display = 'block';
    }
}

function displayMovieList(movies){
    searchList.innerHTML = "";
    for(let idx = 0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID; // setting movie id in  data-id
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster != "N/A")
            moviePoster = movies[idx].Poster;
        else 
            moviePoster = "image_not_found.png";

        movieListItem.innerHTML = `
        <div class = "search-item-thumbnail">
            <img src = "${moviePoster}">
        </div>
        <div class = "search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>
        `;
        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        });
    });
}

function displayMovieDetails(details){
    resultGrid.innerHTML = `
    <div class = "movie-poster">
        <img src = "${(details.Poster != "N/A") ? details.Poster : "image_not_found.png"}" alt = "movie poster">
    </div>
    <div class = "movie-info">
        <h3 class = "movie-title">${details.Title}</h3>
        <ul class = "movie-misc-info">
            <li class = "year">Año: ${details.Year}</li>
            <li class = "rated">Clasificación: ${details.Rated}</li>
            <li class = "released">Lanzamiento: ${details.Released}</li>
        </ul>
        <p class = "genre"><b>Generos:</b> ${details.Genre}</p>
        <p class = "writer"><b>Director:</b> ${details.Writer}</p>
        <p class = "actors"><b>Actores: </b>${details.Actors}</p>
        <p class = "plot"><b>Argumento:</b> ${details.Plot}</p>
        <p class = "language"><b>Idiomas:</b> ${details.Language}</p>
        <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        <div class="stars">
        <div class="rating">
        <input type="radio" name="clr1">
        <input type="radio" name="clr1">
        <input type="radio" name="clr1">
        <input type="radio" name="clr1">
        <input type="radio" name="clr1">
        </div>
        <div class="contenedor">
        <textarea id="comentario-input" placeholder="Escribe tu reseña de la pelicula"></textarea>
        <br>
        <button id="btn" onclick="agregarComentario()">Agregar tu reseña</button>
        <div id="contenedor-comentarios"></div>
        </div>
    </div>
    `;
}


window.addEventListener('click', (event) => {
    if(event.target.className != "form-control"){
        searchList.classList.add('hide-search-list');
        info.style.display = 'block';
    }
});
