import {createElement} from "../util.js";

// Возвращает шаблон блока доски задач
const createTaskBoardTemplate = () => {
  return `<section class="board container"></section>`;
};

export default class BoardView {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTaskBoardTemplate();
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
