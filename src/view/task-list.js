import {createElement} from "../util.js";

// Возвращает шаблон списка задач
const createTaskListTemplate = () => {
  return `<div class="board__tasks"></div>`;
};

export default class TaskListView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTaskListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
