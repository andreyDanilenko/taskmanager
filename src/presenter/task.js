import TaskCardView from "../view/task-card";
import TaskEditView from "../view/task-edit";
import { replace, render, RenderPosition, remove } from "../utils/render";

export default class Task {
  constructor(taskListContainer) {
    this._taskListContainer = taskListContainer;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);


  }

  init(task) {
    this._task = task;
    // Записываем значение компонетов при первом запуске init()
    // Чтобы изменять данные компонтов в зависимости от действий пользователя при следующем вызове инит
    // первый вызов помечает их как null после чего в них записываются создынные элементы
    const prevTaskComponent = this._taskComponent;
    const prevTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskCardView(task);
    this._taskEditComponent = new TaskEditView(task);

    this._taskComponent.setEditClickHandler(this._handleEditClick);
    this._taskEditComponent.setFormSubmitHandler(this._handleFormSubmit)
    // Первый запуск отметил наши переменные prev как null следовательно выполняется данный if
    // Второй запуск говрит что в prev записаны компонеты не важно те или другие и ведет дальше
    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render(this._taskListContainer, this._taskComponent, RenderPosition.BEFOREEND);
      return;
    }
    // Проверяет есть ли уже такая же карточка, если да то он меняет на новую 
    if (this._taskComponent.getElement().contains(prevTaskComponent.getElement())) {
      replace(this._taskComponent, prevTaskComponent);
    }
    // Аналогично с формой
    if (this._taskEditComponent.getElement().contains(prevTaskComponent.getElement())) {
      replace(this._taskEditComponent, prevTaskComponent);
    }
    // Удаление предыдущих // Очишает переменные prev
    remove(prevTaskComponent)
    remove(prevTaskEditComponent)
  }



  // Методдля удаления указанной карточки
  destroy() {
    remove(this._taskComponent);
    remove(this._taskEditComponent);
  }



  _replaceCardToForm() {
    replace(this._taskEditComponent, this._taskComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  };



  _replaceFormToCard() {
    replace(this._taskComponent, this._taskEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  };




  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._replaceFormToCard()
    }
  }


  
  _handleEditClick() {
    this._replaceCardToForm();
  }

  _handleFormSubmit() {
    this._replaceFormToCard();
  }


}