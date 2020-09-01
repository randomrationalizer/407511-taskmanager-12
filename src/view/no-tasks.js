import AbstractView from "../view/abstarct.js";

const createNoTasksTemplate = () => {
  return `<p class="board__no-tasks">
          Click «ADD NEW TASK» in menu to create your first task
        </p>`;
};

export default class NoTasksView extends AbstractView {
  getTemplate() {
    return createNoTasksTemplate();
  }
}
