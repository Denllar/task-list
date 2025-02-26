import React from 'react';
import { ITask } from "@/App";
import { useDeleteTask } from "@/hooks/delete-task";
import { Modal } from './Modal';
import { useEditTask } from '@/hooks/edit-tasks';
import { useGetTask } from '@/hooks/get-tasks';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

interface TaskProps {
  task: ITask,
  index: number
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>
  currentMonthAndYear: {
    currentMonth: string,
    currentYear: string
  }
}

export const Task: React.FC<TaskProps> = ({ task, index, setTasks, currentMonthAndYear }) => {
  const { deleteTask } = useDeleteTask(task.id);
  const {editTasks} = useEditTask(currentMonthAndYear);
  const { getTasks } = useGetTask(setTasks);
  const [isOp, setIsOp] = React.useState(false)
  const [isDone, setIsDone] = React.useState(task.isDone);
  const [isDisabled, setIsDisabled] = React.useState(false);

  const handleDelete = async () => {
    try {
      if (confirm('Вы уверены, что хотите удалить задачу?')) {  
        await deleteTask();
        setTasks(prev => prev.filter(t => t.id !== task.id));
      }
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };

  const openEditModal = () => {
    setIsOp(true);
  }

  React.useEffect(() => {
    getTasks();
  }, [getTasks, isOp]);

  React.useEffect(() => {
    const taskDate = new Date(
      2000 + parseInt(task.year),
      parseInt(task.month) - 1,
      parseInt(task.day)
    );
    const today = new Date();
    if (taskDate < today) {
      setIsDisabled(true);
    }
  }, [task.year, task.month, task.day]);

  const isPastTask = () => {
    const taskDate = new Date(
      2000 + parseInt(task.year),
      parseInt(task.month) - 1,
      parseInt(task.day)
    );
    const today = new Date();
    if (taskDate < today && !isDone) {
      return 'border-4 border-red-600'
    } 
    return ''
  };

  const isDoneTask = () => {
    editTasks(task.id, { ...task, isDone: !task.isDone });
    setIsDone(!task.isDone);
  }

  return (
    <div className="flex w-full">
      <div className={cn(
        "flex w-full justify-between bg-white mb-4 hover:shadow-lg hover:border-gray-300 hover:shadow-gray-300/40 rounded-xl py-4 px-5 hover:-translate-y-0.5 transition-all duration-200 ease-in-out",
        {
          'border-4 border-green-600': isDone,
          'border-4 border-red-600': !isDone && isPastTask() !== ''
        }
      )}>
        <div>
          <p className="flex items-center text-gray-600 mt-1">
            {index+1}) {task.name}
          </p>
        </div>

        <div className="flex items-center gap-2" style={{ opacity: 1, transform: 'none' }}>
          <div className="text-gray-400">
          {
            task.inThisMonth ? "В течении месяца" : `до ${task.day + '.' + task.month + '.' + task.year}`
          }
          </div>

          <Switch checked={isDone} onClick={isDoneTask} disabled={isDisabled}/>

          <div onClick={openEditModal} className="flex items-center ml-3 cursor-pointer">
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          </div>

          <div onClick={handleDelete} className="flex items-center ml-4 cursor-pointer">
            <svg
              className="h-5 w-5 text-red-400/70 hover:text-red-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </div>
        </div>
      </div>
      <Modal 
        isOpen={isOp} 
        setIsOpen={setIsOp}
        task={task}
        method={'edit'} 
        requestToServer={(data: ITask) => editTasks(task.id, data)} 
      />
    </div>
  );
};
