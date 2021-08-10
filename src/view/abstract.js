import { createElement } from '../utils/render.js';

export default class Abstract {
  constructor() {
    // Функация конструктор будет, которая во время стороннего использования 
    // Будет производить проверку, чтоб не использоваться на прямую, а наследоваться 
    if (new.target === Abstract) {
      throw new error('Can\'t instantiate Abstract, only concrete one.');
    }

    this._element = null;
    // Приватное поле в котором будут хоаниться ссылки на обработчики
    // Наприме this._editClick = this._editClick.bind(this)
    this._callback = {};
  }

  getTemplate() {
    throw new Error('Abstract method not implemented: getTemplate');
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}


