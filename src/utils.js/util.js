import dayjs from 'dayjs';
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
