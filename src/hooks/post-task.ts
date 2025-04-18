
interface TaskData {
  id: string;
  name: string;
  description: string;
  day: string;
  month: string;
  year: string;
  isDone: boolean;
}

export const usePostTask = () => {
  const postTask = async (data: TaskData, isPersonalTasks: boolean) => {
    try {
      const uniqueID = `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      data.id = uniqueID;

      if (isPersonalTasks) {
        const tasks = JSON.parse(localStorage.getItem('personalTasks') || '[]');  
        tasks.push(data);
        localStorage.setItem('personalTasks', JSON.stringify(tasks));
      } else {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');  
        tasks.push(data);
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
    } catch(err) {
      console.log(err);
    }
  };
  
  return { postTask };
};
