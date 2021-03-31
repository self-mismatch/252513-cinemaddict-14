import {createUserProfileTemplate} from './view/user-profile';
import {createSiteMenuTemplate} from './view/site-menu';
import {createSortingTemplate} from './view/sorting';
import {createFilmsTemplate} from './view/films';
import {createFilmCardTemplate} from './view/film-card';
import {createShowMoreButtonTemplate} from './view/show-more-button';
import {createFilmPopupTemplate} from './view/film-popup';

const MAIN_FILMS_AMOUNT = 5;
const TOP_RATED_FILMS_AMOUNT = 2;
const MOST_COMMENTED_FILMS_AMOUNT = 2;

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteBody = document.body;
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');

render(siteHeader, createUserProfileTemplate());
render(siteMain, createSiteMenuTemplate());
render(siteMain, createSortingTemplate());
render(siteMain, createFilmsTemplate());

const films = siteMain.querySelector('.films');
const filmsLists = films.querySelectorAll('.films-list');
const mainFilmsList = filmsLists[0];
const mainFilmsContainer = mainFilmsList.querySelector('.films-list__container');
const topRatedFilmsContainer = filmsLists[1].querySelector('.films-list__container');
const mostCommentedFilmsContainer = filmsLists[2].querySelector('.films-list__container');

for (let i = 0; i < MAIN_FILMS_AMOUNT; i++) {
  render(mainFilmsContainer, createFilmCardTemplate());
}

render(mainFilmsList, createShowMoreButtonTemplate());

for (let i = 0; i < TOP_RATED_FILMS_AMOUNT; i++) {
  render(topRatedFilmsContainer, createFilmCardTemplate());
}

for (let i = 0; i < MOST_COMMENTED_FILMS_AMOUNT; i++) {
  render(mostCommentedFilmsContainer, createFilmCardTemplate());
}

render(siteBody, createFilmPopupTemplate());
