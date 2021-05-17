import {MIN_COMMENTS, MAX_COMMENTS, COMMENTS_AUTHORS, COMMENTS_CONTENT, COMMENTS_EMOTIONS} from './constants';
import {getRandomDate, getRandomElement, getRandomInteger} from './utils/common';

import {nanoid} from 'nanoid';

const generateAuthor = () => {
  return getRandomElement(COMMENTS_AUTHORS);
};

const generateContent = () => {
  return getRandomElement(COMMENTS_CONTENT);
};

const generateDate = () => {
  return getRandomDate(new Date(2020, 0, 31));
};

const generateEmotion = () => {
  return getRandomElement(COMMENTS_EMOTIONS);
};

const generateComment = () => {

  const author = generateAuthor();
  const content = generateContent();
  const date = generateDate();
  const emotion = generateEmotion();
  const id = nanoid();

  return {
    author,
    content,
    date,
    emotion,
    id,
  };
};

export const generateComments = (films) => {
  const comments = {};

  films.forEach((film) => {
    comments[film.id] = new Array(getRandomInteger(MIN_COMMENTS, MAX_COMMENTS)).fill().map(generateComment);
  });

  return comments;
};
