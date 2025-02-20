import { axios } from "@/services/instance";

import { ITask } from "@/App";

type Props = {
  currentMonth: string;
  currentYear: string;
};

export const useEditTask = (currentMonthAndYear: Props) => {
  const editTasks = async (id: number, data: ITask) => {
    try {
      if (data.inThisMonth){
        data.month = currentMonthAndYear.currentMonth;
        data.year = currentMonthAndYear.currentYear;
      }
      await axios.patch(`/tasks/${id}`, data);
    } catch(err) {
      console.log(err);
    }
  };
  
  return { editTasks };
};
