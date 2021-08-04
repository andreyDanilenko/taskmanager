import { createSiteMenuTemplate } from './view/site-menu.js';
import { createFilterTemplate } from './view/filter.js';
import { createTaskTemplate } from './view/task.js';
import { createLoadMoreButtonTemplate } from './view/load-more-button.js';
import { createBoardTemplate } from './view/board.js';
import { createTaskEditTemplate } from './view/task-edit.js';
import { generateTask } from './mocks/task.js';

const TASK_COUNT = 3;
//new Array() cоздает массив без элементов(только с длинной)
//fill() создает элементы массива (по умолчанию undefined)
//map() создает элемнт массива на каждый новый вызов функции()
const tasks = new Array(TASK_COUNT).fill().map(generateTask);
console.log(tasks);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');

render(siteHeaderElement, createSiteMenuTemplate(), 'beforeend');
render(siteMainElement, createFilterTemplate(), 'beforeend');
render(siteMainElement, createBoardTemplate(), 'beforeend');

const boardElement = siteMainElement.querySelector('.board');
const taskListElement = boardElement.querySelector('.board__tasks');

render(taskListElement, createTaskEditTemplate(), 'beforeend');

for (let i = 0; i < TASK_COUNT; i++) {
  render(taskListElement, createTaskTemplate(tasks[i]), 'beforeend');
}

render(boardElement, createLoadMoreButtonTemplate(), 'beforeend');
