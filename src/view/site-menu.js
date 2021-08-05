import { createElement } from "../utils/util";

// Функцию для генерации HTML-разметки можно превратить в метод класса,
// однако делать мы этого не будем, чтобы не раздувать diff изменений

// На этапе формирования компонетов мы передавали данную функцию с разметкой
// Теперь будем отрисовывать ее из класса
const createSiteMenuTemplate = () => (
  `<section class="control__btn-wrap">
    <input
      type="radio"
      name="control"
      id="control__new-task"
      class="control__input visually-hidden"
    />
    <label for="control__new-task" class="control__label control__label--new-task"
      >+ ADD NEW TASK</label
    >
    <input
      type="radio"
      name="control"
      id="control__task"
      class="control__input visually-hidden"
      checked
    />
    <label for="control__task" class="control__label">TASKS</label>
    <input
      type="radio"
      name="control"
      id="control__statistic"
      class="control__input visually-hidden"
    />
    <label for="control__statistic" class="control__label"
      >STATISTICS</label
    >
  </section>`
);
// Класс экспортируется только с использованием ключевого слова default
export default class SiteMenu {
  // функция конструктор служит для создания и инициализации оъекта Class
  // Просто: Конструирует объект со значением null ("_приватное" поле(не меняется с наружи, только методами внутри))
  constructor() {
    this._element = null;
  }
  // Метод возвраращаюший функцию с разметкой, которая в будущем будет отрисовываться через функцию createElement
  getTemplate() {
    return createSiteMenuTemplate();
  }

  getElement() {
    // Если в обьекте element ниего нет то мы записывем в него разметку через функцию createElement
    // которая отрисовывает разметку на страницу
    // метод this служить обращение к элементам класса
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    // сответсвенно в любом случае вернется не пустой элемент
    return this._element
  }
  // Метод удаляющий элемент
  removeElement() {
    this._element = null;
  }
}
