import ExtraFilmView from '../view/extra-film';
import FilmListView from '../view/film-list';
import NoFilmView from '../view/no-film';
import ShowMoreButtonView from '../view/show-more-button';
import SortingView from '../view/sorting';

import FilmPresenter from './film';

import {SortingType, UpdateType, UserAction} from '../constants';
import {getMostCommentedFilms, getTopRatedFilms, getSortedFilmsByDate, getSortedFilmsByRating} from '../utils/film';
import {remove, render, RenderPosition} from '../utils/render';
import {filter} from '../utils/filter';

const FILM_COUNT_PER_STEP = 5;

const ID_PREFIX = {
  TOP_RATED: 'topRated',
  MOST_COMMENTED: 'mostCommented',
};

export default class FilmList {
  constructor(filmListContainer, filmsModel, filterModel, commentsModel) {
    this._filmListContainer = filmListContainer;
    this._filmsModel = filmsModel;
    this._filterModel = filterModel;
    this._commentsModel = commentsModel;

    this._filmListComponent = null;
    this._noFilmComponent = new NoFilmView();
    this._showMoreButtonComponent = null;
    this._sortingComponent = null;

    this._mainFilmsList = null;
    this._mainFilmsContainer = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleCommentModelEvent = this._handleCommentModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortingTypeChange = this._handleSortingTypeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);

    this._currentSortingType = SortingType.DEFAULT;

    this._filmPresenter = {};
    this._renderedFilmCount = FILM_COUNT_PER_STEP;
  }

  init() {
    this._filmListComponent = new FilmListView();
    this._mainFilmsList = this._filmListComponent.getElement().querySelector('.films-list');
    this._mainFilmsContainer = this._mainFilmsList.querySelector('.films-list__container');

    render(this._filmListContainer, this._filmListComponent);

    const topRatedFilms = getTopRatedFilms(this._getFilms());
    const mostCommentedFilms = getMostCommentedFilms(this._getFilms());

    if (topRatedFilms.every((film) => film.filmInfo.totalRating > 0)) {
      render(this._filmListComponent, new ExtraFilmView('topRated', 'Top rated'));
    }

    if (mostCommentedFilms.every((film) => film.comments.length > 0)) {
      render(this._filmListComponent, new ExtraFilmView('mostCommented', 'Most commented'));
    }

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleCommentModelEvent);

    this._renderFilmList();
  }

  destroy() {
    this._clearFilmList({resetRenderedFilmCount: true, resetSortingType: true});

    remove(this._filmListComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleCommentModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortingType) {
      case SortingType.DATE:
        return getSortedFilmsByDate(filteredFilms);
      case SortingType.RATING:
        return getSortedFilmsByRating(filteredFilms);
    }

    return filteredFilms;
  }

  _handleViewAction(actionType, updateType, updateFilm, updateCommentId) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, updateFilm);
        break;
      case UserAction.ADD_COMMENT:
        // this._filmsModel.updateFilm(updateType, updateFilm);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, updateFilm, updateCommentId);
        // this._filmsModel.updateFilm(updateType, updateFilm);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmPresenter[data.id].init(data);

        if (`${ID_PREFIX.TOP_RATED}_${data.id}` in this._filmPresenter) {
          this._filmPresenter[`${ID_PREFIX.TOP_RATED}_${data.id}`].init(data);
        }

        if (`${ID_PREFIX.MOST_COMMENTED}_${data.id}` in this._filmPresenter) {
          this._filmPresenter[`${ID_PREFIX.MOST_COMMENTED}_${data.id}`].init(data);
        }
        break;
      case UpdateType.MINOR:
        this._clearFilmList();
        this._renderFilmList();
        break;
      case UpdateType.MAJOR:
        this._clearFilmList({resetRenderedFilmCount: true, resetSortingType: true});
        this._renderFilmList();
        break;
    }
  }

  _handleCommentModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._filmsModel.updateFilm(updateType, data);
        break;
      case UpdateType.MINOR:
        this._filmsModel.updateFilm(updateType, data);
        break;
      case UpdateType.MAJOR:
        this._filmsModel.updateFilm(updateType, data);
        break;
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

    this._currentSortingType = sortingType;

    this._clearFilmList({resetRenderedFilmCount: true});
    this._renderFilmList();
  }

  _renderNoFilm() {
    render(this._filmListContainer, this._noFilmComponent);
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortingType);
    this._sortingComponent.setSortingTypeChangeHandler(this._handleSortingTypeChange);

    render(this._filmListComponent, this._sortingComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilm(container, film, prefix = '') {
    const filmPresenter = new FilmPresenter(container, this._handleViewAction, this._handleModeChange, this._commentsModel);
    filmPresenter.init(film);
    this._filmPresenter[prefix ? `${prefix}_${film.id}` : film.id] = filmPresenter;
  }

  _renderFilms(films, container, prefix = '') {
    films.forEach((film) => this._renderFilm(container, film, prefix));
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmCount, newRenderedFilmCount);

    this._renderFilms(films, this._mainFilmsContainer);
    this._renderedFilmCount = newRenderedFilmCount;

    if (this._renderedFilmCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._mainFilmsList, this._showMoreButtonComponent);
  }

  _renderMainFilms(films) {
    this._renderFilms(films, this._mainFilmsContainer);
  }

  _renderExtraFilms() {
    const topRatedFilms = getTopRatedFilms(this._getFilms());
    const mostCommentedFilms = getMostCommentedFilms(this._getFilms());

    const topRatedFilmsSection = this._filmListComponent.getElement().querySelector('#topRated');
    const mostCommentedFilmsSection = this._filmListComponent.getElement().querySelector('#mostCommented');

    if (topRatedFilmsSection) {
      const topRatedFilmsContainer = topRatedFilmsSection.querySelector('.films-list__container');
      this._renderFilms(topRatedFilms, topRatedFilmsContainer, ID_PREFIX.TOP_RATED);
    }

    if (mostCommentedFilmsSection) {
      const mostCommentedFilmsContainer = mostCommentedFilmsSection.querySelector('.films-list__container');
      this._renderFilms(mostCommentedFilms, mostCommentedFilmsContainer, ID_PREFIX.MOST_COMMENTED);
    }
  }

  _renderFilmList() {
    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      this._renderNoFilm();
      return;
    }

    this._renderSorting();

    this._renderMainFilms(films.slice(0, Math.min(filmCount, this._renderedFilmCount)));

    if (filmCount > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

    this._renderExtraFilms();
  }

  _clearFilmList({resetRenderedFilmCount = false, resetSortingType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};

    remove(this._sortingComponent);
    remove(this._noFilmComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedFilmCount) {
      this._renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmCount = Math.min(filmCount, this._renderedFilmCount);
    }

    if (resetSortingType) {
      this._currentSortingType = SortingType.DEFAULT;
    }
  }
}
