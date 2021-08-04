import * as dayjs from 'dayjs';
import { COLORS } from '../utils.js/const.js';
import { getRandomInteger } from '../utils.js/util.js';

const generateDescription = () => {
  const descriptions = [
    'Изучить теорию',
    'Сделать домашку',
    'Пройти интенсив на соточку',
  ];

  const randomIndex = getRandomInteger(0, descriptions.length - 1);

  return descriptions[randomIndex];
};
// Генерация случайной даты
export const generateDate = () => {
  const isDate = Boolean(getRandomInteger(0, 1));
  // Условия когда даты нет
  if (!isDate) {
    return null;
  }

  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};
//Генерация дней повторения
const generateRepeating = () => ({
  mo: false,
  tu: false,
  we: Boolean(getRandomInteger(0, 1)),
  th: false,
  fr: Boolean(getRandomInteger(0, 1)),
  sa: false,
  su: false,
});

const getRandomColor = () => {
  const randomIndex = getRandomInteger(0, COLORS.length - 1);

  return COLORS[randomIndex];
};

export const generateTask = () => {
  const dueDate = generateDate();
  // Если даты нет, то включаются дни повторения.
  const repeating = dueDate === null
    ? generateRepeating()
    : {
      mo: false,
      tu: false,
      we: false,
      th: false,
      fr: false,
      sa: false,
      su: false,
    };

  return {
    description: generateDescription(),
    dueDate,
    repeating,
    color: getRandomColor(),
    isArchive: Boolean(getRandomInteger(0, 1)),
    isFavorite: Boolean(getRandomInteger(0, 1)),
  };
};
