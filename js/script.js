const animesEl = document.querySelector('#animes')
const animeContainer = document.querySelector('#anime-container')
const searchForm = document.querySelector('#search-form')
const search = document.querySelector('#search')
const header = document.querySelector('header')
const pagesEl = document.querySelector('#pages')

const BASEURL = 'https://api.aniapi.com/v1/anime?per_page=20&'
const ANIMEURL = 'https://api.aniapi.com/v1/anime/'
const SEARCHURL = 'https://api.aniapi.com/v1/anime?per_page=20&title='

document.addEventListener('DOMContentLoaded', getAnimes(BASEURL))

async function getAnimes(url) {
  const resp = await fetch(url)
  const respData = await resp.json()
  const animes = respData.data.documents
  pagination(url, respData.data)
  showAnimes(animes)
}

function pagination(url, animesData){
  const animesCount = animesData.count
  const animesPage = animesData.last_page

  if (!pagesEl.innerHTML && animesCount > 20) {
    for (let i=1; i<=animesPage; i++) {
      const pageBtn = document.createElement('button')
      pageBtn.innerText = i
      pageBtn.addEventListener('click', () => {
        getAnimes(url + '&page=' + pageBtn.innerText)
        window.scrollTo(0,0)
      })
      pagesEl.appendChild(pageBtn)
    }
  }
}

function showAnimes(animes) {
  animesEl.innerHTML = ''

  animes.forEach(anime => {
    const animeEl = document.createElement('div')
    animeEl.classList.add('anime')

    animeEl.innerHTML = `
      <img src="${anime.cover_image}">
      <h4>${anime.titles.en.substr(0, 50)}</h4>
    `
    animeEl.addEventListener('click', () => {
      animeContainer.classList.add('active')
      showAnime(anime)
    })
    animesEl.appendChild(animeEl)
  })
}

function showAnime(anime) {
  animeContainer.innerHTML = ''

  const { id ,banner_image, cover_image, titles, genres, episodes_count, season_year, descriptions } = anime

  const animeModal = document.createElement('div')
  animeModal.innerHTML = `
    <div id="anime-modal" class="anime-modal">
      <button id="close-modal" class="close-modal"><i class="bi bi-x-circle-fill"></i></button>
      <img class="banner-img" src="${banner_image}">
      <div class="info">
        <img class="cover-img" src="${cover_image}">
        <div class="details">

          <h1>${titles.en.substr(0, 35)}</h1>
          ${genres.slice(0, 6).map(genre => `
            <div class="genre">${genre}</div>
          `).join('')}
          <div class="season-info">
            <span>Número de episódios: ${episodes_count}</span>
            <span>Ano: ${season_year}</span>
          </div>
          <p class="description">${descriptions.en ? descriptions.en.replace('<br>', '') : 'Descrição indisponivel.'}</p>

          <div class="tools">
            <button class="tool">
              <i id="fav" class="bi bi-heart"></i>
              <span>Favoritar</span>
            </button>
            <button class="tool">
              <i id="watch-later" class="bi bi-clock"></i>
              <span>Ver depois</span>
            </button>
            <button class="tool">
              <i id="watching" class="bi bi-play-circle"></i>
              <span>Assistindo</span>
            </button>
            <button class="tool">
              <i id="watched" class="bi bi-check-circle"></i>
              <span>Assistido</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `

  animeContainer.appendChild(animeModal)

  closeModal()

  saveAnimes(id)
}

function closeModal() {
  const closeModalBtn = document.querySelector('#close-modal')

  closeModalBtn.addEventListener('click', () => {
    animeContainer.classList.remove('active')
  })

  animeContainer.addEventListener('click', e => {
    if (e.target.classList.contains('anime-container')) {
      animeContainer.classList.remove('active')
    }
  })
}

function saveAnimes(id) {
  const favIcon = document.querySelector('#fav')
  const watchLaterIcon = document.querySelector('#watch-later')
  const watchedIcon = document.querySelector('#watched')
  const watchingIcon = document.querySelector('#watching')

  favIcon.addEventListener('click', () => {
    if (favIcon.classList.contains('bi-heart')) {
      favIcon.className = 'bi bi-heart-fill'
      addAnimeLS('favAnimes', id)
    } else {
      favIcon.className = 'bi bi-heart'
      removeAnimeLS('favAnimes', id)
    }
  })

  watchLaterIcon.addEventListener('click', () => {
    if (watchLaterIcon.classList.contains('bi-clock')) {
      watchLaterIcon.className = 'bi bi-clock-fill'
      addAnimeLS('watchLaterAnimes', id)
    } else {
      watchLaterIcon.className = 'bi bi-clock'
      removeAnimeLS('watchLaterAnimes', id)
    }
  })

  watchedIcon.addEventListener('click', () => {
    if (watchedIcon.classList.contains('bi-check-circle')) {
      watchedIcon.className = 'bi bi-check-circle-fill'
      addAnimeLS('watchedAnimes', id)
    } else {
      watchedIcon.className = 'bi bi-check-circle'
      removeAnimeLS('watchedAnimes', id)
    }
  })

  watchingIcon.addEventListener('click', () => {
    if (watchingIcon.classList.contains('bi-play-circle')) {
      watchingIcon.className = 'bi bi-play-circle-fill'
      addAnimeLS('watchingAnimes', id)
    } else {
      watchingIcon.className = 'bi bi-play-circle'
      removeAnimeLS('watchingAnimes', id)
    }
  })
}


// Links
document.querySelector('#all-animes').addEventListener('click', () => getAnimes(BASEURL))
document.querySelector('#fav-animes').addEventListener('click', () => getAnimesById('favAnimes'))
document.querySelector('#watch-later-animes').addEventListener('click', () => getAnimesById('watchLaterAnimes'))
document.querySelector('#watching-animes').addEventListener('click', () => getAnimesById('watchingAnimes'))
document.querySelector('#watched-animes').addEventListener('click', () => getAnimesById('watchedAnimes'))


// Busca de animes
searchForm.addEventListener('submit', e => {
  e.preventDefault()
  pagesEl.innerHTML = ''
  
  const searchTerm = search.value
  
  if (searchTerm) {
    const URL = SEARCHURL + searchTerm
    getAnimes(URL)
    pagination(URL)
  } else {
    getAnimes(BASEURL)
  }

})