import {createExtraFilmsTemplate} from './view/extra-films';
import {createFilmCardTemplate} from './view/film-card';
import {createFilmPopupTemplate} from './view/film-popup';
import {createFilmsTemplate} from './view/films';
import {createFiltersTemplate} from './view/filters';
import {createFooterStatisticTemplate} from './view/footer-statistic';
import {createMainFilmsTemplate} from './view/main-films';
import {createNoFilmTemplate} from './view/no-film';
import {createSiteMenuTemplate} from './view/site-menu';
import {createShowMoreButtonTemplate} from './view/show-more-button';

import {createSortingTemplate} from './view/sorting';

import {createUserProfileTemplate} from './view/user-profile';
import {getMostCommentedFilms, getTopRatedFilms} from './utils/film';
import {generateFilm} from './mock/film';
import {generateFilter} from './utils/filter';

const FILM_AMOUNT = 23;

const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_AMOUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteBody = document.body;
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');

render(siteHeader, createUserProfileTemplate(films));
render(siteMain, createSiteMenuTemplate());

const siteMenu = siteMain.querySelector('.main-navigation');

render(siteMenu, createFiltersTemplate(filters), 'afterbegin');
render(siteMain, createFilmsTemplate());

const filmsBlock = siteMain.querySelector('.films');
const mainFilmsList = filmsBlock.querySelector('.films-list');

const renderBoard = () => {
  if (films.length === 0) {
    render(mainFilmsList, createNoFilmTemplate());
    return;
  }

  render(siteMenu, createSortingTemplate(), 'afterend');

  render(mainFilmsList, createMainFilmsTemplate());

  const mainFilmsContainer = mainFilmsList.querySelector('.films-list__container');

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

  const topRatedFilms = getTopRatedFilms(films);
  const mostCommentedFilms = getMostCommentedFilms(films);

  if (topRatedFilms.every((film) => film.filmInfo.totalRating > 0)) {
    render(filmsBlock, createExtraFilmsTemplate('topRated', 'Top rated'));

    const topRatedFilmsContainer = filmsBlock.querySelector('#topRated').querySelector('.films-list__container');

    topRatedFilms.forEach((film) => {
      render(topRatedFilmsContainer, createFilmCardTemplate(film));
    });
  }

  if (mostCommentedFilms.every((film) => film.comments.length > 0)) {
    render(filmsBlock, createExtraFilmsTemplate('mostCommented', 'Most commented'));

    const mostCommentedFilmsContainer = filmsBlock.querySelector('#mostCommented').querySelector('.films-list__container');

    mostCommentedFilms.forEach((film) => {
      render(mostCommentedFilmsContainer, createFilmCardTemplate(film));
    });
  }
};

renderBoard();

const footerStatisticsContainer = siteFooter.querySelector('.footer__statistics');

render(footerStatisticsContainer, createFooterStatisticTemplate(films));

render(siteBody, createFilmPopupTemplate(films[0]));
