import {isTaskRepeating, isTaskExpired, isTaskExpiringToday} from "../util.js";


// Мапа соответствия названий фильтров и функций-счётчиков количества элементов, удовлетворяющих фильтру
const taskToFilterMap = {
  all: (tasks) => tasks.filter((task) => !task.isArchive).length,
  overdue: (tasks) => tasks.filter((task) => !task.isArchive).filter((task) => isTaskExpired(task.dueDate)).length,
  today: (tasks) => tasks.filter((task) => !task.isArchive).filter((task) => isTaskExpiringToday(task.dueDate)).length,
  favorites: (tasks) => tasks.filter((task) => !task.isArchive).filter((task) => task.isFavorite).length,
  repeating: (tasks) => tasks.filter((task) => !task.isArchive).filter((task) => isTaskRepeating(task.repeating)).length,
  archive: (tasks) => tasks.filter((task) => task.isArchive).length
};

// Создаёт объект моковых данных фильтра
export const generateFilter = (tasks) => {
  return Object.entries(taskToFilterMap).map(([filterName, countTasks]) => {
    return {
      name: filterName,
      count: countTasks(tasks)
    };
  });
};
