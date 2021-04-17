import {createFilmCardTemplate} from './view/film-card';
import {createFilmPopupTemplate} from './view/film-popup';
import {createFilmsTemplate} from './view/films';
import {createFiltersTemplate} from './view/filters';
import {createSiteMenuTemplate} from './view/site-menu';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createSortingTemplate} from './view/sorting';
import {createUserProfileTemplate} from './view/user-profile';

import {getMostCommentedFilms, getTopRatedFilms} from './utils/film';

import {generateFilm} from './mock/film';
import {generateFilter} from './mock/filter';

const FILM_AMOUNT = 23;

const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_AMOUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const topRatedFilms = getTopRatedFilms(films);
const mostCommentedFilms = getMostCommentedFilms(films);

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteBody = document.body;
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');

render(siteHeader, createUserProfileTemplate(films));
render(siteMain, createSiteMenuTemplate());

const siteMenu = siteMain.querySelector('.main-navigation');

render(siteMenu, createFiltersTemplate(filters), 'afterbegin');
render(siteMain, createSortingTemplate());
render(siteMain, createFilmsTemplate());

const filmsBlock = siteMain.querySelector('.films');
const filmsLists = filmsBlock.querySelectorAll('.films-list');
const mainFilmsList = filmsLists[0];
const mainFilmsContainer = mainFilmsList.querySelector('.films-list__container');
const topRatedFilmsContainer = filmsLists[1].querySelector('.films-list__container');
const mostCommentedFilmsContainer = filmsLists[2].querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
  render(mainFilmsContainer, createFilmCardTemplate(films[i]));
}

if (films.length > FILM_COUNT_PER_STEP) {
  let renderedFilmCount = FILM_COUNT_PER_STEP;

  render(mainFilmsList, createShowMoreButtonTemplate());

  const showMoreButton = mainFilmsList.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
      .forEach((film) => render(mainFilmsContainer, createFilmCardTemplate(film)));

    renderedFilmCount += FILM_COUNT_PER_STEP;

    if (renderedFilmCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

topRatedFilms.forEach((film) => {
  render(topRatedFilmsContainer, createFilmCardTemplate(film));
});

mostCommentedFilms.forEach((film) => {
  render(mostCommentedFilmsContainer, createFilmCardTemplate(film));
});

render(siteBody, createFilmPopupTemplate(films[0]));
