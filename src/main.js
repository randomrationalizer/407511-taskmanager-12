import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import BoardView from "./view/board.js";
import SortView from "./view/sort.js";
import TaskListView from "./view/task-list.js";
import NoTasksView from "./view/no-tasks.js";
import TaskView from "./view/task.js";
import LoadMoreView from "./view/load-more.js";
import TaskEditView from "./view/task-edit.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {RenderPosition, render, replace, remove} from "./utils/render.js";

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
  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);

  const onEscKeyDown = (evt) => {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceCardToForm = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceFormToCard = () => {
    replace(taskComponent, taskEditComponent);
  };

  taskComponent.setEditClickHandler(() => {
    replaceCardToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setFormSubmitHandler(() => {
    replaceFormToCard();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });
};

// Отрисовывает доску задач
const renderBoard = (boardContainer, boardTasks) => {
  const boardComponent = new BoardView();
  const taskListComponent = new TaskListView();

  render(mainElement, boardComponent, RenderPosition.BEFOREEND);
  render(boardComponent, taskListComponent, RenderPosition.BEFOREEND);

  // Если все задачи в архиве или массив задач пустой - отрисовывает заглушку
  if (tasks.every((task) => task.isArchive)) {
    render(boardComponent, new NoTasksView(), RenderPosition.AFTERBEGIN);
    return;
  }

  // Отрисовка сортировки
  render(boardComponent, new SortView(), RenderPosition.AFTERBEGIN);

  // Отрисовка первой порции карточек задач
  boardTasks
    .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(taskListComponent, boardTask));

  // Отрисовка кнопки "Load more" и добавление обработчика события клик, отрисовывающего ещё 8 (или меньше) карточек
  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreBtnComponent = new LoadMoreView();
    render(boardComponent, loadMoreBtnComponent, RenderPosition.BEFOREEND);

    loadMoreBtnComponent.setLoadMoreClickHandler(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(taskListComponent, boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        remove(loadMoreBtnComponent);
      }
    });
  }
};


render(menuContainerElement, new MenuView(), RenderPosition.BEFOREEND);
render(mainElement, new FilterView(filters), RenderPosition.BEFOREEND);

renderBoard(mainElement, tasks);
