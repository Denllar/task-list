import { axios } from "@/services/instance";

type Props = {
  currentMonth: string;
  currentYear: string;
};

export const usePostTask = (currentMonthAndYear: Props) => {
  const postTask = async (data: { name: string; description: string; day: string; month: string; year: string; inThisMonth: boolean }) => {
    try {
      if (data.inThisMonth){
        data.month = currentMonthAndYear.currentMonth;
        data.year = currentMonthAndYear.currentYear;
      }
      await axios.post("/tasks", data);
    } catch(err) {
      console.log(err);
    }
  };
  
  return { postTask };
};
