export const useDeleteTask = (id: string) => {
  const deleteTask = async (isPersonalTasks: boolean) => {
    if (isPersonalTasks) {
      const tasks = JSON.parse(localStorage.getItem('personalTasks') || '[]');
      const taskToDelete = tasks.find((task: { id: string }) => task.id === id);
      if (taskToDelete) {
        const remoteTasks = JSON.parse(localStorage.getItem('remotePersonalTasks') || '[]');
        remoteTasks.push(taskToDelete);
        localStorage.setItem('remotePersonalTasks', JSON.stringify(remoteTasks));
      }
      const updatedTasks = tasks.filter((task: { id: string }) => task.id !== id);
      localStorage.setItem('personalTasks', JSON.stringify(updatedTasks));
    } else {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      const taskToDelete = tasks.find((task: { id: string }) => task.id === id);
      if (taskToDelete) {
        const remoteTasks = JSON.parse(localStorage.getItem('remoteTasks') || '[]');
        remoteTasks.push(taskToDelete);
        localStorage.setItem('remoteTasks', JSON.stringify(remoteTasks));
      }
      const updatedTasks = tasks.filter((task: { id: string }) => task.id !== id);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  }

  return { deleteTask };
};
