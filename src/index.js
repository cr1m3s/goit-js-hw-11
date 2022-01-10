import PixabayAPI from './PixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import './styles.css';

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

  gallery.innerHTML = '';
  service.query = event.currentTarget.elements.searchQuery.value;

  service.search().then(({ hits, totalHits }) => {
    if (totalHits === 0) {
      Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
      return;
    }
    if (totalHits < 40) {
      load.classList.add('visually-hidden');
    } else {
      load.style.display = 'initial';
      load.classList.remove('visually-hidden');
    }
    Notify.info(`Hooray! We found ${totalHits} images.`);

    galleryConstructor(hits);
    lightbox.refresh();

    endOfSearch(totalHits);
  });
}

function galleryConstructor(cards) {
  const result = cards
    .map(({ webformatURL, tags, likes, views, comments, downloads }) => {
      return `<a class="card" href="${webformatURL}">
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

function endOfSearch(totalHits) {
  if (totalHits <= 40) {
    Notify.failure("We're sorry, but you've reached the end of search results.");
    load.style.display = 'none';
    load.classList.add('visually-hidden');
  }
}

function loadMore() {
  service.search().then(({ hits, totalHits }) => {
    if (totalHits === 0) {
      Notify.failure(`"We're sorry, 
        but you've reached the end of search results."`);
      load.classList.add('visually-hidden');
      load.style.display = 'none';
      return;
    } else {
      galleryConstructor(hits);
      lightbox.refresh();
    }
  });
}
