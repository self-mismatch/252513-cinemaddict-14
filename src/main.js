import FooterStatisticView from './view/footer-statistic';
import SiteMenuView from './view/site-menu';
import UserProfileView from './view/user-profile';

import FilmListPresenter from './presenter/film-list';
import FilterPresenter from './presenter/filter';

import CommentModel from './model/comments';
import FilmsModel from './model/films';
import FilterModel from './model/filter';

import {render} from './utils/render';
import {generateFilm} from './mock/film';

const FILM_AMOUNT = 23;

const films = new Array(FILM_AMOUNT).fill().map(generateFilm);

const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const filterModel = new FilterModel();

const commentsModel = new CommentModel();

const siteBody = document.body;
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');

render(siteHeader, new UserProfileView(films));

const siteMenuComponent = new SiteMenuView();

render(siteMain, siteMenuComponent);

const filterPresenter = new FilterPresenter(siteMenuComponent, filmsModel, filterModel);
filterPresenter.init();

const filmListPresenter = new FilmListPresenter(siteMain, filmsModel, filterModel, commentsModel);
filmListPresenter.init();

const footerStatisticsContainer = siteFooter.querySelector('.footer__statistics');

render(footerStatisticsContainer, new FooterStatisticView(films));
