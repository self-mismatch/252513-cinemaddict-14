const getRandomBoolean = () => {
  return Math.random() < 0.5;
};

const getRandomDate = (start = new Date(1980, 0, 1), end = new Date()) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomElement = (array) => {
  return array[getRandomInteger(0, array.length - 1)];
};

const getRandomElements = (array, amount = 5) => {
  const uniqArray = array.slice();
  const elements = [];

  for (let i = 0; i < amount; i++) {
    const randomElement = getRandomElement(uniqArray);
    const indexOfRandomElement = uniqArray.indexOf(randomElement);

    elements.push(uniqArray.splice(indexOfRandomElement, 1).join(''));
  }

  return elements;
};

const getRandomFloat = (a = 0, b = 1) => {
  const lower = a;
  const upper = b;

  return Number((Math.random() * (upper - lower) + lower).toFixed(1));
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export {getRandomBoolean, getRandomDate, getRandomElement, getRandomElements, getRandomFloat, getRandomInteger};
