const Filter = {
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

  return `<a href="#${name}" class="main-navigation__item ${filterActiveClass}">${Filter[filterNameUpperCase]} ${filterCountTemplate}</a>`;
};

export const createFiltersTemplate = (filters) => {
  const filtersTemplate = filters
    .map((filter, index) => createFilterTemplate(filter, index === 0))
    .join('');

  return `<div class="main-navigation__items">
    ${filtersTemplate}
  </div>`;
};
