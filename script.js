const animesEl = document.querySelector('#animes')
const animeContainer = document.querySelector('#anime-container')
const searchForm = document.querySelector('#search-form')
const search = document.querySelector('#search')
const APIURL = 'https://api.aniapi.com/v1/anime'
const SEARCHURL = 'https://api.aniapi.com/v1/anime?title='

getAnimes(APIURL)

async function getAnimes(url) {
  const resp = await fetch(url)
  const respData = await resp.json()
  const animes = respData.data.documents

  showAnimes(animes)
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
      showAnimeInfo(anime)
    })
    animesEl.appendChild(animeEl)

  })
}

function showAnimeInfo(anime) {
  animeContainer.innerHTML = ''
  const animeModal = document.createElement('div')

  const { banner_image, cover_image, titles, genres, episodes_count, season_year, descriptions } = anime

  let genresArr = []

  for (let i=0; i<=6; i++) {
    genresArr.push(genres[i])
  }

  animeModal.innerHTML = `
    <div id="anime-modal" class="anime-modal">
      <button id="close-modal" class="close-modal"><i class="bi bi-x-circle-fill"></i></button>
      <div class="anime-header">
        <img class="banner-img" src="${banner_image}">
        <div class="info">
          <img class="cover-img" src="${cover_image}">
          <div class="details">
            <h1>${titles.en.substr(0, 35)}</h1>
            <div class="genres">
              ${genresArr.map(genre => `
                <div class="genre">${genre}</div>
              `).join('')}
            </div>
            <div class="season-info">
              <span>Número de episódios: ${episodes_count}</span>
              <span>Ano: ${season_year}</span>
            </div>
            <p class="description">${descriptions.en ? descriptions.en.replace('<br>', '') : 'Descrição indisponivel.'}</p>
            <div class="tools">
              <button class="tool">
                <i class="bi bi-heart"></i>
                <span>Favoritar</span>
              </button>
              <button class="tool">
                <i class="bi bi-clock"></i>
                <span>Ver depois</span>
              </button>
              <button class="tool">
                <i class="bi bi-check-circle"></i>
                <span>Assistido</span>
              </button>
              <button class="tool">
                <i class="bi bi-play-circle"></i>
                <span>Assistindo</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  animeContainer.appendChild(animeModal)

  const closeModal = document.querySelector('#close-modal')
  closeModal.addEventListener('click', () => {
    animeContainer.classList.remove('active')
  })

  animeContainer.addEventListener('click', e => {
    if (e.target.classList.contains('anime-container')) {
      animeContainer.classList.remove('active')
    }
  })

}

searchForm.addEventListener('submit', e => {
  e.preventDefault()
  const searchTerm = search.value

  if (searchTerm) {
    getAnimes(SEARCHURL + searchTerm)
  } else {
    getAnimes(APIURL)
  }

})