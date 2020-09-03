import {COLORS, REPEATING_DEFAULT} from "../const.js";
import {isTaskRepeating, isTaskExpired, humanizeDate} from "../utils/task.js";
import AbstractView from "./abstract.js";

const BLANK_TASK = {
  color: COLORS[0],
  description: ``,
  dueDate: null,
  repeating: REPEATING_DEFAULT,
  isArchive: false,
  isFavorite: false
};

// Возвращает шаблон выбора даты
const createTaskDateEditTemplate = (dueDate) => {
  return `<button class="card__date-deadline-toggle" type="button">
      date: <span class="card__date-status">${dueDate !== null ? `yes` : `no`}</span>
    </button>

    ${dueDate !== null ? `<fieldset class="card__date-deadline" disabled>
      <label class="card__input-deadline-wrap">
        <input
          class="card__date"
          type="text"
          placeholder=""
          name="date"
          value="${humanizeDate(dueDate)}"
        />
      </label>
      </fieldset>` : ``}`;
};

// Возвращает шаблон выбора дней повторения
const createTaskRepeatingEditTemplate = (repeating) => {
  return `<button class="card__repeat-toggle" type="button">
      repeat:<span class="card__repeat-status">${isTaskRepeating(repeating) ? `yes` : `no`}</span>
    </button>
    ${isTaskRepeating(repeating) ? `<fieldset class="card__repeat-days">
      <div class="card__repeat-days-inner">
        ${Object.entries(repeating).map(([day, repeat]) => `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}"
          name="repeat"
          value="${day}"
          ${repeat ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}"
          >${day}</label
        >`).join(``)}
      </div>
    </fieldset>` : ``}`;
};

// Возвращает шаблон выбора цвета задачи
const createTaskColorEditTemplate = (currentColor) => {
  return COLORS.map((color) => `<input
    type="radio"
      id="color-${color}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${color === currentColor ? `checked` : ``}
    />
    <label
      for="color-${color}"
      class="card__color card__color--${color}"
      >${color}</label
    >`).join(``);
};

// Возвращает шаблон формы редактирования/создания задачи
const createTaskEditFormTemplate = (task) => {
  const {color, description, dueDate, repeating} = task;

  const deadlineClassName = isTaskExpired(dueDate) ? `card--deadline` : ``;
  const dateTemplate = createTaskDateEditTemplate(dueDate);
  const repeatingClassName = isTaskRepeating(repeating) ? `card--repeat` : ``;
  const repeatingTemplate = createTaskRepeatingEditTemplate(repeating);
  const colorsTemplate = createTaskColorEditTemplate(color);

  return `<article class="card card--edit card--${color} ${deadlineClassName} ${repeatingClassName}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                ${dateTemplate}
                ${repeatingTemplate}
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
              ${colorsTemplate}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">cancel</button>
          </div>
        </div>
      </form>
    </article>`;
};

export default class TaskEditView extends AbstractView {
  constructor(task = BLANK_TASK) {
    super();
    this._task = task;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
  }

  getTemplate() {
    return createTaskEditFormTemplate(this._task);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }
}
