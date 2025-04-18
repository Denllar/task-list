//import { axios } from "@/services/instance";
import React from 'react';

import { ITask } from "@/App";

const sortTasks = (tasks: ITask[]): ITask[] => {
  return tasks.sort((a, b) => {
    // Сравниваем по годам
    if (a.year !== b.year) {
      return parseInt(a.year) - parseInt(b.year);
    }
    // Сравниваем по месяцам
    if (a.month !== b.month) {
      return parseInt(a.month) - parseInt(b.month);
    }
    // Сравниваем по дням
    return parseInt(a.day) - parseInt(b.day);
  });
};

export const useGetTask = (setTasks: React.Dispatch<React.SetStateAction<ITask[]>>, setPersonalTasks: React.Dispatch<React.SetStateAction<ITask[]>>) => {
  const getTasks = React.useCallback(async (isOpenTrash: boolean) => {
    try {
      const tasks = localStorage.getItem(isOpenTrash ? 'remoteTasks' : 'tasks');
      const data = tasks ? JSON.parse(tasks) : [];   
      const sortedTasks = sortTasks(data); 
      setTasks(sortedTasks);

      const personalTasks = localStorage.getItem(isOpenTrash ? 'remotePersonalTasks' : 'personalTasks');
      const personalData = personalTasks ? JSON.parse(personalTasks) : [];   
      const sortedPersonalTasks = sortTasks(personalData); 
      setPersonalTasks(sortedPersonalTasks);
    } catch(err) {
      console.log(err);
    }
  }, [setTasks, setPersonalTasks]);
  
  return { getTasks };
};
