import Abstract from './abstract';
import dayjs from 'dayjs';
import {MINUTES_IN_HOUR} from '../constants';

const POPUP_OPEN_CLASSES = ['film-card__poster', 'film-card__title', 'film-card__comments'];

const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / MINUTES_IN_HOUR);
  const minutes = runtime - (hours * MINUTES_IN_HOUR);

  return `${hours}h ${minutes}m`;
};

const formatDescription = (description) => {
  return description.length > 140 ? description.slice(0, 139).concat('…') : description;
};

const createFilmCardTemplate = (film) => {
  const {
    comments,
  } = film;

  const {
    filmInfo,
    userDetails,
  } = film;

  const {
    description,
    genres,
    poster,
    releaseDate,
    runtime,
    title,
    totalRating,
  } = filmInfo;

  const {
    alreadyWatched,
    favorite,
    watchlist,
  } = userDetails;

  const releaseYear = dayjs(releaseDate).format('YYYY');
  const formattedRuntime = formatRuntime(runtime);
  const formattedGenres = genres.join(', ');
  const formattedDescription = formatDescription(description);
  const commentsCount = comments.length;

  const watchlistButtonClass = watchlist ? 'film-card__controls-item--add-to-watchlist film-card__controls-item--active' : 'film-card__controls-item--add-to-watchlist';
  const watchedButtonClass = alreadyWatched ? 'film-card__controls-item--mark-as-watched film-card__controls-item--active' : 'film-card__controls-item--mark-as-watched';
  const favoriteButtonClass = favorite ? 'film-card__controls-item--favorite film-card__controls-item--active' : 'film-card__controls-item--favorite';

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${releaseYear}</span>
      <span class="film-card__duration">${formattedRuntime}</span>
      <span class="film-card__genre">${formattedGenres}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${formattedDescription}</p>
    <a class="film-card__comments">${commentsCount} comment${commentsCount > 1 ? 's' : ''}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button ${watchlistButtonClass}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button ${watchedButtonClass}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button ${favoriteButtonClass}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard extends Abstract {
  constructor(film) {
    super();

    this._film = film;

    this._openPopupClickHandler = this._openPopupClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _openPopupClickHandler(evt) {
    if (!POPUP_OPEN_CLASSES.includes(evt.target.className)) {
      return;
    }

    evt.preventDefault();

    this._callback.openPopupClick();
  }

  setOpenPopupClickHandler(callback) {
    this._callback.openPopupClick = callback;
    this.getElement().addEventListener('click', this._openPopupClickHandler);
  }

  removeOpenPopupClickHandler() {
    this._callback.openPopupClick = null;
    this.getElement().removeEventListener('click', this._openPopupClickHandler);
  }
}
