import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import axios from 'axios';


const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const searchLoader = document.querySelector('.search-loader');
const loadMoreBtn = document.querySelector('.load-more');
const loadMoreLoader = document.querySelector('.load-more-loader');


let isLoadMore = false;
let page = 1;
let currentQuery = '';
let totalHitsGlobal = 0;

const PER_PAGE = 40;
const API_KEY = '53768760-b5f65296e9b3085f39f459f54';
const MIN_LOADER_TIME = 800;


const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionPosition: 'bottom',
});

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);


function onSearch(e) {
  e.preventDefault();

  const query = e.target.elements.query.value.trim();
  if (!query) return;

  currentQuery = query;
  page = 1;
  totalHitsGlobal = 0;
  isLoadMore = false; 

  gallery.innerHTML = '';
  loadMoreBtn.classList.add('is-hidden');

  searchLoader.classList.remove('is-hidden');
  fetchImages();
}




function onLoadMore() {
  isLoadMore = true; 
  loadMoreBtn.classList.add('is-hidden');
  loadMoreLoader.classList.remove('is-hidden');

  page += 1;
  fetchImages();
}


async function fetchImages() {
  const startTime = Date.now();
  let imagesToRender = null;
  let isError = false;

  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: currentQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page: PER_PAGE,
      },
    });

    const { hits, totalHits } = response.data;
    totalHitsGlobal = totalHits;

    if (hits.length === 0 && page === 1) {
      iziToast.warning({
        message: 'Sorry, there are no images matching your search query.',
        position: 'topRight',
        backgroundColor: '#EF4040',
        color: '#FFBEBE',
        messageColor: '#FAFAFB',
        icon: 'fa fa-times-circle',
        iconColor: 'rgba(250, 250, 251, 1)',
        timeout: 5000,
      });
    } else {
      imagesToRender = hits;
    }

  } catch (error) {
    isError = true;

    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    console.error(error);
  } finally {
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, MIN_LOADER_TIME - elapsed);

    setTimeout(() => {

      searchLoader.classList.add('is-hidden');
      loadMoreLoader.classList.add('is-hidden');

      if (imagesToRender && !isError) {
        renderImages(imagesToRender);
      }
    }, remainingTime);
  }
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

  gallery.insertAdjacentHTML('beforeend', markup);

  waitForImages().then(() => {

    lightbox.refresh();

    if (isLoadMore) {
  const firstCard = gallery.firstElementChild;
  if (!firstCard) return;

  const { height } = firstCard.getBoundingClientRect();

  window.scrollBy({
    top: height * 2,
    behavior: 'smooth',
  });
}


if (page * PER_PAGE < totalHitsGlobal) {
  loadMoreBtn.classList.remove('is-hidden');
} else {
  iziToast.info({
    message:
      "We're sorry, but you've reached the end of search results",
    position: 'topRight',
    });
    }
  });
}

function waitForImages() {
  const images = gallery.querySelectorAll('img');

  return Promise.all(
    [...images].map(
      img =>
        new Promise(resolve => {
          if (img.complete) resolve();
          else {
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
          }
        })
    )
  );
}
