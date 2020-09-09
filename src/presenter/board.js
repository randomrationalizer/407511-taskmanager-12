
import BoardView from "../view/board.js";
import SortView from "../view/sort.js";
import TaskListView from "../view/task-list.js";
import NoTasksView from "../view/no-tasks.js";
import LoadMoreView from "../view/load-more.js";
import {RenderPosition, render, remove} from "../utils/render.js";
import {SortType} from "../const.js";
import {sortTaskUp, sortTaskDown} from "../utils/task.js";
import TaskPresenter from "./task.js";
import {updateItem} from "../utils/common.js";

const TASK_COUNT_PER_STEP = 8;


// Конструктор доски - создаёт, отрисовывает элементы, навешивает обработчики
export default class Board {
  constructor(boardContainer) {
    this._boardContainer = boardContainer;
    this._renderedTaskCount = TASK_COUNT_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._taskPresenter = {};

    this._boardComponent = new BoardView();
    this._sortComponent = new SortView();
    this._taskListComponent = new TaskListView();
    this._noTaskComponent = new NoTasksView();
    this._loadMoreBtnComponent = new LoadMoreView();

    this._handleTaskChange = this._handleTaskChange.bind(this);
    this._handleLoadMoreBtnClick = this._handleLoadMoreBtnClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
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

  // перерисовка карточки при изменении данных
  _handleTaskChange(updatedTask) {
    this._boardTasks = updateItem(this._boardTasks, updatedTask);
    this._sourcedBoardTasks = updateItem(this._sourcedBoardTasks, updatedTask);
    this._taskPresenter[updatedTask.id].init(updatedTask);
  }

  _handleModeChange() {
    Object.values(this._taskPresenter).forEach((presenter) => presenter.resetView());
  }

  // отрисовка задачи
  _renderTask(task) {
    const taskPresenter = new TaskPresenter(this._taskListComponent, this._handleTaskChange, this._handleModeChange);
    taskPresenter.init(task);
    this._taskPresenter[task.id] = taskPresenter;
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
    Object.entries(this._taskPresenter).forEach((presenter) => presenter.destroy());
    this._taskPresenter = {};
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
