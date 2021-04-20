import {createElement} from '../utils/render';

const FilterName = {
  'ALL': 'All movies',
  'WATCHLIST': 'Watchlist',
  'HISTORY': 'History',
  'FAVORITES': 'Favorites',
};

const createFilterTemplate = (filter, isChecked) => {
  const {name, count} = filter;

  const filterActiveClass = isChecked ? 'main-navigation__item--active' : '';
  const filterNameUpperCase = name.toUpperCase();

  const filterCountTemplate = count !== null ? `<span class="main-navigation__item-count">${count}</span>` : '';

  return `<a href="#${name}" class="main-navigation__item ${filterActiveClass}">${FilterName[filterNameUpperCase]} ${filterCountTemplate}</a>`;
};

const createFiltersTemplate = (filters) => {
  const filtersTemplate = filters
    .map((filter, index) => createFilterTemplate(filter, index === 0))
    .join('');

  return `<div class="main-navigation__items">
    ${filtersTemplate}
  </div>`;
};

export default class Filter {
  constructor(filters) {
    this._filters = filters;

    this._element = null;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
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
