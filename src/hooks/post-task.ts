import { axios } from "@/services/instance";


export const usePostTask = () => {
  const postTask = async (data: { name: string; description: string; day: string; month: string; year: string }) => {
    try {
      await axios.post("/tasks", data);
    } catch(err) {
      console.log(err);
    }
  };
  
  return { postTask };
};
