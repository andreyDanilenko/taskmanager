import * as  dayjs from 'dayjs';
export const isTaskExpiringToday = (dueDate) => dueDate === null ? false : dayjs(dueDate).isSame(dayjs(), 'D');
export const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('D MMMM');
// Сравнивает значание даты с текущей датой методом isAfter() (если дата после указанной то true)
export const isTaskExpired = (dueDate) => dueDate === null ? false : dayjs().isAfter(dueDate, 'D');
// Функция проверяющая повторение задачи (если есть хоть один день недели со значением true) то функция возвращает true
// метод values() вернет массив значений обьекта, а some() проверят есть ли хоть одно значение true
export const isTaskRepeating = (repeating) => Object.values(repeating).some(Boolean); //some((value) => !!value)
// Абстракции нужны для того чтобы в случае смены какого либо инструмента например (библиотека даты)
// не пришлось менять данные во всех компонентах

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortTaskUp = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  if (weight !== null) {
    return weight;
  }

  return dayjs(taskA.dueDate).diff(dayjs(taskB.dueDate));
};

export const sortTaskDown = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dueDate, taskB.dueDate);

  if (weight !== null) {
    return weight;
  }

  return dayjs(taskB.dueDate).diff(dayjs(taskA.dueDate));
};