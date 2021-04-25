import Abstract from './abstract';
import {getWatchedFilmsAmount} from '../utils/film';

const Rating = {
  '1': 'Novice',
  '11': 'Fan',
  '21': 'Movie Buff',
};

const createRatingTemplate = (watchedFilmsAmount) => {
  const ratingLimits = Object.keys(Rating);
  let ratingName = null;

  for (let i = ratingLimits.length - 1; i >= 0; i--) {
    if (watchedFilmsAmount >= Number(ratingLimits[i])) {
      ratingName = Rating[ratingLimits[i]];
    }
  }

  return ratingName ? `<p class="profile__rating">${ratingName}</p>` : '';
};

const createUserProfileTemplate = (films) => {
  const watchedFilmsAmount = getWatchedFilmsAmount(films);

  if (!watchedFilmsAmount) {
    return ' ';
  }

  const ratingTemplate = createRatingTemplate(watchedFilmsAmount);

  return `<section class="header__profile profile">
    ${ratingTemplate}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserProfile extends Abstract {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createUserProfileTemplate(this._films);
  }
}
