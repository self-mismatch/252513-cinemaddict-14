import {MIN_COMMENTS, MAX_COMMENTS, COMMENTS_AUTHORS, COMMENTS_CONTENT, COMMENTS_EMOTIONS} from './constants';
import {getRandomDate, getRandomElement, getRandomInteger} from './utils/common';

const generateAuthor = () => {
  return getRandomElement(COMMENTS_AUTHORS);
};

const generateContent = () => {
  return getRandomElement(COMMENTS_CONTENT);
};

const generateDate = () => {
  return getRandomDate(new Date(2020, 1, 31));
};

const generateEmotion = () => {
  return getRandomElement(COMMENTS_EMOTIONS);
};

let id = 0;

const generateComment = () => {
  id++;

  const author = generateAuthor();
  const content = generateContent();
  const date = generateDate();
  const emotion = generateEmotion();

  return {
    author,
    content,
    date,
    emotion,
    id,
  };
};

export const generateComments = () => {
  return new Array(getRandomInteger(MIN_COMMENTS, MAX_COMMENTS)).fill().map(generateComment);
};
