const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const PROFILE_BASE_URL = 'http://image.tmdb.org/t/p/w185'
const BACKDROP_BASE_URL = 'http://image.tmdb.org/t/p/w780'

class App {
  static run() {

    document.querySelector('#movie-button').addEventListener('click', function() {
      const id = document.querySelector('#movie-input').value
      APIService.fetchMovie(id)
      .then(movie => Page.renderMovie(movie))
      APIService.fetchActor(id)
      .then(actors => Page.renderActors(actors))
    })
    let defultMovie = 496243;
    APIService.fetchMovie(defultMovie)
      .then(movie => Page.renderMovie(movie))
    APIService.fetchActor(defultMovie)
    .then(actors => Page.renderActors(actors))
  }
}

class APIService {

  static fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`)
    return fetch(url)
      .then(res => res.json())
      .then(json => new Movie(json))
  }

 added
  static fetchActor(movieId){
    const url = APIService._constructUrl(`movie/${movieId}/credits`)
    return fetch(url)
    .then(res => res.json())
    .then(json => {
      // console.log(json)
      let justFourAct = []
      for (let i = 0; i < 4; i++) {
        justFourAct.push(new Actor(json.cast[i]))
      }
      return justFourAct;
    })
  }

  static  _constructUrl(path) {
    return `${TMDB_BASE_URL}/${path}?api_key=${atob('NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI=')}`
  }
}

class Page {
  static backdrop = document.getElementById('movie-backdrop')
  static title = document.getElementById('movie-title')
  static releaseDate = document.getElementById('movie-release-date')
  static runtime = document.getElementById('movie-runtime')
  static overview = document.getElementById('movie-overview')
  
  static renderMovie(movie) {
    Page.backdrop.src = BACKDROP_BASE_URL + movie.backdropPath
    Page.title.innerText = movie.title
    Page.releaseDate.innerText = movie.releaseDate
    Page.runtime.innerText = movie.runtime + " minutes"
    Page.overview.innerText = movie.overview
  }
  //added 
  static renderActors(actors){
    let actorsUl = document.getElementById('actors') // added
    actorsUl.innerHTML = ''
    actors.forEach(actor => {
      actorsUl.insertAdjacentHTML('beforeend', `
      <li class="col-md-3">
        <img src="${PROFILE_BASE_URL + actor.profilePath}">
        <h4 id="actorName">${actor.name}</h4>
      </li>
      `)
      
    });
  }

}

class Movie {
  constructor(json) {
    this.id = json.id
    this.title = json.title
    this.releaseDate = json.release_date
    this.runtime = json.runtime
    this.overview = json.overview
    this.backdropPath = json.backdrop_path
  }
}

// added
class Actor {
  constructor(json){
    this.name = json.name
    this.profilePath = json.profile_path
  }
}

document.addEventListener("DOMContentLoaded", App.run);