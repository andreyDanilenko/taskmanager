import { isTaskExpired, isTaskRepeating, isTaskExpiringToday } from './task';

export const taskToFilterMap = {
  all: (tasks) => tasks.filter((task) => !task.isArchive).length,
  overdue: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => isTaskExpired(task.dueDate)).length,
  today: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => isTaskExpiringToday(task.dueDate)).length,
  favorites: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => task.isFavorite).length,
  repeating: (tasks) => tasks
    .filter((task) => !task.isArchive)
    .filter((task) => isTaskRepeating(task.repeating)).length,
  archive: (tasks) => tasks.filter((task) => task.isArchive).length,
};

// Функция считающая длинну соттветсвующего флага 
// Берем обьек значения которого это функция высчитывающая длину соответсвующего состояния задачи (флаг)
// С помощью Object.entries(taskToFilterMap) создаем массив массивов (если ключей и значений больше 1) [[all, f(tasks)], ...] 
// Методом map() создаем массив из обьектов где старые ключь и значение [all, f(tasks)] становятся значениями зарание заданных ключей
// {name: all , count: f(tasks)}, функция f(tasks) принимает массив с данными вычисляя длину соответсвующего флага
export const generateFilter = (tasks) => Object.entries(taskToFilterMap).map(
  ([filterName, countTasks]) => ({
    name: filterName,
    count: countTasks(tasks),
  }),
);