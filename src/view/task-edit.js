import { humanizeTaskDueDate, isTaskRepeating } from '../utils/task';
import { COLORS } from '../utils/const';
import AbstractView from './abstract';

const BLANK_TASK = {
  color: COLORS[0],
  description: '',
  dueDate: null,
  repeating: {
    mo: false,
    tu: false,
    we: false,
    th: false,
    fr: false,
    sa: false,
    su: false,
  },
  isArchive: false,
  isFavorite: false,
};
// Меняем функцию проверки даты на флаг который будет парсить функция парсер
const createTaskEditDateTemplate = (dueDate, isDueDate) => (
  `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${isDueDate ? 'yes' : 'no'}</span>
    </button>
    ${isDueDate ? `<fieldset class="card__date-deadline">
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${humanizeTaskDueDate(dueDate)}"
        />
      </label>
    </fieldset>` : ''}
  `
);
// Меняем функцию проверки повторения даты на флаг который будет парсить функция парсер
const createTaskEditRepeatingTemplate = (repeating, isRepeating) => (
  `<button class="card__repeat-toggle" type="button">
    repeat:<span class="card__repeat-status">${isRepeating ? 'yes' : 'no'}</span>
  </button>
  ${isRepeating ? `<fieldset class="card__repeat-days">
    <div class="card__repeat-days-inner">
      ${Object.entries(repeating).map(([day, repeat]) => `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}"
        name="repeat"
        value="${day}"
        ${repeat ? 'checked' : ''}
      />
      <label class="card__repeat-day" for="repeat-${day}"
        >${day}</label
      >`).join('')}
    </div>
  </fieldset>` : ''}`
);

const createTaskEditColorsTemplate = (currentColor) => (
  COLORS.map((color) => `<input
    type="radio"
    id="color-${color}"
    class="card__color-input card__color-input--${color} visually-hidden"
    name="color"
    value="${color}"
    ${currentColor === color ? 'checked' : ''}
  />
  <label
    for="color-${color}"
    class="card__color card__color--${color}"
    >${color}</label
  >`).join('')
);

const createTaskEditTemplate = (data) => {
  const { color, description, dueDate, repeating, isDueDate, isRepeating } = data;

  const dateTemplate = createTaskEditDateTemplate(dueDate, isDueDate);

  const repeatingClassName = isRepeating
    ? 'card--repeat'
    : '';
  const repeatingTemplate = createTaskEditRepeatingTemplate(repeating, isRepeating);

  const colorsTemplate = createTaskEditColorsTemplate(color);

  return `<article class="card card--edit card--${color} ${repeatingClassName}">
    <form class="card__form" method="get">
      <div class="card__inner">
        <div class="card__color-bar">
          <svg class="card__color-bar-wave" width="100%" height="10">
            <use xlink:href="#wave"></use>
          </svg>
        </div>
        <div class="card__textarea-wrap">
          <label>
            <textarea
              class="card__text"
              placeholder="Start typing your text here..."
              name="text"
            >${description}</textarea>
          </label>
        </div>
        <div class="card__settings">
          <div class="card__details">
            <div class="card__dates">
              ${dateTemplate}
              ${repeatingTemplate}
            </div>
          </div>
          <div class="card__colors-inner">
            <h3 class="card__colors-title">Color</h3>
            <div class="card__colors-wrap">
              ${colorsTemplate}
            </div>
          </div>
        </div>
        <div class="card__status-btns">
          <button class="card__save" type="submit">save</button>
          <button class="card__delete" type="button">delete</button>
        </div>
      </div>
    </form>
  </article>`;
};

export default class TaskEdit extends AbstractView {
  constructor(task = BLANK_TASK) {
    super()

    // Превращаем полученную информацию с сервера в состояние для того чтобы его редактировать
    this._data = TaskEdit.parseTaskToData(task);  // Задача к данным

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._descriptionTextareaHandler = this._descriptionTextareaHandler.bind(this);
    this._dueDateToggleHandler = this._dueDateToggleHandler.bind(this);
    this._repeatingToggleHandler = this._repeatingToggleHandler.bind(this);

    this._setInnerHandlers()
  }

