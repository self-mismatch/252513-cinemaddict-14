import ExtraFilmView from './view/extra-film';
import FilmCardView from './view/film-card';
import FilmPopupView from './view/film-popup';
import FilmsView from './view/films';
import FiltersView from './view/filter';
import FooterStatisticView from './view/footer-statistic';
import NoFilmView from './view/no-film';
import ShowMoreButtonView from './view/show-more-button';
import SiteMenuView from './view/site-menu';
import SortingView from './view/sorting';
import UserProfileView from './view/user-profile';

import {render, RenderPosition, remove} from './utils/render';
import {getMostCommentedFilms, getTopRatedFilms} from './utils/film';
import {generateFilm} from './mock/film';
import {generateFilter} from './utils/filter';

const FILM_AMOUNT = 23;

const FILM_COUNT_PER_STEP = 5;

const films = new Array(FILM_AMOUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const siteBody = document.body;
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');

render(siteHeader, new UserProfileView(films));

const siteMenuComponent = new SiteMenuView();

render(siteMain, siteMenuComponent);
render(siteMenuComponent, new FiltersView(filters), RenderPosition.AFTERBEGIN);

const renderFilm = (container, film) => {
  const filmCardComponent = new FilmCardView(film);
  const filmPopupComponent = new FilmPopupView(film);

  const showPopup = () => {
    siteBody.classList.add('hide-overflow');
    render(siteBody, filmPopupComponent, RenderPosition.BEFOREEND);

    filmPopupComponent.setCloseButtonClickHandler(onPopupCloseButtonClick);
    document.addEventListener('keydown', onEscKeyDown);

    filmCardComponent.removeOpenPopupClickHandler();
  };

  const hidePopup = () => {
    siteBody.classList.remove('hide-overflow');
    remove(filmPopupComponent);

    document.removeEventListener('keydown', onEscKeyDown);

    filmCardComponent.setOpenPopupClickHandler(onFilmCardClick);
  };

  const onFilmCardClick = () => {
    showPopup();
  };

  const onPopupCloseButtonClick = () => {
    hidePopup();
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      hidePopup();
    }
  };

  filmCardComponent.setOpenPopupClickHandler(onFilmCardClick);

  render(container, filmCardComponent);
};

const renderFilmBlock = () => {
  if (films.length === 0) {
    render(siteMain, new NoFilmView());
    return;
  }

  const filmsComponent = new FilmsView();
  const filmsElement = filmsComponent.getElement();

  render(siteMain, filmsComponent);
  render(siteMenuComponent, new SortingView(), RenderPosition.AFTEREND);

  const mainFilmsList = filmsElement.querySelector('.films-list');
  const mainFilmsContainer = mainFilmsList.querySelector('.films-list__container');

  for (let i = 0; i < Math.min(films.length, FILM_COUNT_PER_STEP); i++) {
    renderFilm(mainFilmsContainer, films[i]);
  }

  if (films.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(mainFilmsList, showMoreButtonComponent);

    const onShowMoreButtonClick = () => {
      films
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(mainFilmsContainer, film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= films.length) {
        remove(showMoreButtonComponent);
      }
    };

    showMoreButtonComponent.setClickHandler(onShowMoreButtonClick);
  }

  const topRatedFilms = getTopRatedFilms(films);
  const mostCommentedFilms = getMostCommentedFilms(films);

  if (topRatedFilms.every((film) => film.filmInfo.totalRating > 0)) {
    render(filmsComponent, new ExtraFilmView('topRated', 'Top rated'));

    const topRatedFilmsContainer = filmsElement.querySelector('#topRated').querySelector('.films-list__container');

    topRatedFilms.forEach((film) => {
      renderFilm(topRatedFilmsContainer, film);
    });
  }

  if (mostCommentedFilms.every((film) => film.comments.length > 0)) {
    render(filmsComponent, new ExtraFilmView('mostCommented', 'Most commented'));

    const mostCommentedFilmsContainer = filmsElement.querySelector('#mostCommented').querySelector('.films-list__container');

    mostCommentedFilms.forEach((film) => {
      renderFilm(mostCommentedFilmsContainer, film);
    });
  }
};

renderFilmBlock();

const footerStatisticsContainer = siteFooter.querySelector('.footer__statistics');

render(footerStatisticsContainer, new FooterStatisticView(films));
