import ExtraFilmView from '../view/extra-film';
import FilmListView from '../view/film-list';
import NoFilmView from '../view/no-film';
import ShowMoreButtonView from '../view/show-more-button';
import SortingView from '../view/sorting';

import FilmPresenter from './film';

import {SortingType} from '../constants';
import {updateItem} from '../utils/common';
import {getMostCommentedFilms, getTopRatedFilms, getSortedFilmsByDate, getSortedFilmsByRating} from '../utils/film';
import {remove, render, RenderPosition} from '../utils/render';

const FILM_COUNT_PER_STEP = 5;

const ID_PREFIX = {
  TOP_RATED: 'topRated',
  MOST_COMMENTED: 'mostCommented',
};

export default class FilmList {
  constructor(filmListContainer) {
    this._filmListContainer = filmListContainer;

    this._filmListComponent = new FilmListView();
    this._noFilmComponent = new NoFilmView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._sortingComponent = new SortingView();

    this._mainFilmsList = this._filmListComponent.getElement().querySelector('.films-list');
    this._mainFilmsContainer = this._mainFilmsList.querySelector('.films-list__container');

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortingTypeChange = this._handleSortingTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._currentSortingType = SortingType.DEFAULT;

    this._filmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    this._films = null;
    this._topRatedFilms = null;
    this._mostCommentedFilms = null;
  }

  init(films) {
    this._sourcedFilms = films.slice();
    this._films = films.slice();

    render(this._filmListContainer, this._filmListComponent);

    this._topRatedFilms = getTopRatedFilms(this._films);
    this._mostCommentedFilms = getMostCommentedFilms(this._films);

    if (this._topRatedFilms.every((film) => film.filmInfo.totalRating > 0)) {
      render(this._filmListComponent, new ExtraFilmView('topRated', 'Top rated'));
    }

    if (this._mostCommentedFilms.every((film) => film.comments.length > 0)) {
      render(this._filmListComponent, new ExtraFilmView('mostCommented', 'Most commented'));
    }

    this._renderFilmList();
  }

  _sortFilms(sortingType) {
    switch (sortingType) {
      case SortingType.DATE:
        this._films = getSortedFilmsByDate(this._films);
        break;
      case SortingType.RATING:
        this._films = getSortedFilmsByRating(this._films);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortingType = sortingType;
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);

    if (`${ID_PREFIX.TOP_RATED}_${updatedFilm.id}` in this._filmPresenter) {
      this._filmPresenter[`${ID_PREFIX.TOP_RATED}_${updatedFilm.id}`].init(updatedFilm);
    }

    if (`${ID_PREFIX.MOST_COMMENTED}_${updatedFilm.id}` in this._filmPresenter) {
      this._filmPresenter[`${ID_PREFIX.MOST_COMMENTED}_${updatedFilm.id}`].init(updatedFilm);
    }
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortingTypeChange(sortingType) {
    if (sortingType === this._currentSortingType) {
      return;
    }

    this._sortFilms(sortingType);
    this._clearFilmList();
    this._renderFilmList();
  }

  _renderNoFilm() {
    render(this._filmListContainer, this._noFilmComponent);
  }

  _renderSorting() {
    render(this._filmListComponent, this._sortingComponent, RenderPosition.BEFOREBEGIN);
    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortingTypeChange);
  }

  _renderFilm(container, film, prefix = '') {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);
    this._filmPresenter[prefix ? `${prefix}_${film.id}` : film.id] = filmPresenter;
  }

  _renderFilms(films, container, prefix = '', from = 0, to = films.length) {
    films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film, prefix));
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._films, this._mainFilmsContainer, '', this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    this._renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this._renderedFilmCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._mainFilmsList, this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderMainFilms() {
    this._renderFilms(this._films, this._mainFilmsContainer, '', 0, Math.min(this._films.length, FILM_COUNT_PER_STEP));
  }

  _renderExtraFilms() {
    this._topRatedFilms = getTopRatedFilms(this._films);
    this._mostCommentedFilms = getMostCommentedFilms(this._films);

    const topRatedFilms = this._filmListComponent.getElement().querySelector('#topRated');

    if (topRatedFilms) {
      const topRatedFilmsContainer = topRatedFilms.querySelector('.films-list__container');
      this._renderFilms(this._topRatedFilms, topRatedFilmsContainer, ID_PREFIX.TOP_RATED);
    }

    const mostCommentedFilms = this._filmListComponent.getElement().querySelector('#mostCommented');

    if (mostCommentedFilms) {
      const mostCommentedFilmsContainer = mostCommentedFilms.querySelector('.films-list__container');
      this._renderFilms(this._mostCommentedFilms, mostCommentedFilmsContainer, ID_PREFIX.MOST_COMMENTED);
    }
  }

  _renderFilmList() {
    if (this._films.length === 0) {
      this._renderNoFilm();
      return;
    }

    this._renderSorting();
    this._renderMainFilms();

    if (this._films.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

    this._renderExtraFilms();
  }

  _clearFilmList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;

    remove(this._showMoreButtonComponent);
  }
}
