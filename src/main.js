import {createMenuTemplate} from "./view/menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createTaskBoardTemplate} from "./view/board.js";
import {createSortTemplate} from "./view/sort.js";
import {createTaskTemplate} from "./view/task.js";
import {createLoadMoreBtnTemplate} from "./view/load-more.js";
import {createTaskEditFormTemplate} from "./view/task-edit.js";

const TASK_COUNT = 3;

// Отрисовывает элемент на странице
const renderElement = (element, template, place = `beforeend`) => {
  element.insertAdjacentHTML(place, template);
};

// Отрисовывает N карточек задач
const renderTasks = (count) => {
  for (let i = 0; i < count; i++) {
    renderElement(taskListElement, createTaskTemplate());
  }
};

const mainElement = document.querySelector(`.main`);
const menuContainerElement = mainElement.querySelector(`.main__control`);

renderElement(menuContainerElement, createMenuTemplate());
renderElement(mainElement, createFilterTemplate());
renderElement(mainElement, createTaskBoardTemplate());

const taskBoardElement = mainElement.querySelector(`.board`);

renderElement(taskBoardElement, createSortTemplate(), `afterbegin`);

const taskListElement = taskBoardElement.querySelector(`.board__tasks`);

renderTasks(TASK_COUNT);
renderElement(taskListElement, createTaskEditFormTemplate(), `afterbegin`);
renderElement(taskBoardElement, createLoadMoreBtnTemplate());
