const animesEl = document.querySelector('#animes')
const animeContainer = document.querySelector('#anime-container')
const searchForm = document.querySelector('#search-form')
const search = document.querySelector('#search')
const header = document.querySelector('header')

const BASEURL = 'https://api.aniapi.com/v1/anime?per_page=20'
const ANIMEURL = 'https://api.aniapi.com/v1/anime/'
const SEARCHURL = 'https://api.aniapi.com/v1/anime?per_page=20&title='
let SEARCHOPTIONURL

document.addEventListener('DOMContentLoaded', getAnimes(BASEURL, 1))

async function getAnimes(url, page) {
  const resp = await fetch(url + '&page=' + page)
  const respData = await resp.json()
  if (respData.status_code == 200) {
    if (respData.data.count > 20) {
      ulEl.style.display = 'flex'
    } else {
      ulEl.style.display = 'none'
    }

    totalPages = respData.data.last_page
    const animes = respData.data.documents
    element(totalPages, page)
    showAnimes(animes)
  } else {
    animesEl.innerHTML = '<h1>Não foi possível encontrar animes com essas informações</h1>'
    ulEl.style.display = 'none'
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
              <i id="fav" class="bi bi-heart${isSaved(id, 'favAnimes')}"></i>
              <span>Favoritar</span>
            </button>
            <button class="tool">
              <i id="watch-later" class="bi bi-clock${isSaved(id, 'watchLaterAnimes')}"></i>
              <span>Ver depois</span>
            </button>
            <button class="tool">
              <i id="watching" class="bi bi-play-circle${isSaved(id, 'watchingAnimes')}"></i>
              <span>Assistindo</span>
            </button>
            <button class="tool">
              <i id="watched" class="bi bi-check-circle${isSaved(id, 'watchedAnimes')}"></i>
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

function isSaved(id, lsName) {
  if (isSavedLS(id, lsName)) {
    return '-fill'
  } else {
    return ''
  }
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
document.querySelector('#all-animes').addEventListener('click', () => {
  search.value = ''
  SEARCHOPTIONURL = ''
  getAnimes(BASEURL, 1)
})
document.querySelector('#fav-animes').addEventListener('click', () => getAnimesById('favAnimes'))
document.querySelector('#watch-later-animes').addEventListener('click', () => getAnimesById('watchLaterAnimes'))
document.querySelector('#watching-animes').addEventListener('click', () => getAnimesById('watchingAnimes'))
document.querySelector('#watched-animes').addEventListener('click', () => getAnimesById('watchedAnimes'))


// Busca de animes
let genres
const searchBtn = document.querySelector('#search-btn')
const searchContainer = document.querySelector('#search-container')

searchBtn.addEventListener('click', () => {
  searchContainer.classList.toggle('active')
})

const genresContainer = document.querySelector('#genres-container')
const genresArr = [
  'action',
  'adventure',
  'comedy',
  'drama',
  'fantasy',
  'horror',
  'magic',
  'mistery',
  'psychological',
  'romance',
  'slice of life',
  'supernatural'
]

genresArr.forEach(genre => {
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.id = genre
  checkbox.value = genre[0].toUpperCase() + genre.substring(1)

  const label = document.createElement('label')
  label.htmlFor = genre
  label.classList.add('genre')
  label.innerText = genre

  genresContainer.appendChild(checkbox)
  genresContainer.appendChild(label)
})

searchForm.addEventListener('submit', e => {
  e.preventDefault()

  genres = ''
  
  const searchTerm = search.value

  genresEl = document.querySelectorAll('.genres-container input')

  genresEl.forEach(genreInput => {
    if (genreInput.checked) {
      genres += `${genreInput.value},`
    }
  })

  if (searchTerm) {
    SEARCHOPTIONURL = BASEURL + '&title=' + searchTerm
  }

  if (genres) {
    SEARCHOPTIONURL += '&genres=' + genres
  }

  console.log(SEARCHOPTIONURL)
  getAnimes(SEARCHOPTIONURL, 1)

})



const ulEl = document.querySelector('#pagination ul')
let totalPages
let url

function element(totalPages, page){
  let liTag = ''
  let activeLi
  let beforePages = page - 1
  let afterPages = page + 1

  if (SEARCHOPTIONURL) {
    url = SEARCHOPTIONURL
  } else {
    url = BASEURL
  }
  
  // BOTÃO PREV
  if (page > 1) {
    liTag += `<li class="btn prev" onclick="element(totalPages, ${page - 1}); getAnimes(url, ${page - 1})"><span><i class="bi bi-chevron-left"></i> Prev</span></li>`
  }

  // IR PARA A PAGINA 1
  if (page > 2) {
    if (totalPages > 4) {
      liTag += `<li class="numb" onclick="element(totalPages, 1); getAnimes(url, 1)"><span>1</span></li>`
    }
    if(page > 3 && totalPages > 5) {
      liTag += ` <li class="dots"><span>...</span></li>`
    }
  }


  if (page == totalPages) {
    beforePages = beforePages - 2
  } else if (page == totalPages - 1) {
    beforePages = beforePages - 1
  }

  if (page === 1 || page === 2 || page - 1 === 0) {
    beforePages = 0
  }

  if (page == 1) {
    afterPages = afterPages + 2
  } else if (page == 2){
    afterPages = afterPages + 1
  }


  for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
    if (pageLength > totalPages) {
      continue
    }
    if (pageLength == 0) {
      pageLength = pageLength + 1
    }

    if (page == pageLength) { 
      activeLi = 'active'
    } else {
      activeLi = ''
    }
    liTag += `<li class="numb ${activeLi}" onclick="element(totalPages, ${pageLength}); getAnimes(url, ${pageLength})"><span>${pageLength}</span></li>`
  }


  if (page < totalPages - 1) {
    if(page < totalPages - 2 && totalPages > 5) {
      liTag += ` <li class="dots"><span>...</span></li>`
    }
    if (totalPages > 4) {
      liTag += `<li class="numb" onclick="element(totalPages, ${totalPages}); getAnimes(url, ${totalPages})"><span>${totalPages}</span></li>`
    }
  }

  // BOTÃO NEXT
  if (page < totalPages) {
    liTag += `<li class="btn next" onclick="element(totalPages, ${page + 1}); getAnimes(url, ${page + 1})">Next <span><i class="bi bi-chevron-right"></i></span></li>`
  }

  ulEl.innerHTML = liTag
  window.scrollTo(0, 0)
}