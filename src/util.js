// Позиция отрисовки элемента
export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

// Отрисовывает элемент в контейнере
export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

// Создаёт DOM-элемент компонента
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// Отрисовывает шаблон элемента
export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Возвращает сегодняшнюю дату
const getCurrentDate = () => {
  const currentDate = new Date();
  currentDate.setHours(23, 59, 59, 999);
  return new Date(currentDate);
};

// Возвращает случайное целое число в диапазоне от a до b (включая b)
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
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
