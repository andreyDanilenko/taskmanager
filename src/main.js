import SiteMenuView from './view/site-menu';
import FilterView from './view/filter';
import BoardPresenter from './presenter/board';
import { generateTask } from './mocks/task';
import { generateFilter } from './utils/filter';
import { render, RenderPosition } from './utils/render';

const TASK_COUNT = 22;

//new Array() cоздает массив без элементов(только с длинной)
//fill() создает элементы массива (по умолчанию undefined)
//map() создает элемнт массива на каждый новый вызов функции()
const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);
console.log(tasks);
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

const boardPresenter = new BoardPresenter(siteMainElement)

render(siteHeaderElement, new SiteMenuView(), RenderPosition.BEFOREEND)
render(siteMainElement, new FilterView(filters), RenderPosition.BEFOREEND)
boardPresenter.init(tasks)