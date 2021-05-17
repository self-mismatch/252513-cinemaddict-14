import FooterStatisticView from './view/footer-statistic';
import SiteMenuView from './view/site-menu';
import UserProfileView from './view/user-profile';
import StatsView from './view/stats';

import FilmListPresenter from './presenter/film-list';
import FilterPresenter from './presenter/filter';

import CommentModel from './model/comments';
import FilmsModel from './model/films';
import FilterModel from './model/filter';

import {FilterType, MenuItem, UpdateType} from './constants';

import {remove, render} from './utils/render';
import {generateFilms} from './mock/film';
import {generateComments} from './mock/comment';

const PageMode = {
  FILMS: 'FILMS',
  STATS: 'STATS',
};

const FILM_AMOUNT = 23;

const films = generateFilms(FILM_AMOUNT);
console.log(films);
const comments = generateComments(films);
console.log(comments);

window.comments = comments;

films.forEach((film) => {
  comments[film.id].forEach((comment) => {
    film.comments.push(comment.id);
  });
});

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const commentsModel = new CommentModel();

const siteBody = document.body;
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');

render(siteHeader, new UserProfileView(filmsModel.getFilms()));

const siteMenuComponent = new SiteMenuView();

render(siteMain, siteMenuComponent);

const filterPresenter = new FilterPresenter(siteMenuComponent, filmsModel, filterModel);
filterPresenter.init();

const filmListPresenter = new FilmListPresenter(siteMain, filmsModel, filterModel, commentsModel);
filmListPresenter.init();

let currentPageMode = PageMode.FILMS;
let statsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  if (menuItem === MenuItem.STATS && currentPageMode === PageMode.FILMS) {
    currentPageMode = PageMode.STATS;

    filterModel.setFilter(UpdateType.MAJOR, FilterType.ALL);
    filmListPresenter.destroy();

    statsComponent = new StatsView(filmsModel.getFilms());
    render(siteMain, statsComponent);
  } else if (menuItem !== MenuItem.STATS && currentPageMode === PageMode.STATS) {
    currentPageMode = PageMode.FILMS;

    filmListPresenter.init();

    remove(statsComponent);
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

const footerStatisticsContainer = siteFooter.querySelector('.footer__statistics');

render(footerStatisticsContainer, new FooterStatisticView(filmsModel.getFilms()));
