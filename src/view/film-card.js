import dayjs from 'dayjs';
import {MINUTES_IN_HOUR} from '../constants';

const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / MINUTES_IN_HOUR);
  const minutes = runtime - (hours * MINUTES_IN_HOUR);

  return `${hours}h ${minutes}m`;
};

const formatDescription = (description) => {
  return description.length > 140 ? description.slice(0, 139).concat('…') : description;
};

export const createFilmCardTemplate = (film, comments) => {
  const {
    filmInfo,
    userDetails,
  } = film;

  const {
    commentsId,
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
  const commentsAmount = comments.find((el) => el.id === commentsId).comments.length;

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
    <a class="film-card__comments">${commentsAmount} comment${commentsAmount > 1 ? 's' : ''}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button ${watchlistButtonClass}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button ${watchedButtonClass}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button ${favoriteButtonClass}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
