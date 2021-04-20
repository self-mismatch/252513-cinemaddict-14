import {createElement} from '../utils/render';

const createExtraFilmTemplate = (id, title) => {
  return `<section class="films-list films-list--extra" id="${id}">
    <h2 class="films-list__title">${title}</h2>
    <div class="films-list__container"></div>
  </section>`;
};

export default class ExtraFilm {
  constructor(id, title) {
    this._id = id;
    this._title = title;

    this._element = null;
  }

  getTemplate() {
    return createExtraFilmTemplate(this._id, this._title);
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
