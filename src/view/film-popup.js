import he from 'he';
import Smart from './smart';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {MINUTES_IN_HOUR} from '../constants';

dayjs.extend(relativeTime);

const Emoji = {
  SMILE: 'smile',
  SLEEPING: 'sleeping',
  PUKE: 'puke',
  ANGRY: 'angry',
};

const formatReleaseDate = (releaseDate) => {
  return dayjs(releaseDate).format('DD MMMM YYYY');
};

const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / MINUTES_IN_HOUR);
  const minutes = runtime - (hours * MINUTES_IN_HOUR);

  return `${hours}h ${minutes}m`;
};

const formatCommentDate = (date) => {
  return dayjs().to(dayjs(date));
};

const createGenresTemplate = (genres) => {
  return genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');
};

const createCommentTemplate = (comment) => {
  const {
    author,
    content,
    date,
    emotion,
    id,
  } = comment;

  const formattedDate = formatCommentDate(date);

  return `<li class="film-details__comment" data-comment-id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${content}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${formattedDate}</span>
        <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
      </p>
    </div>
  </li>`;
};

const createCommentsTemplate = (comments) => {
  return comments.map((comment) => createCommentTemplate(comment)).join('');
};

const createSelectedEmojiTemplate = (selectedEmoji) => {
  return selectedEmoji ? `<img src="images/emoji/${selectedEmoji}.png" width="55" height="55" alt="emoji-${selectedEmoji}">` : '';
};

const createEmojiItemTemplate = (emoji, selectedEmoji) => {
  const isInputChecked = emoji === selectedEmoji ? 'checked' : '';

  return `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isInputChecked}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`;
};

const createEmojiListTemplate = (selectedEmoji) => {
  return `<div class="film-details__emoji-list">
      ${Object.values(Emoji).map((emoji) => createEmojiItemTemplate(emoji, selectedEmoji)).join('')}
    </div>`;
};

const createFilmPopupTemplate = (data) => {
  const {
    id,
  } = data;

  const {
    comments,
  } = data;

  const {
    filmInfo,
    userDetails,
  } = data;

  const {
    state,
  } = data;

  const {
    actors,
    ageRating,
    alternativeTitle,
    country,
    description,
    director,
    genres,
    poster,
    releaseDate,
    runtime,
    title,
    totalRating,
    writers,
  } = filmInfo;

  const {
    alreadyWatched,
    favorite,
    watchlist,
  } = userDetails;

  const {
    commentText,
  } = state;

  const formattedWriters = writers.join(', ');
  const formattedActors = actors.join(', ');
  const formattedReleaseDate = formatReleaseDate(releaseDate);
  const formattedRuntime = formatRuntime(runtime);

  const genresTemplate = createGenresTemplate(genres);

  const watchlistInputCheck = watchlist ? 'checked' : '';
  const watchedInputCheck = alreadyWatched ? 'checked' : '';
  const favoriteInputCheck = favorite ? 'checked' : '';

  const commentsCount = window.comments[id].length;
  const filmComments = window.comments[id];
  const commentsTemplate = createCommentsTemplate(filmComments);

  const selectedEmojiTemplate = createSelectedEmojiTemplate(state.emoji);
  const emojiListTemplate = createEmojiListTemplate(state.emoji);

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${formattedWriters}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${formattedActors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formattedReleaseDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${formattedRuntime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genre${genres.length > 1 ? 's' : ''}</td>
                <td class="film-details__cell">${genresTemplate}</td>
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${watchlistInputCheck}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${watchedInputCheck}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${favoriteInputCheck}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsTemplate}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${selectedEmojiTemplate}
            </div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${he.encode(commentText)}</textarea>
            </label>

            ${emojiListTemplate}
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class FilmPopup extends Smart {
  constructor(film) {
    super();

    this._data = FilmPopup.parseFilmToData(film);

    this._watchlistButtonClickHandler = this._watchlistButtonClickHandler.bind(this);
    this._watchedButtonClickHandler = this._watchedButtonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._deleteCommentButtonClickHandler = this._deleteCommentButtonClickHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentEmojiChangeHandler = this._commentEmojiChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmPopupTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setWatchlistButtonClickHandler(this._callback.watchlistButtonClick);
    this.setWatchedButtonClickHandler(this._callback.watchedButtonClick);
    this.setFavoriteButtonClickHandler(this._callback.favoriteButtonClick);
    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setDeleteCommentButtonClickHandler(this._callback.deleteCommentButtonClick);
  }

  _watchlistButtonClickHandler(evt) {
    evt.preventDefault();

    this._callback.watchlistButtonClick();
  }

  _watchedButtonClickHandler(evt) {
    evt.preventDefault();

    this._callback.watchedButtonClick();
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();

    this._callback.favoriteButtonClick();
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();

    this._callback.closeButtonClick();
  }

  _deleteCommentButtonClickHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();

    this._callback.deleteCommentButtonClick(evt.target.dataset.commentId);

    // this.updateElement(this.getElement().scrollTop);
  }

  _commentEmojiChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      state: {
        ...this._data.state,
        emoji: evt.target.value,
      },
    },
    false,
    this.getElement().scrollTop,
    );
  }

  _commentInputHandler(evt) {
    evt.preventDefault();

    this.updateData({
      state: {
        ...this._data.state,
        commentText: evt.target.value,
      },
    },
    true,
    );
  }

  setWatchlistButtonClickHandler(callback) {
    this._callback.watchlistButtonClick = callback;
    this.getElement().querySelector('#watchlist').addEventListener('change', this._watchlistButtonClickHandler);
  }

  setWatchedButtonClickHandler(callback) {
    this._callback.watchedButtonClick = callback;
    this.getElement().querySelector('#watched').addEventListener('change', this._watchedButtonClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback.favoriteButtonClick = callback;
    this.getElement().querySelector('#favorite').addEventListener('change', this._favoriteButtonClickHandler);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closeButtonClickHandler);
  }

  setDeleteCommentButtonClickHandler(callback) {
    this._callback.deleteCommentButtonClick = callback;
    this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._deleteCommentButtonClickHandler);
  }

  _setCommentInputHandler() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);
  }

  _setEmojiChangeHandler() {
    const inputs = this.getElement().querySelectorAll('.film-details__emoji-item');

    for (const input of inputs) {
      input.addEventListener('change', this._commentEmojiChangeHandler);
    }
  }

  _setInnerHandlers() {
    this._setCommentInputHandler();
    this._setEmojiChangeHandler();
  }

  static parseFilmToData(film) {
    return Object.assign(
      {},
      film,
      {
        state: {
          emoji: null,
          commentText: '',
        },
      },
    );
  }

  static parseDataToFilm(data) {
    data = Object.assign({}, data);

    delete data.state;

    return data;
  }
}
