import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import TaskListView from "./view/task-list.js";
import TaskView from "./view/task.js";
import LoadMoreView from "./view/load-more.js";
import TaskEditView from "./view/task-edit.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {RenderPosition, render} from "./util.js";

const TASK_COUNT = 22;
const TASK_COUNT_PER_STEP = 8;

const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const mainElement = document.querySelector(`.main`);
const menuContainerElement = mainElement.querySelector(`.main__control`);

// Отрисовывает карточку задачи
const renderTask = (taskListElement, task) => {
  const taskComponent = new TaskView(task);
  const taskEditComponent = new TaskEditView(task);
  render(taskListElement, taskComponent.getElement(), RenderPosition.BEFOREEND);

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  taskComponent.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, () => {
    replaceCardToForm();
  });

  taskEditComponent.getElement().querySelector(`form`).addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToCard();
  });
};


render(menuContainerElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

const boardComponent = new BoardView();
render(mainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
render(boardComponent.getElement(), new SortView().getElement(), RenderPosition.AFTERBEGIN);

const taskListComponent = new TaskListView();
render(boardComponent.getElement(), taskListComponent.getElement(), RenderPosition.BEFOREEND);

// Отрисовка первой порции карточек задач
for (let i = 0; i < Math.min(tasks.length, TASK_COUNT_PER_STEP); i++) {
  renderTask(taskListComponent.getElement(), tasks[i]);
}

// Отрисовка кнопки "Load more" и добавление обработчика события клик, отрисовывающего ещё 8 (или меньше) карточек
if (tasks.length > TASK_COUNT_PER_STEP) {
  let renderedTaskCount = TASK_COUNT_PER_STEP;

  const loadMoreBtnComponent = new LoadMoreView();
  render(boardComponent.getElement(), loadMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);


  loadMoreBtnComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();
    tasks.slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP).forEach((task) => {
      renderTask(taskListComponent.getElement(), task);
    });

    renderedTaskCount += TASK_COUNT_PER_STEP;

    if (renderedTaskCount >= tasks.length) {
      loadMoreBtnComponent.getElement().remove();
      loadMoreBtnComponent.removeElement();
    }
  });
}

