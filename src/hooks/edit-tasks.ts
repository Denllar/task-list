import { ITask } from "@/App";


export const useEditTask = () => {
  const editTasks = async (id: string, updatedData: ITask, isPersonalTasks: boolean) => {
    if (isPersonalTasks) {
      const tasks = JSON.parse(localStorage.getItem('personalTasks') || '[]');
      const updatedTasks = tasks.map((task: ITask) => 
        task.id === id ? { ...task, ...updatedData } : task
      );
      localStorage.setItem('personalTasks', JSON.stringify(updatedTasks));
    } else {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const updatedTasks = tasks.map((task: ITask) => 
        task.id === id ? { ...task, ...updatedData } : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const resetAllTasksStatus = async () => {
    // Получаем все календарные задачи
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    
    // Устанавливаем isDone в false для всех задач
    const updatedTasks = tasks.map((task: ITask) => ({
      ...task,
      isDone: false
    }));
    
    // Сохраняем обновленные задачи
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    return updatedTasks;
  };

  return { editTasks, resetAllTasksStatus };
};
