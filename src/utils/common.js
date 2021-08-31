// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};
// // В данную функцию передаем массив данных и вторым пареметром передаем задучу которую нужно обновить
// export const updateItem = (items, update) => {
//   // В индекс записываем перебирание массива и поиска в нем сответствующей задаче переданной во втором аргумете
//   // осуществялем поиск по id и в случае совпадения берем его индекс 
//   const index = items.findIndex((item) => item.id === update.id);
//   //  -1 если такого значения в данных нет 
//   if (index === -1) {
//     return items;
//   }
//   // Если значение есть то вырезаем из массива старый элемент и добавляем обновленный
//   return [
//     ...items.slice(0, index),
//     update,
//     ...items.slice(index + 1),
//   ];
// };
