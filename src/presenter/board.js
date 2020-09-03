
import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import TaskListView from "../view/task-list.js";
import NoTasksView from "../view/no-tasks.js";
import TaskView from "../view/task.js";
import LoadMoreView from "../view/load-more.js";
import TaskEditView from "../view/task-edit.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";
import {SortType} from "../const.js";
import {sortTaskUp, sortTaskDown} from "../utils/task.js";

const TASK_COUNT_PER_STEP = 8;


// Конструктор доски - создаёт, отрисовывает элементы, навешивает обработчики
export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTasksView();
    this._loadMoreBtnComponent = new LoadMoreView();

    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  // инициализация доски
  init(boardTasks) {
    this._boardTasks = boardTasks.slice();
    this._sourcedBoardTasks = boardTasks.slice();
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._taskListComponent, RenderPosition.BEFOREEND);
    this._renderBoard();
  }

  // сортировка
  _renderSort() {
    render(this._boardComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortChangeHandler(this._handleSortTypeChange);
  }

  // Сортирует задачи
  _sortTasks(sortType) {
    switch (sortType) {
      case SortType.DATE_UP:
        this._boardTasks.sort(sortTaskUp);
        break;
      case SortType.DATE_DOWN:
        this._boardTasks.sort(sortTaskDown);
        break;
      default:
        this._boardTasks = this._sourcedBoardTasks.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTasks(sortType);
    this._clearTaskList();
    this._renderTaskList();
  }

  // отрисовка задачи
  _renderTask(task) {
    const taskComponent = new TaskView(task);
    const taskEditComponent = new TaskEditView(task);

    const replaceCardToForm = () => {
      replace(taskEditComponent, taskComponent);
    };

    const replaceFormToCard = () => {
      replace(taskComponent, taskEditComponent);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === `Esc` || evt.key === `Escape`) {
        evt.preventDefault();
        replaceFormToCard();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    taskComponent.setEditClickHandler(() => {
      replaceCardToForm();
      document.addEventListener(`keydown`, onEscKeyDown);
    });

    taskEditComponent.setFormSubmitHandler(() => {
      replaceFormToCard();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._taskListComponent, taskComponent, RenderPosition.BEFOREEND);
  }

  // отрисовка N задач
  _renderTasks(start, end) {
    this._boardTasks.slice(start, end).forEach((boardTask) => this._renderTask(boardTask));
  }

  _renderNoTasks() {
    render(this._boardComponent, this._noTaskComponent, RenderPosition.AFTERBEGIN);
  }

  _handleLoadMoreBtnClick() {
    this._renderTasks(this._renderedTaskCount, this._renderedTaskCount + TASK_COUNT_PER_STEP);
    this._renderedTaskCount += TASK_COUNT_PER_STEP;

    if (this._renderedTaskCount >= this._boardTasks.length) {
      remove(this._loadMoreBtnComponent);
    }
  }

  _renderLoadMoreBtn() {
    render(this._boardComponent, this._loadMoreBtnComponent, RenderPosition.BEFOREEND);

    this._loadMoreBtnComponent.setLoadMoreClickHandler(this._handleLoadMoreBtnClick);
  }

  _renderTaskList() {
    this._renderTasks(0, Math.min(this._boardTasks.length, TASK_COUNT_PER_STEP));

    if (this._boardTasks.length > TASK_COUNT_PER_STEP) {
      this._renderLoadMoreBtn();
    }
  }

  _clearTaskList() {
    this._taskListComponent.getElement().innerHTML = ``;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
  }

  _renderBoard() {
    if (this._boardTasks.every((task) => task.isArchive)) {
      this._renderNoTasks();
      return;
    }

    this._renderSort();
    this._renderTaskList();
  }
}
