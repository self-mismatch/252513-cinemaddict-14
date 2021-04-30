import ExtraFilmView from '../view/extra-film';
import FilmListView from '../view/film-list';
import NoFilmView from '../view/no-film';
import ShowMoreButtonView from '../view/show-more-button';
import SortingView from '../view/sorting';

import FilmPresenter from './film';

import {updateItem} from '../utils/common';
import {getMostCommentedFilms, getTopRatedFilms} from '../utils/film';
import {remove, render, RenderPosition} from '../utils/render';

const FILM_COUNT_PER_STEP = 5;

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
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._filmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
    this._films = null;
  }

  init(films) {
    this._films = films;

    this._renderFilmList();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _renderNoFilm() {
    render(this._filmListContainer, this._noFilmComponent);
  }

  _renderSorting() {
    render(this._filmListComponent, this._sortingComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(container, film) {
    const filmPresenter = new FilmPresenter(container, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);

    this._filmPresenter[film.id] = filmPresenter;
  }

  _renderFilms(films, container, from = 0, to = films.length) {
    films
      .slice(from, to)
      .forEach((film) => this._renderFilm(container, film));
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._films, this._mainFilmsContainer, this._renderedFilmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
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
    this._renderFilms(this._films, this._mainFilmsContainer, 0, Math.min(this._films.length, FILM_COUNT_PER_STEP));
  }

  _renderExtraFilms() {
    const topRatedFilms = getTopRatedFilms(this._films);
    const mostCommentedFilms = getMostCommentedFilms(this._films);

    if (topRatedFilms.every((film) => film.filmInfo.totalRating > 0)) {
      render(this._filmListComponent, new ExtraFilmView('topRated', 'Top rated'));

      const topRatedFilmsContainer = this._filmListComponent.getElement().querySelector('#topRated').querySelector('.films-list__container');

      this._renderFilms(topRatedFilms, topRatedFilmsContainer);
    }

    if (mostCommentedFilms.every((film) => film.comments.length > 0)) {
      render(this._filmListComponent, new ExtraFilmView('mostCommented', 'Most commented'));

      const mostCommentedFilmsContainer = this._filmListComponent.getElement().querySelector('#mostCommented').querySelector('.films-list__container');

      this._renderFilms(mostCommentedFilms, mostCommentedFilmsContainer);
    }
  }

  _renderFilmList() {
    render(this._filmListContainer, this._filmListComponent);

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
