import {MOST_COMMENTED_FILM_AMOUNT, TOP_RATED_FILM_AMOUNT} from '../constants';

const getMostCommentedFilms = (films) => {
  return films.slice().sort((second, first) => first.comments.length - second.comments.length).slice(0, MOST_COMMENTED_FILM_AMOUNT);
};

const getTopRatedFilms = (films) => {
  return films.slice().sort((second, first) => first.filmInfo.totalRating - second.filmInfo.totalRating).slice(0, TOP_RATED_FILM_AMOUNT);
};

const getWatchedFilmsAmount = (films) => {
  return films.filter((film) => film.userDetails.alreadyWatched).length;
};

const getWatchedFilmsRuntime = (films) => {
  return films.reduce((accumulator, currentValue) => {
    return currentValue.userDetails.alreadyWatched ? accumulator + currentValue.filmInfo.runtime : accumulator;
  }, 0);
};

const getSortedFilmsByDate = (films) => {
  return films.slice().sort((firstFilm, secondFilm) => secondFilm.filmInfo.releaseDate - firstFilm.filmInfo.releaseDate);
};

const getSortedFilmsByRating = (films) => {
  return films.slice().sort((firstFilm, secondFilm) => secondFilm.filmInfo.totalRating - firstFilm.filmInfo.totalRating);
};

export {getMostCommentedFilms, getTopRatedFilms, getWatchedFilmsAmount, getWatchedFilmsRuntime, getSortedFilmsByDate, getSortedFilmsByRating};