  getTemplate() {
    // Отрисует состояние парсенное из актуальной информации с сервера
    return createTaskEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
  }
  // Заносим обработчики кнопок по дате в отдельный метод
  _setInnerHandlers() {
    this.getElement()
      .querySelector('.card__date-deadline-toggle')
      .addEventListener('click', this._dueDateToggleHandler);
    this.getElement()
      .querySelector('.card__repeat-toggle')
      .addEventListener('click', this._repeatingToggleHandler);
    this.getElement()
      .querySelector('.card__text')
      .addEventListener('input', this._descriptionTextareaHandler);
  }
  // Метод оброботчика меняющий сотояние даты есть или нет
  _dueDateToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isDueDate: !this._data.isDueDate,
    })
  }
  // Метод оброботчика менющего состояние повторения даты есть или нет
  _repeatingToggleHandler(evt) {
    evt.preventDefault();
    this.updateData({
      isRepeating: !this._data.isRepeating,
    })
  }
  // Такой же метод как и все меняет состояние поля ввода и фиксирует его в будущем
  _descriptionTextareaHandler(evt) {
    evt.preventDefault();
    this.updateData({
      description: evt.target.value,
    }, true);
  }
  // Метод обновления состояния при взамодействии с клиентом
  updateData(update, justDataUpdating) { // Обновление состояния
    if (!update) {
      return;
    }

    this._data = Object.assign(
      {},
      this._data,
      update,
    );
    // если значение данного паремтра true то функция завершает работу и не перерисовывает окно лишний раз
    // Без данного флага с тексарии будет пропадать фокус так как после ввода каждого символа будеть происходить обновление карточки
    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }
  // метод обновления шаблона элемента
  updateElement() { // Обновление элемента
    // Записываем создание нового элемента в переменную 
    const prevElement = this.getElement();
    // Возвращает родителя созданному элементу
    const parent = prevElement.parentElement;
    // Так как мы записали созданный элемент в перменную prevElement
    // удаляем созданный элемент 
    this.removeElement();

    // меняем содержимое формы или чего нибудь еще 

    // создаем новый элемент с измененными данными 
    const newElement = this.getElement();
    // меням предыдущий элемент на обновленный newElement
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    // После редактирования состояния задачи данный колбек вызывает парсинг нашего состояния в данные 
    // отправляя их презентору, который пересылает их в модель(сервер)
    // Этот колбек передан из презентера задачи где параметром является здача
    // попадающая в функцию обновления данных
    this._callback.formSubmit(TaskEdit.parseDataToTask(this._data)); // Данные к задаче
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }
  // Данные функции Переводят полученную информацию с сервера в состояние которомыми управляет и редактирует пользователь
  // И после редактирования превращает состояние в информацию для отправки на сервер(ничего не понятно пока)

  // Task это информация приходящая из модели. Данная функция превращает ее в состояние Data с которым
  // пользователь будет работать и менять его
  static parseTaskToData(task) { // Задача к данным
    return Object.assign(
      {},
      task,
      {
        isDueDate: task.dueDate !== null,
        isRepeating: isTaskRepeating(task.repeating),
      },
    );
  }
  // Задача данной функции превращать измения сделанные пользователем в информацию и отправлять ее в модель
  // например при нажатии на кнопку сохранить
  // После нажатия кнопки сохранить данные уходять на сервер и возвращаются в наш компонент обновленными
  static parseDataToTask(data) { // Данные к задаче
    data = Object.assign({}, data);

    if (!data.isDueDate) {
      data.dueDate = null;
    }

    if (!data.isRepeating) {
      data.repeating = {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false,
      };
    }

    delete data.isDueDate;
    delete data.isRepeating;

    return data;
  }
}