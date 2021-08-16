import { isTaskExpired, isTaskRepeating, humanizeTaskDueDate } from '../utils/task';
import AbstractView from './abstract';

const createTaskTemplate = (task) => {
  const { description, color, dueDate, repeating, isArchive, isFavorite } = task;
  // Проверяет наличие даты
  const date = dueDate !== null ? humanizeTaskDueDate(dueDate) : '';
  // Проверяет просроченость даты если результат работы функции true
  // Добавляет класс просроченой задачи
  const deadlineClassName = isTaskExpired(dueDate) ? 'card--deadline' : '';
  // Добавляет класс повторяющейся задачи
  const repeatClassName = isTaskRepeating(repeating) ? 'card--repeat' : '';
  // Проверяет флаг обейкта на значение true
  const archiveClassName = isArchive ? 'card__btn--archive card__btn--disabled' : 'card__btn--archive';
  const favoriteClassName = isFavorite ? 'card__btn--favorites card__btn--disabled' : 'card__btn--favorites';

  return `<article class="card card--${color} ${deadlineClassName} ${repeatClassName}">
    <div class="card__form">
      <div class="card__inner">
        <div class="card__control">
          <button type="button" class="card__btn card__btn--edit">
            edit
          </button>
          <button type="button" class="card__btn ${archiveClassName}">
            archive
          </button>
          <button
            type="button"
            class="card__btn ${favoriteClassName}">
            favorites
          </button>
        </div>
        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>
        <div class="card__textarea-wrap">
          <p class="card__text">${description}</p>
        </div>
        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              <div class="card__date-deadline">
                <p class="card__input-deadline-wrap">
                  <span class="card__date">${date}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>`;
};

export default class TaskCard extends AbstractView {
  constructor(task) {
    super();
    this._task = task;
    // создаем новое значение конструктора в которую запишем результат работы метода _editClickHandler()
    // Передаем в нее метод запускающий функцию с привязкой метода bind
    // Метод байнд берет результат работы _editClickHandler(evt) и выполняет ее в контексте 
    // Значение this в методе bind это ссылка на текущий экзкмпляр функции обьекта
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._archiveClickHandler = this._archiveClickHandler.bind(this);
    this._editClickHandler = this._editClickHandler.bind(this)
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    // Здесь берем наше значение из конструктора this._callback и активируем в нем функцию 
    this._callback.favoriteClick();
  }

  _archiveClickHandler(evt) {
    evt.preventDefault();
    // Здесь берем наше значение из конструктора this._callback и активируем в нем функцию 
    this._callback.archiveClick();
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    // Здесь берем наше значение из конструктора this._callback и активируем в нем функцию 
    this._callback.editClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector('.card__btn--favorites').addEventListener('click', this._favoriteClickHandler);
  }

  setArchiveClickHandler(callback) {
    this._callback.archiveClick = callback;
    this.getElement().querySelector('.card__btn--archive').addEventListener('click', this._archiveClickHandler);
  }
  // Метод в который будет передоваться callback функция из вне
  // Снаружи это будет new TaskCard.getElement.setEditClickHundler(()=>{ код который что-то делает})
  setEditClickHandler(callback) {
    // callback перадный извне присваивается свойству заимсвоного от родителя this._callback который является по умолчанию пустым обьектом
    // Записываем callback в значение editClick // Поосле чего наше значение this._callback хранит функцию 
    this._callback.editClick = callback;
    // После чего свойство из конструктора класса _editClickHandler() присваивается обработчику кнопки this.getElement().querySelector('.card__btn--edit')
    // Мы не пердаем метод bind сразу в обработчике по причине того что мы не сможем потом отменить это событие
    // В данном случае это не грозит а вот где нибудь может возникнуть проблема например открытия попап окна наверно
    this.getElement().querySelector('.card__btn--edit').addEventListener('click', this._editClickHandler);
  }
}
// // Принцип работы метода bind
// const bindContext = function (context, fn) {
//   return function (...args) {
//     return fn.call(context, ...args);
//   };
// };