import SiteMenuView from './view/site-menu';
import FilterView from './view/filter';
import TaskCardView from './view/task-card';
import BoardView from './view/board';
import SortView from './view/sort';
import TaskListView from './view/task-list';
import LoadMoreButtonView from './view/load-more-button';
import TaskEditView from './view/task-edit';
import NoTaskView from './view/task-no';
import { generateTask } from './mocks/task';
import { generateFilter } from './utils/filter';
import { render, RenderPosition, remove, replace } from './utils/render';

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;
//new Array() cоздает массив без элементов(только с длинной)
//fill() создает элементы массива (по умолчанию undefined)
//map() создает элемнт массива на каждый новый вызов функции()
const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);
const siteMainElement = document.querySelector('.main');
const siteHeaderElement = siteMainElement.querySelector('.main__control');
// Функция которая отрисовывает указанное кол-во карточек
// Внутрь передаем так же карточку в активном состоянии
const renderTask = (taskListElement, task) => {
  const taskCardComponent = new TaskCardView(task);
  const taskEditComponent = new TaskEditView(task);
  //Функция меняющая карточку на форму
  const replaceCardToForm = () => {
    // Метод replaceChild('тот который мы хотим подставить', 'выбранный элемент') заменяет выбранный элемент на тот который мы хотим
    replace(taskEditComponent, taskCardComponent)
    // taskListElement.replaceChild(taskEditComponent.getElement(), taskCardComponent.getElement());
  };
  // Функция меняющая форму на карточку
  const replaceFormToCard = () => {
    replace(taskCardComponent, taskEditComponent)
    // taskListElement.replaceChild(taskCardComponent.getElement(), taskEditComponent.getElement());
  };
  // При открытой форме при нажатии на клавишу ESC вызывает функцию замены формы на карточку и удаляет данный оброботчик
  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };
  // Событие по нажатию на кнопку EDit в закрытой карточке задачи 
  // Передаем в метод классса компонента setEditClickHundler функцию которая будет присваиватьс\я значению callback
  // 
  taskCardComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener('keydown', onEscKeyDown);
  });
  // при нажатии кнопуи типа submit форма меняется на закрытую карточку и удаляет обработчик клавиши ESC
  taskEditComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(taskListElement, taskCardComponent.getElement(), RenderPosition.BEFOREEND)
};
// render(siteHeaderElement, createSiteMenuTemplate(), 'beforeend');
// render(siteMainElement, createFilterTemplate(filters), 'beforeend');
// Обращаемся к нашему классу обязательно c new и вызываем метод который записывает в constructor() класса соответсвующую разметку
// render(siteMainElement, createBoardTemplate(), 'beforeend');
const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  render(boardContainer, boardComponent.getElement(), RenderPosition.BEFOREEND)
  // //render(boardComponent.getElement(), new SortView().getElement(), renderPosition.AFTERBEGIN)
  const taskListComponent = new TaskListView();
  render(boardComponent.getElement(), taskListComponent.getElement(), RenderPosition.BEFOREEND)
  // По условию заглушка должна показываться,
  // когда нет задач или все задачи в архиве.
  // Мы могли бы написать:
  // tasks.length === 0 || tasks.every((task) => task.isArchive)
  // Но благодаря тому, что на пустом массиве every вернёт true,
  // мы можем опустить "tasks.length === 0".
  // p.s. А метод some на пустом массиве наборот вернет false
  if (boardTasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new NoTaskView().getElement(), RenderPosition.BEFOREEND)
    return;
  }
  render(boardComponent.getElement(), new SortView().getElement(), RenderPosition.AFTERBEGIN);
  // render(taskListElement, createTaskEditTemplate(tasks[0]), 'beforeend');
  // // render(taskListComponent.getElement(), new TaskEditView(tasks[0]).getElement(), renderPosition.BEFOREEND);
  // math.min вернет наименьше из переданных аргументов
  // Если данные не моковые и на сервере их меньше чем мы хотим  отрисовать
  // Данная конструкция отрисует столько сколько есть
  // for (let i = 0; i < Math.min(boardTasks.length, TASK_COUNT_PER_STEP); i++) {
  //   // // render(taskListComponent.getElement(), new TaskCardView(tasks[i]).getElement(), renderPosition.BEFOREEND);
  //   renderTask(taskListComponent.getElement(), boardTasks[i]);
  // }
  boardTasks
    .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;
    // render(boardElement, createLoadMoreButtonTemplate(), 'beforeend');
    const loadMoreButtonComponent = new LoadMoreButtonView();
    render(boardComponent.getElement(), loadMoreButtonComponent.getElement(), RenderPosition.BEFOREEND)


    loadMoreButtonComponent.setClickHandler(() => {
      boardTasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((task) => renderTask(taskListComponent.getElement(), task)); // render(taskListComponent.getElement(), new TaskCardView(task).getElement(), renderPosition.BEFOREEND));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }
}

render(siteHeaderElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND)
render(siteMainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND)
renderBoard(siteMainElement, tasks)