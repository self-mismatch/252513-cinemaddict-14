import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrBefore);

const getWatchedFilms = (films) => {
  return films.filter((film) => film.userDetails.alreadyWatched);
};

const getWatchedFilmsInDateRange = (films, dateFrom) => {
  const watchedFilms = getWatchedFilms(films);

  return dateFrom !== 'all' ? watchedFilms.filter((film) => dateFrom.isSameOrBefore(dayjs(film.userDetails.watchingDate))) : watchedFilms;
};

const getGenres = (films) => {
  const FilmGenre = {};

  const watchedFilms = getWatchedFilms(films);

  watchedFilms.forEach((film) => {
    film.filmInfo.genres.forEach((genre) => {
      if (genre in FilmGenre) {
        FilmGenre[genre] += 1;
      } else {
        FilmGenre[genre] = 1;
      }
    });
  });

  return FilmGenre;
};

const getSortedGenres = (films) => {
  const FilmGenre = getGenres(films);

  return Object.entries(FilmGenre).sort((firstGenre, secondGenre) => secondGenre[1] - firstGenre[1]);
};

const getTopGenre = (films) => {
  return getSortedGenres(films)[0][0];
};

export {getWatchedFilmsInDateRange, getSortedGenres, getTopGenre};
