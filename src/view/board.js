import AbstractView from "../view/abstarct.js";

// Возвращает шаблон блока доски задач
const createTaskBoardTemplate = () => {
  return `<section class="board container"></section>`;
};

export default class BoardView extends AbstractView {
  getTemplate() {
    return createTaskBoardTemplate();
  }
}
