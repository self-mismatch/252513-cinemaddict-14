import {getWatchedFilmsAmount} from '../utils/film';
import {createElement} from '../utils/render';

// Возможен рефакторинг структуры
const Rating = {
  '1': 'Novice',
  '11': 'Fan',
  '21': 'Movie Buff',
};

const createRatingTemplate = (films) => {
  const watchedFilmsAmount = getWatchedFilmsAmount(films);

  if (watchedFilmsAmount <= 0) {
    return '';
  }

  const ratingLimits = Object.keys(Rating);

  for (let i = ratingLimits.length - 1; i >= 0; i--) {
    if (watchedFilmsAmount >= Number(ratingLimits[i])) {
      return `<p class="profile__rating">${Rating[ratingLimits[i]]}</p>`;
    }
  }
};

const createUserProfileTemplate = (films) => {
  if (films.length <= 0) {
    return '';
  }

  const ratingTemplate = createRatingTemplate(films);

  return `<section class="header__profile profile">
    ${ratingTemplate}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserProfile {
  constructor(films) {
    this._films = films;

    this._element = null;
  }

  getTemplate() {
    return createUserProfileTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
