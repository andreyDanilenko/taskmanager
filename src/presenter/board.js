import BoardView from "../view/board";
import SortView from '../view/sort';
import TaskListView from "../view/task-list";
import NoTaskView from "../view/task-no";
import TaskPresenter from './task'
import LoadMoreButtonView from "../view/load-more-button";
import { render, RenderPosition, remove } from "../utils/render";
import { updateItem } from "../utils/common";
import { SortType } from "../utils/const";
import { sortTaskDown, sortTaskUp } from "../utils/task";

const TASK_COUNT_PER_STEP = 8;

export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponet = new NoTaskView();
    this._currentSortType = SortType.DEFAULT;
    // создаем пустой обьеект для того чтобы можно было добавить любой ключ например id
    // Чтобы наш id не превратился в строку
    // Мы можем сделать ключем даже другой обьект
    this._taskPresenter = new Map()
    this._loadMoreButtonComponent = new LoadMoreButtonView()
    // Обработчик передает в renderTask
    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleLoadMoreButtonClick = this._handleLoadMoreButtonClick.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }
  // Метод который вызывается извне, предает в себя данные, отрисовывая отх в том порядке в котором требуют методы презентера
  init(boardTasks) {
    // Метод возврращающий копию передающего в него массива для того чтобы создавать новую отричовку 
    this._boardTasks = boardTasks.slice()
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this._sourcedBoardTasks = this._boardTasks.slice()

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND)
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND)

    this._renderBoard();
  }
  // Метод мониторит обновление какой либо задачи и обновляет данные
  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);
    this._taskPresenter.get(updatedTask.id).init(updatedTask);
  }

  _sortTasks(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _boardTasks
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _boardTasks исходный массив
        this._boardTasks = this._sourcedBoardTasks.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    console.log(sortType);
    this._sortTasks(sortType)
    this._clearTaskList()
    this._renderTaskList();
  }
  // Метод для отрисовки блока сортировки
  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
  }
  // Метод для отрисовки одной задачи
  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter.set(task.id, taskPresenter);
  }
  // Метод для создания добавления всем презенторам состояния по умолчанию при открытии нового инпута в списке задач
  // Он вызывается когда мы хотим открыть у задачи окно редактирования 
  // Делает сначала проверку на всех имеющихся карточках и переводи в сосотояние по умолчанию все соответсвующие 
  // resetView определен в презентере карточки
  _handleModeChange() {
    this._taskPresenter.forEach((presenter) => presenter.resetView());
  }
  // Метод необходим для новой отрисовки задач в случае ессли на требуется поменять порядок отрисовки карточек
  // например при сортировке
  // Очищаем список и отрисовываем его в том порядке в каком требуется
  _clearTaskList() {
    // Задача проэтерировать все существуюзий презенторы(задачи) вызвать метод destroy() описанный в презенторе (Он удаляет карточку и все чтос ней связано)
    this._taskPresenter.forEach(presenter => presenter.destroy());
    // Методом clear() очищаем наш обьект Map()
    this._taskPresenter.clear();
    // Возвращаем на начальноезначение индекс отрисовки задач
    this._renderTaskCount = TASK_COUNT_PER_STEP;
    remove(this._loadMoreButtonComponent);
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

  _renderTaskList() {
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
    this._renderTaskList()
  }
}