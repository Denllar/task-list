import { axios } from "@/services/instance";

import { ITask } from "@/App";


export const useEditTask = () => {
  const editTasks = async (id: number, data: ITask) => {
    try {
      await axios.patch(`/tasks/${id}`, data);
    } catch(err) {
      console.log(err);
    }
  };
  
  return { editTasks };
};
