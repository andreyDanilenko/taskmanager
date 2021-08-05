import SiteMenuView from './view/site-menu';
import FilterView from './view/filter';
import TaskCardView from './view/task-card';
import BoardView from './view/board';
import SortView from './view/sort';
import TaskListView from './view/task-list';
import LoadMoreButtonView from './view/load-more-button';
import TaskEditView from './view/task-edit';
import { generateTask } from './mocks/task';
import { generateFilter } from './utils/filter';
import { render, renderPosition } from './utils/util';

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;
//new Array() cоздает массив без элементов(только с длинной)
//fill() создает элементы массива (по умолчанию undefined)
//map() создает элемнт массива на каждый новый вызов функции()
const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
// render(siteHeaderElement, createSiteMenuTemplate(), 'beforeend');
// render(siteMainElement, createFilterTemplate(filters), 'beforeend');
// Обращаемся к нашему классу обязательно c new и вызываем метод который записывает в constructor() класса соответсвующую разметку
render(siteHeaderElement, new SiteMenuView().getElement(), renderPosition.BEFOREEND)
render(siteMainElement, new FilterView(filters).getElement(), renderPosition.BEFOREEND);
// render(siteMainElement, createBoardTemplate(), 'beforeend');
const boardComponent = new BoardView();
render(siteMainElement, boardComponent.getElement(), renderPosition.BEFOREEND)
render(boardComponent.getElement(), new SortView().getElement(), renderPosition.AFTERBEGIN)
// render(taskListElement, createTaskEditTemplate(tasks[0]), 'beforeend');
const taskListComponent = new TaskListView();
render(boardComponent.getElement(), taskListComponent.getElement(), renderPosition.BEFOREEND)
render(taskListComponent.getElement(), new TaskEditView(tasks[0]).getElement(), renderPosition.BEFOREEND);
// math.min вернет наименьше из переданных аргументов
// Если данные не моковые и на сервере их меньше чем мы хотим  отрисовать
// Данная конструкция отрисует столько сколько есть
for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  render(taskListComponent.getElement(), new TaskCardView(tasks[i]).getElement(), renderPosition.BEFOREEND);
}

if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  // render(boardElement, createLoadMoreButtonTemplate(), 'beforeend');
  const loadMoreButtonComponent = new LoadMoreButtonView();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), renderPosition.BEFOREEND)

  const loadMoreButton = document.querySelector('.load-more');

  loadMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    tasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
      .forEach((task) => render(taskListComponent.getElement(), new TaskCardView(task).getElement(), renderPosition.BEFOREEND));

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreButton.remove();
    }
  });
}
