import MenuView from "./view/menu.js";
import FilterView from "./view/filter.js";
import BoardPresenter from "./presenter/board.js";
import {generateTask} from "./mock/task.js";
import {generateFilter} from "./mock/filter.js";
import {RenderPosition, render} from "./utils/render.js";

const TASK_COUNT = 22;


const tasks = new Array(TASK_COUNT).fill().map(generateTask);
const filters = generateFilter(tasks);

const mainElement = document.querySelector(`.main`);
const menuContainerElement = mainElement.querySelector(`.main__control`);

const boardPresenter = new BoardPresenter(mainElement);

render(menuContainerElement, new MenuView(), RenderPosition.BEFOREEND);
render(mainElement, new FilterView(filters), RenderPosition.BEFOREEND);

boardPresenter.init(tasks);
