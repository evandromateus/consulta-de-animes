const toggleBtn = document.querySelector('#toggle')
const labelToggle = document.querySelector('#label-toggle')

toggleBtn.addEventListener('change', e => {
  document.body.classList.toggle('dark', e.target.checked)
  animeContainer.classList.toggle('dark', e.target.checked)
  if (e.target.checked) {
    labelToggle.innerHTML = "<i class='bi bi-brightness-high'></i>"
  } else {
    labelToggle.innerHTML = "<i class='bi bi-moon-stars'></i>"
  }
})