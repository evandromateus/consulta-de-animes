function addAnimeLS(lsName, animeId) {
  const animeIds = getAnimeIdsLS(lsName)

  localStorage.setItem(lsName, JSON.stringify([...animeIds, animeId]))
}

function removeAnimeLS(lsName, animeId) {
  const animeIds = getAnimeIdsLS(lsName)
  
  localStorage.setItem(lsName, JSON.stringify(animeIds.filter(id => id !== animeId)))
}

function getAnimeIdsLS(lsName) {
  const animeIds = JSON.parse(localStorage.getItem(lsName))

  return animeIds === null ? [] : animeIds
}

function getAnimesById(lsName) {
  const ids = getAnimeIdsLS(lsName)
  let animes = []

  ids.forEach(async id => {
    const resp = await fetch(ANIMEURL + id)
    const respData = await resp.json()
    animes.push(respData.data)
    showAnimes(animes)
  })
}