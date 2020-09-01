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

  const onEscKeyDown = (evt) => {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const replaceCardToForm = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceFormToCard = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
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

  render(mainElement, boardComponent.getElement(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), taskListComponent.getElement(), RenderPosition.BEFOREEND);

  // Если все задачи в архиве или массив задач пустой - отрисовывает заглушку
  if (tasks.every((task) => task.isArchive)) {
    render(boardComponent.getElement(), new NoTasksView().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  // Отрисовка сортировки
  render(boardComponent.getElement(), new SortView().getElement(), RenderPosition.AFTERBEGIN);

  // Отрисовка первой порции карточек задач
  boardTasks
    .slice(0, Math.min(tasks.length, TASK_COUNT_PER_STEP))
    .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

  // Отрисовка кнопки "Load more" и добавление обработчика события клик, отрисовывающего ещё 8 (или меньше) карточек
  if (boardTasks.length > TASK_COUNT_PER_STEP) {
    let renderedTaskCount = TASK_COUNT_PER_STEP;

    const loadMoreBtnComponent = new LoadMoreView();
    render(boardComponent.getElement(), loadMoreBtnComponent.getElement(), RenderPosition.BEFOREEND);

    loadMoreBtnComponent.setLoadMoreClickHandler(() => {
      boardTasks
        .slice(renderedTaskCount, renderedTaskCount + TASK_COUNT_PER_STEP)
        .forEach((boardTask) => renderTask(taskListComponent.getElement(), boardTask));

      renderedTaskCount += TASK_COUNT_PER_STEP;

      if (renderedTaskCount >= boardTasks.length) {
        loadMoreBtnComponent.getElement().remove();
        loadMoreBtnComponent.removeElement();
      }
    });
  }
};


render(menuContainerElement, new MenuView().getElement(), RenderPosition.BEFOREEND);
render(mainElement, new FilterView(filters).getElement(), RenderPosition.BEFOREEND);

renderBoard(mainElement, tasks);
