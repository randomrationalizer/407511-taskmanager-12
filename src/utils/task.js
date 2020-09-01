// Возвращает сегодняшнюю дату
const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  return new Date(currentDate);
};

// Проверяет, является ли задача повторяющейся
export const isTaskRepeating = (repeating) => {
  return Object.values(repeating).some(Boolean);
};

// Проверяет, просрочена ли задача
export const isTaskExpired = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate.getTime() > dueDate.getTime();
};

// Проверяет, наступает ли дедлайн задачи сегодня
export const isTaskExpiringToday = (dueDate) => {
  if (dueDate === null) {
    return false;
  }

  const currentDate = getCurrentDate();

  return currentDate.getTime() === dueDate.getTime();
};

// Возвращает дату в удобочитаемом формате
export const humanizeDate = (date) => {
  return date.toLocaleString(`en-US`, {day: `numeric`, month: `long`});
};
