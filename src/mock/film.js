import {
  MIN_ACTORS_AMOUNT,
  MAX_ACTORS_AMOUNT,
  MIN_AGE_RATING,
  MAX_AGE_RATING,
  MIN_DESCRIPTION_SENTENCES_AMOUNT,
  MAX_DESCRIPTION_SENTENCES_AMOUNT,
  MIN_GENRES_AMOUNT,
  MAX_GENRES_AMOUNT,
  MIN_RATING,
  MAX_RATING,
  MIN_RUNTIME,
  MAX_RUNTIME,
  MIN_WRITERS_AMOUNT,
  MAX_WRITERS_AMOUNT,
  ACTORS,
  COUNTRIES,
  DESCRIPTIONS,
  DIRECTORS,
  GENRES,
  POSTERS,
  TITLES,
  WRITERS
} from './constants';
import {
  getRandomBoolean,
  getRandomDate,
  getRandomElement,
  getRandomElements,
  getRandomFloat,
  getRandomInteger
} from './utils/common';
import {generateComments} from './comment';

import {nanoid} from 'nanoid';

const generateActors = () => {
  const actorsAmount = getRandomInteger(MIN_ACTORS_AMOUNT, MAX_ACTORS_AMOUNT);

  return getRandomElements(ACTORS, actorsAmount);
};

const generateAgeRating = () => {
  return getRandomInteger(MIN_AGE_RATING, MAX_AGE_RATING);
};

const generateCountry = () => {
  return getRandomElement(COUNTRIES);
};

const generateDescription = () => {
  const sentencesAmount = getRandomInteger(MIN_DESCRIPTION_SENTENCES_AMOUNT, MAX_DESCRIPTION_SENTENCES_AMOUNT);

  return getRandomElements(DESCRIPTIONS, sentencesAmount).join(' ');
};

const generateDirector = () => {
  return getRandomElement(DIRECTORS);
};

const generateGenres = () => {
  const genresAmount = getRandomInteger(MIN_GENRES_AMOUNT, MAX_GENRES_AMOUNT);

  return getRandomElements(GENRES, genresAmount);
};

const generatePoster = () => {
  return getRandomElement(POSTERS);
};

const generateTotalRating = () => {
  return getRandomFloat(MIN_RATING, MAX_RATING);
};

const generateReleaseDate = () => {
  return getRandomDate();
};

const generateRuntime = () => {
  return getRandomInteger(MIN_RUNTIME, MAX_RUNTIME);
};

const generateTitle = () => {
  return getRandomElement(TITLES);
};

const generateWriters = () => {
  const writersAmount = getRandomInteger(MIN_WRITERS_AMOUNT, MAX_WRITERS_AMOUNT);

  return getRandomElements(WRITERS, writersAmount);
};

export const generateFilm = () => {
  const comments = generateComments();

  const id = nanoid();

  const actors = generateActors();
  const ageRating = generateAgeRating();
  const country = generateCountry();
  const description = generateDescription();
  const director = generateDirector();
  const genres = generateGenres();
  const poster = generatePoster();
  const title = generateTitle();
  const totalRating = generateTotalRating();
  const releaseDate = generateReleaseDate();
  const runtime = generateRuntime();
  const writers = generateWriters();

  const alreadyWatched = getRandomBoolean();
  const favorite = getRandomBoolean();
  const watchlist = getRandomBoolean();

  return {
    comments,
    id,
    filmInfo: {
      actors,
      ageRating,
      alternativeTitle: title,
      country,
      description,
      director,
      genres,
      poster,
      totalRating,
      releaseDate,
      runtime,
      title,
      writers,
    },
    userDetails: {
      alreadyWatched,
      favorite,
      watchlist,
    },
  };
};
