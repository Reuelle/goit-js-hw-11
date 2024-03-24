import { BASE_URL, options } from './pixabay-api.js';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const galleryEl = document.querySelector('.gallery');
const searchInputEl = document.querySelector('input[name="searchQuery"]');
const searchFormEl = document.getElementById('search-form');
const loadMoreBtn = document.querySelector('.load-more');
const upButton = document.querySelector('.up-button');

upButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

let currentPage = 1;
let totalHits = 0;

function renderGallery(hits) {
    const markUp = hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
        <a href="${largeImageURL}" class="lightbox">
            <div class="photo-card">
                <img src="${webformatURL}" alt="${tags}" loading="lazy">
                <div class="info">
                    <p style="flex-direction:column; text-align:center" class="info-item"><b>Likes:</b> ${likes}</p>
                    <p style="flex-direction:column; text-align:center" class="info-item"><b>Views:</b> ${views}</p>
                    <p style="flex-direction:column; text-align:center" class="info-item"><b>Comments:</b> ${comments}</p>
                    <p style="flex-direction:column; text-align:center" class="info-item"><b>Downloads:</b> ${downloads}</p>
                </div>
            </div>
        </a>
    `).join('');
    galleryEl.insertAdjacentHTML('beforeend', markUp);
    lightbox.refresh();
}

async function searchImages() {
    options.params.q = searchInputEl.value.trim();
    options.params.page = currentPage;
    
    try {
        const res = await axios.get(BASE_URL, options);
        totalHits = res.data.totalHits;
        const { hits } = res.data;

        if (hits.length === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        } else {
            Notify.success(`Hooray! We found ${totalHits} images.`);
            renderGallery(hits);

            // Show the "Load more" button if there are more images to load
            if (totalHits > currentPage * options.params.per_page) {
                loadMoreBtn.style.display = 'block';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    } catch (err) {
        Notify.failure('Failed to fetch images. Please try again later.');
        console.error(err);
    }
}

function loadMoreImages() {
    currentPage++;
    searchImages();
}
function handleScroll() {
    const { scrollTop } = document.documentElement;
    const upButton = document.querySelector('.up-button');

    if (scrollTop > 100) {
        upButton.style.display = 'block';
    } else {
        upButton.style.display = 'none';
    }

    if (scrollTop + window.innerHeight >= document.body.scrollHeight) {
        loadMore();
    }
}
function resetGallery() {
    galleryEl.innerHTML = '';
    currentPage = 1;
    totalHits = 0;
    loadMoreBtn.style.display = 'none';
}

searchFormEl.addEventListener('submit', (e) => {
    e.preventDefault();
    resetGallery();
    searchImages();
});

loadMoreBtn.addEventListener('click', loadMoreImages);
window.addEventListener('scroll', handleScroll);
