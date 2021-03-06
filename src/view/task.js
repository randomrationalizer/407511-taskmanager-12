import {isTaskRepeating, isTaskExpired, humanizeDate} from "../utils/task.js";
import AbstractView from "./abstract.js";

// Возвращает шаблон карточки задачи
const createTaskTemplate = (task) => {
  const {description, color, dueDate, repeating, isFavorite, isArchive} = task;
  const date = dueDate === null ? `` : humanizeDate(dueDate);
  const deadlineClassName = isTaskExpired(dueDate) ? `card--deadline` : ``;
  const repeatingClassName = isTaskRepeating(repeating) ? `card--repeat` : ``;
  const favoritedClassName = isFavorite ? `card__btn--favorites card__btn--disabled` : `card__btn--favorites`;
  const archivedClassName = isArchive ? `card__btn--archive card__btn--disabled` : `card__btn--archive`;

  return `<article class="card card--${color} ${deadlineClassName} ${repeatingClassName}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn ${archivedClassName}">
              archive
            </button>
            <button
              type="button"
              class="card__btn ${favoritedClassName}"
            >
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}.</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`;
};

export default class TaskView extends AbstractView {
  constructor(task) {
    super();
    this._task = task;
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createTaskTemplate(this._task);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.card__btn--edit`).addEventListener(`click`, this._editClickHandler);
  }
}
