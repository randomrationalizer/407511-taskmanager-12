import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

// Возвращает шаблон блока сортировки карточек
const createSortTemplate = () => {
  return `<div class="board__filter-list">
      <a href="#" data-sort-type="${SortType.DEFAULT}" class="board__filter">SORT BY DEFAULT</a>
      <a href="#" data-sort-type="${SortType.DATE_UP}" class="board__filter">SORT BY DATE up</a>
      <a href="#" data-sort-type="${SortType.DATE_DOWN}" class="board__filter">SORT BY DATE down</a>
    </div>`;
};

export default class SortView extends AbstractView {
  constructor() {
    super();
    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
  }

  _sortChangeHandler(evt) {
    if (evt.target.tagName !== `A`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`click`, this._sortChangeHandler);
  }
}
