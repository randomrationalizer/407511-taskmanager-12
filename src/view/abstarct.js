import {createElement} from "../util.js";

// Абстрактный класс компонентов
export default class AbstarctView {
  constructor() {
    if (new.target === AbstarctView) {
      throw new Error(`Can't instantiate Abstract class, only concrete one.`);
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Abstract method not implemented: getTemplate`);
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
