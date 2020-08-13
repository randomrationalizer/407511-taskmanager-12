import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createTaskBoardTemplate} from "./view/board.js";
import {createSortTemplate} from "./view/sort.js";
import {createTaskTemplate} from "./view/task.js";
import {createLoadMoreBtnTemplate} from "./view/load-more.js";
import {createTaskEditFormTemplate} from "./view/task-edit.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

// Отрисовывает элемент на странице
const renderElement = (element, template, place = `beforeend`) => {
  element.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.main`);
const menuContainerElement = mainElement.querySelector(`.main__control`);

renderElement(menuContainerElement, createMenuTemplate());
renderElement(mainElement, createFilterTemplate(filters));
renderElement(mainElement, createTaskBoardTemplate());

const taskBoardElement = mainElement.querySelector(`.board`);

renderElement(taskBoardElement, createSortTemplate(), `afterbegin`);

const taskListElement = taskBoardElement.querySelector(`.board__tasks`);


renderElement(taskListElement, createTaskEditFormTemplate(tasks[0]), `afterbegin`);

// Отрисовка первой порции карточек задач
for (let i = 1; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  renderElement(taskListElement, createTaskTemplate(tasks[i]));
}

// Отрисовка кнопки "Load more" и добавление обработчика события клик, отрисовывающего ещё 8 (или меньше) карточек
if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;
  renderElement(taskBoardElement, createLoadMoreBtnTemplate());
  const loadMoreBtnElement = taskBoardElement.querySelector(`.load-more`);

  loadMoreBtnElement.addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP).forEach((task) => {
      renderElement(taskListElement, createTaskTemplate(task));
    });

    renderedTaskCount += TASK_COUNT_PER_STEP;
    if (renderedTaskCount >= tasks.length) {
      loadMoreBtnElement.remove();
    }
  });
}

