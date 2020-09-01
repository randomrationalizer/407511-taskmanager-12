import {COLORS, REPEATING_DEFAULT} from "../const.js";
import {getRandomInteger} from "../utils/common.js";

// Моковые описания задач
const DESCRIPTIONS = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

// Возвращает случайное значение из массива
const getRandomValue = (values) => {
  const randomIndex = getRandomInteger(0, values.length - 1);
  return values[randomIndex];
};

// Создаёт моковое случайное значение даты дедлайна задачи в интервале +- 7 дней от текущей даты
const generateDate = () => {
  const isDate = Boolean(getRandomInteger(0, 1));

  if (!isDate) {
    return null;
  }

  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  let currentDate = new Date();

  // Устанавливает время наступления дедлайна на 23:59:59 заданной даты
  currentDate.setHours(23, 59, 59, 999);

  currentDate.setDate(currentDate.getDate() + daysGap);

  return new Date(currentDate);
};

// Создает объект случайных дней повторения задачи. Дни повторения выбираются случайно из двух - среды и пятницы
const generateRepeating = () => {
  return {
    mo: false,
    tu: Boolean(getRandomInteger(0, 1)),
    we: false,
    th: false,
    fr: Boolean(getRandomInteger(0, 1)),
    sa: false,
    su: false
  };
};

// Создаёт моковый объект задачи
export const generateTask = () => {
  const dueDate = generateDate();
  const repeating = dueDate === null ? generateRepeating() : REPEATING_DEFAULT;

  return {
    description: getRandomValue(DESCRIPTIONS),
    dueDate,
    repeating,
    color: getRandomValue(COLORS),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isArchive: Boolean(getRandomInteger(0, 1))
  };
};
