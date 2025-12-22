import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

const API_KEY = '53768760-b5f65296e9b3085f39f459f54';

function showLoader() {
  loader.classList.remove('is-hidden');
}

function hideLoader() {
  loader.classList.add('is-hidden');
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

form.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  const query = e.target.elements.query.value.trim();
  if (!query) return;

  gallery.innerHTML = '';
  fetchImages(query);
}

function fetchImages(query) {
  showLoader();

  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  fetch(`https://pixabay.com/api/?${params}`)
    .then(res => res.json())
    .then(data => {
      if (data.hits.length === 0) {
        hideLoader(); 
        iziToast.warning({
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
          backgroundColor: '#EF4040',
          color: '#FFBEBE',
          messageColor: '#FAFAFB',
          icon: 'fa fa-times-circle',
          iconColor: 'rgba(250, 250, 251, 1)',
          timeout: 5000,
        });
        return;
      }

      renderImages(data.hits);
    })
    .catch(() => {
      hideLoader(); 
      iziToast.error({
        message: 'Something went wrong. Please try again later.',
        position: 'topRight',
      });
    });
}



function renderImages(images) {
  const markup = images
    .map(
      img => `
      <li class="gallery-item">
        <a href="${img.largeImageURL}">
          <img src="${img.webformatURL}" alt="${img.tags}" />
        </a>
        <div class="info">
          <p><b>Likes</b><span>${img.likes}</span></p>
          <p><b>Views</b><span>${img.views}</span></p>
          <p><b>Comments</b><span>${img.comments}</span></p>
          <p><b>Downloads</b><span>${img.downloads}</span></p>
        </div>
      </li>
    `
    )
    .join('');

  gallery.innerHTML = markup;

    waitForImages().then(() => {
    hideLoader();        
    lightbox.refresh(); 
  });
}

function waitForImages() {
  const images = gallery.querySelectorAll('img');

  return Promise.all(
    [...images].map(
      img =>
        new Promise(resolve => {
          if (img.complete) {
            resolve();
          } else {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          }
        })
    )
  );
}
