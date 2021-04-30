import FiltersView from './view/filter';
import FooterStatisticView from './view/footer-statistic';
import SiteMenuView from './view/site-menu';
import UserProfileView from './view/user-profile';

import FilmListPresenter from './presenter/film-list';

import {render, RenderPosition} from './utils/render';
import {generateFilm} from './mock/film';
import {generateFilter} from './utils/filter';

const FILM_AMOUNT = 3;

const films = new Array(FILM_AMOUNT).fill().map(generateFilm);
const filters = generateFilter(films);

const siteBody = document.body;
const siteHeader = siteBody.querySelector('.header');
const siteMain = siteBody.querySelector('.main');
const siteFooter = siteBody.querySelector('.footer');

render(siteHeader, new UserProfileView(films));

const siteMenuComponent = new SiteMenuView();

render(siteMain, siteMenuComponent);
render(siteMenuComponent, new FiltersView(filters), RenderPosition.AFTERBEGIN);

const filmListPresenter = new FilmListPresenter(siteMain);
filmListPresenter.init(films);

const footerStatisticsContainer = siteFooter.querySelector('.footer__statistics');

render(footerStatisticsContainer, new FooterStatisticView(films));
