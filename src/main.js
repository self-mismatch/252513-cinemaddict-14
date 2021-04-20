import ExtraFilmView from './view/extra-film';
import FilmCardView from './view/film-card';
import FilmPopupView from './view/film-popup';
import FilmSectionView from './view/film-section';
import FiltersView from './view/filter';
import FooterStatisticView from './view/footer-statistic';
import NoFilmView from './view/no-film';
import ShowMoreButtonView from './view/show-more-button';
import SiteMenuView from './view/site-menu';
import SortingView from './view/sorting';
import UserProfileView from './view/user-profile';

import {render, RenderPosition} from './utils/render';
import {getMostCommentedFilms, getTopRatedFilms} from './utils/film';
import {generateFilm} from './mock/film';
import {generateFilter} from './utils/filter';

const FILM_AMOUNT = 23;

const FILM_COUNT_PER_STEP = 5;

const POPUP_OPEN_CLASSES = ['film-card__poster', 'film-card__title', 'film-card__comments'];

const films = new Array(FILM_AMOUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const siteBody = document.body;
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');

render(siteHeader, new UserProfileView(films).getElement());

const siteMenuComponent = new SiteMenuView();
const siteMenuElement = siteMenuComponent.getElement();

render(siteMain, siteMenuElement);
render(siteMenuElement, new FiltersView(filters).getElement(), RenderPosition.AFTERBEGIN);

const renderFilm = (container, film) => {
  const filmCardComponent = new FilmCardView(film);
  const filmCardElement = filmCardComponent.getElement();

  const filmPopupComponent = new FilmPopupView(film);
  const filmPopupElement = filmPopupComponent.getElement();

  const popupCloseButton = filmPopupElement.querySelector('.film-details__close-btn');

  const showPopup = () => {
    siteBody.classList.add('hide-overflow');
    siteBody.appendChild(filmPopupElement);
  };

  const hidePopup = () => {
    siteBody.classList.remove('hide-overflow');
    siteBody.removeChild(filmPopupElement);
  };

  const onFilmCardClick = (evt) => {
    if (!POPUP_OPEN_CLASSES.includes(evt.target.className)) {
      return;
    }

    evt.preventDefault();
    showPopup();

    popupCloseButton.addEventListener('click', onPopupCloseClick);
    document.addEventListener('keydown', onEscKeyDown);

    filmCardElement.removeEventListener('click', onFilmCardClick);
  };

  const onPopupCloseClick = (evt) => {
    evt.preventDefault();
    hidePopup();

    popupCloseButton.removeEventListener('click', onPopupCloseClick);
    document.removeEventListener('keydown', onEscKeyDown);

    filmCardElement.addEventListener('click', onFilmCardClick);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      hidePopup();

      popupCloseButton.removeEventListener('click', onPopupCloseClick);
      document.removeEventListener('keydown', onEscKeyDown);

      filmCardElement.addEventListener('click', onFilmCardClick);
    }
  };

  filmCardElement.addEventListener('click', onFilmCardClick);

  render(container, filmCardElement);
};

const renderFilmBlock = () => {
  if (films.length === 0) {
    render(siteMain, new NoFilmView().getElement());
    return;
  }

  const filmSectionComponent = new FilmSectionView();
  const filmSectionElement = filmSectionComponent.getElement();

  render(siteMain, filmSectionElement);
  render(siteMenuElement, new SortingView().getElement(), RenderPosition.AFTEREND);

  const mainFilmsList = filmSectionElement.querySelector('.films-list');
  const mainFilmsContainer = mainFilmsList.querySelector('.films-list__container');

  for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
    renderFilm(mainFilmsContainer, films[i]);
  }

  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();
    const showMoreButtonElement = showMoreButtonComponent.getElement();

    render(mainFilmsList, showMoreButtonElement);

    showMoreButtonElement.addEventListener('click', (evt) => {
      evt.preventDefault();

      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(mainFilmsContainer, film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        showMoreButtonComponent.removeElement();
        showMoreButtonElement.remove();
      }
    });
  }

  const topRatedFilms = getTopRatedFilms(films);
  const mostCommentedFilms = getMostCommentedFilms(films);

  if (topRatedFilms.every((film) => film.filmInfo.totalRating > 0)) {
    render(filmSectionElement, new ExtraFilmView('topRated', 'Top rated').getElement());

    const topRatedFilmsContainer = filmSectionElement.querySelector('#topRated').querySelector('.films-list__container');

    topRatedFilms.forEach((film) => {
      renderFilm(topRatedFilmsContainer, film);
    });
  }

  if (mostCommentedFilms.every((film) => film.comments.length > 0)) {
    render(filmSectionElement, new ExtraFilmView('mostCommented', 'Most commented').getElement());

    const mostCommentedFilmsContainer = filmSectionElement.querySelector('#mostCommented').querySelector('.films-list__container');

    mostCommentedFilms.forEach((film) => {
      renderFilm(mostCommentedFilmsContainer, film);
    });
  }
};

renderFilmBlock();

const footerStatisticsContainer = siteFooter.querySelector('.footer__statistics');

render(footerStatisticsContainer, new FooterStatisticView(films).getElement());
