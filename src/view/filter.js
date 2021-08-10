import AbstractView from './abstract'

const createFilterItemTemplate = (filter, isChecked) => {
  const { name, count } = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? 'checked' : ''}
      ${count === 0 ? 'disabled' : ''}
    />
    <label for="filter__${name}" class="filter__label">
      ${name} <span class="filter__${name}-count">${count}</span></label
    >`
  );
};

const createFilterTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<section class="main__filter filter container">
    ${filterItemsTemplate}
  </section>`;
};

export default class Filters extends AbstractView {
  constructor(filters) {
    // Метод используется, при добавление или изменении свойст в потомке абстрактного класса
    // Данный метод снаяала вызывает Родительский конструкт после чего можно добавлять свои свойства или методы
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}