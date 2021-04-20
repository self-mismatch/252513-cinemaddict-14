import {createElement} from '../utils/render';

const createFooterStatisticTemplate = (films) => {
  return `<p>${films.length} movies inside</p>`;
};

export default class FooterStatistic {
  constructor(films) {
    this._films = films;

    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticTemplate(this._films);
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
