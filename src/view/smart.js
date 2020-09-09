import AbstractView from "./abstract.js";

// 'умный' компонент для обновления других компонентов
export default class Smart extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  // обновляет данные и вызывает обновление шаблона
  updateData(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  // удаляет старый DOM элемент, вызывает генерацию нового и заменяет один на другой
  updateElement() {
    let prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);
    prevElement = null;

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error(`Abstract method not implemented: resetHandlers`);
  }
}
