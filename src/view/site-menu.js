import Abstract from './abstract';

const createSiteMenuTemplate = () => {
  return `<nav class="main-navigation">
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class SiteMenu extends Abstract {
  constructor() {
    super();

    this._statsMenuItem = this.getElement().querySelector('.main-navigation__additional');

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }
  getTemplate() {
    return createSiteMenuTemplate();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  _menuClickHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();

    const menuItem = evt.target.getAttribute('href').substr(1);
    this._callback.menuClick(menuItem);

    if (menuItem === 'stats') {
      this._setActiveMenuItem();
    } else {
      this._unsetActiveMenuItem();
    }
  }

  _setActiveMenuItem() {
    this._statsMenuItem.classList.add('main-navigation__additional--active');
  }

  _unsetActiveMenuItem() {
    this._statsMenuItem.classList.remove('main-navigation__additional--active');
  }
}
