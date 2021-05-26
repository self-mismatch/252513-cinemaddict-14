import FooterStatisticView from './view/footer-statistic';
import SiteMenuView from './view/site-menu';
import StatsView from './view/stats';

import FilmListPresenter from './presenter/film-list';
import FilterPresenter from './presenter/filter';

import CommentModel from './model/comments';
import FilmsModel from './model/films';
import FilterModel from './model/filter';

import {FilterType, MenuItem, UpdateType} from './constants';

import Api from './api';

import {remove, render} from './utils/render';

const AUTHORIZATION = 'Basic x8zj1qbe6pzt6en';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';

const PageMode = {
  FILMS: 'FILMS',
  STATS: 'STATS',
};

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const filterModel = new FilterModel();
const commentsModel = new CommentModel();

const siteBody = document.body;
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');

const siteMenuComponent = new SiteMenuView();
render(siteMain, siteMenuComponent);

const filterPresenter = new FilterPresenter(siteMenuComponent, filmsModel, filterModel);
filterPresenter.init();

const filmListPresenter = new FilmListPresenter(siteHeader, siteMain, filmsModel, filterModel, commentsModel, api);
filmListPresenter.init();

let currentPageMode = PageMode.FILMS;
let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  if (menuItem === MenuItem.STATS && currentPageMode === PageMode.FILMS) {
    currentPageMode = PageMode.STATS;

    filmListPresenter.destroy();
    filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);

    statsComponent = new StatsView(filmsModel.getFilms());
    render(siteMain, statsComponent);
  } else if (menuItem !== MenuItem.STATS && currentPageMode === PageMode.STATS) {

    currentPageMode = PageMode.FILMS;

    remove(statsComponent);

    filmListPresenter.init();
    filterModel.setFilter(UpdateType.MAJOR, FilterType[menuItem.toUpperCase()]);
  }
};

const footerStatisticsContainer = siteFooter.querySelector('.footer__statistics');

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  })
  .finally(() => {
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

    render(footerStatisticsContainer, new FooterStatisticView(filmsModel.getFilms()));
  });
