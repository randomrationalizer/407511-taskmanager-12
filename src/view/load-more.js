import AbstractView from "./abstract.js";

// Возвращает шаблон кнопки `Загрузить ещё`
const createLoadMoreBtnTemplate = () => {
  return `<button class="load-more" type="button">load more</button>`;
};

export default class LoadMoreView extends AbstractView {
  constructor() {
    super();
    this._loadMoreClickHandler = this._loadMoreClickHandler.bind(this);
  }

  getTemplate() {
    return createLoadMoreBtnTemplate();
  }

  _loadMoreClickHandler(evt) {
    evt.preventDefault();
    this._callback.loadMoreClick();
  }

  setLoadMoreClickHandler(callback) {
    this._callback.loadMoreClick = callback;
    this.getElement().addEventListener(`click`, this._loadMoreClickHandler);
  }
}
