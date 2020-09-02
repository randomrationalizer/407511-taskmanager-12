import AbstractView from "../view/abstarct.js";

// Возвращает шаблон списка задач
const createTaskListTemplate = () => {
  return `<div class="board__tasks"></div>`;
};

export default class TaskListView extends AbstractView {
  getTemplate() {
    return createTaskListTemplate();
  }
}
