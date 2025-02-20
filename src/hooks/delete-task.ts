import { axios } from "@/services/instance";

export const useDeleteTask = (id: number) => {
  const deleteTask = async () => {
    try {
      await axios.delete(`/tasks/${id}`);
    } catch(err) {
      console.log(err);
    }
  }

  return { deleteTask };
};
