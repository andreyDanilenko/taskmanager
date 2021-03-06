import BoardView from "../view/board";
import SortView from '../view/sort';
import TaskListView from "../view/task-list";
import NoTaskView from "../view/task-no";
import TaskPresenter from './task'
import LoadMoreButtonView from "../view/load-more-button";
import { render, RenderPosition, remove } from "../utils/render";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponet = new NoTaskView();

    this._loadMoreButtonComponent = new LoadMoreButtonView();
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this)

  }
  // Метод который вызывается извне, предает в себя данные, отрисовывая отх в том порядке в котором требуют методы презентера
  init(boardTasks) {
    // Метод возврращающий копию передающего в него массива для того чтобы создавать новую отричовку 
    this._boardTasks = boardTasks.slice()

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND)
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND)

    this._renderBoard();
  }
  // Метод для отрисовки блока сортировки
  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }
  // Метод для отрисовки одной задачи
  _renderTask(task) {
    const taskPresentor = new TaskPresenter(this._taskListComponent);
    taskPresentor.init(task)
  }
  // Метод для отрисовки заданного количества задач
  _renderTasks(from, to) {
    this._boardTasks
      .slice(from, to)
      .forEach(boardTask => this._renderTask(boardTask))
  }
  // Методдля отрисовки при отсутствии данных
  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponet, RenderPosition.BEFOREEND)
  }
  // Метод отрисовки кнопки 
  _handleLoadMoreButtonClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    this._renderedTaskCount += TASK_COUNT_PER_STEP;

    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreButtonComponent);
    }
  }

  _renderLoadMoreButton() {
    render(this._boardComponent, this._loadMoreButtonComponent, RenderPosition.BEFOREEND);
    this._loadMoreButtonComponent.setClickHandler(this._handleLoadMoreButtonClick);
  }

  _renderTasksList() {
    // math.min вернет наименьше из переданных аргументов
    // Если данные не моковые и на сервере их меньше чем мы хотим  отрисовать
    // Данная конструкция отрисует столько сколько есть
    // Изначальная прорисовка от 0 до 8, если ниже то от скольки есть
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreButton();
    }
  }
  // Отрисовка главного блока
  _renderBoard() {
    // По условию заглушка должна показываться,
    // когда нет задач или все задачи в архиве.
    // Мы могли бы написать:
    // tasks.length === 0 || tasks.every((task) => task.isArchive)
    // Но благодаря тому, что на пустом массиве every вернёт true,
    // мы можем опустить "tasks.length === 0".
    // p.s. А метод some на пустом массиве наборот вернет false
    if (this._boardTasks.every((task) => task.taskIsArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTasksList()
  }
}