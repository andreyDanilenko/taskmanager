import dayjs from 'dayjs';
// Простой объект передающий способ отрисовки компонента
export const renderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};
//функция которая отрисовывает элемент в соответствующем контейнере и выбранным способом
export const renderElement = (container, element, place) => {
  switch (place) {
    case renderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case renderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const render = (container, template, place) => { // Испльзовалась для отрисовки и редактирования компонетов
  container.insertAdjacentHTML(place, template);
};
// Принцип работы прост:
// 1. создаём пустой div-блок
// 2. берём HTML в виде строки и вкладываем в этот div-блок, превращая в DOM-элемент
// 3. возвращаем этот DOM-элемент
export const createElement = (template) => {
  const newElement = document.createElement('div'); // 1
  newElement.innerHTML = template; // 2
  // метод firstChild отбрасывает div и отрисовываем только переданный template(дочерний)
  return newElement.firstChild; // 3
};
// Единственный нюанс, что HTML в строке должен иметь общую обёртку,
// то есть быть чем-то вроде <nav><a>Link 1</a><a>Link 2</a></nav>,
// а не просто <a>Link 1</a><a>Link 2</a>

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
export const isTaskExpiringToday = (dueDate) => dueDate === null ? false : dayjs(dueDate).isSame(dayjs(), 'D');
export const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('D MMMM');
// Сравнивает значание даты с текущей датой методом isAfter() (если дата после указанной то true)
export const isTaskExpired = (dueDate) => dueDate === null ? false : dayjs().isAfter(dueDate, 'D');
// Функция проверяющая повторение задачи (если есть хоть один день недели со значением true) то функция возвращает true
// метод values() вернет массив значений обьекта, а some() проверят есть ли хоть одно значение true
export const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean); //some((value) => !!value)
// Абстракции нужны для того чтобы в случае смены какого либо инструмента например (библиотека даты)
// не пришлось менять данные во всех компонентах