import PixabayAPI from './PixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a');
const service = new PixabayAPI();

let form = document.querySelector('.search-form');
let gallery = document.querySelector('.gallery');
let load = document.querySelector('.load-more');
load.style.display = 'none';

form.addEventListener('submit', startSearch);
load.addEventListener('click', loadMore);

function startSearch(event) {
  event.preventDefault();

  load.style.display = 'initial';
  load.classList.add('visually-hidden');
  gallery.innerHTML = '';
  service.query = event.currentTarget.elements.searchQuery.value;

  service.search().then(({ hits, totalHits }) => {
    if (hits.length === 0) {
      Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
      load.classList.add('visually-hidden');
      return;
    }
    Notify.info(`Hooray! We found ${totalHits} images.`);

    galleryConstructor(hits);
    lightbox.refresh();
    load.classList.remove('visually-hidden');
    endOfSearch(data.totalHits);
  });
}

function galleryConstructor(cards) {
  const result = cards
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<a href="${webformatURL}">
                <img src="${webformatURL}" alt="${tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        Likes: <b>${likes}</b>
                    </p>
                    <p class="info-item">
                        Views: <b>${views}</b>
                    </p>
                    <p class="info-item">
                        Comments: <b>${comments}</b>
                    </p>
                    <p class="info-item">
                        Downloads: <b>${downloads}</b>
                    </p>
                </div>
            </a>`;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', result);
}

function endOfSearch() {
  service.search().then(({ hits, totalHits }) => {
    if (totalHits <= 40) {
      Notify.failure("We're sorry, but you've reached the end of search results.");
      load.classList.add('visually-hidden');
    }
  });
}

function loadMore() {
  service.search().then(({ hits, totalHits }) => {
    if (totalHits < 12) {
      Notify.failure(`"We're sorry, 
        but you've reached the end of search results."`);
      load.classList.add('visually-hidden');
      galleryConstructor(hits);
      return;
    }
    galleryConstructor(hits);
    lightbox.refresh();
  });
}
