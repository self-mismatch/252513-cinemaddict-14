import {MOST_COMMENTED_FILM_AMOUNT, TOP_RATED_FILM_AMOUNT} from '../constants';

const getMostCommentedFilms = (films) => {
  return films.slice().sort((second, first) => first.comments.length - second.comments.length).slice(0, MOST_COMMENTED_FILM_AMOUNT);
};

const getTopRatedFilms = (films) => {
  return films.slice().sort((second, first) => first.filmInfo.totalRating - second.filmInfo.totalRating).slice(0, TOP_RATED_FILM_AMOUNT);
};

export {getMostCommentedFilms, getTopRatedFilms};
