import Abstract from './abstract';

const createFilterTemplate = (filter, currentFilterType) => {
  const {count, name, type} = filter;

  const filterActiveClass = type === currentFilterType ? 'main-navigation__item--active' : '';

  const filterCountTemplate = count !== null ? `<span class="main-navigation__item-count">${count}</span>` : '';

  return `<a href="#${type}" class="main-navigation__item ${filterActiveClass}">${name} ${filterCountTemplate}</a>`;
};

const createFiltersTemplate = (filters, currentFilterType) => {
  const filtersTemplate = filters
    .map((filter) => createFilterTemplate(filter, currentFilterType))
    .join('');

  return `<div class="main-navigation__items">
    ${filtersTemplate}
  </div>`;
};

export default class Filter extends Abstract {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.getAttribute('href').substr(1));
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
