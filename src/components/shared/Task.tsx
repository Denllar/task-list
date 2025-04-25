import React from 'react';
import { ITask } from "@/App";
import { useDeleteTask } from "@/hooks/delete-task";
import { Modal } from './Modal';
import { useEditTask } from '@/hooks/edit-tasks';
import { cn } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { Button } from '@/components/ui/button';

interface TaskProps {
  task: ITask,
  index: number
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>
  currentDate: {
    currentMonth: string,
    currentYear: string,
    currentDay: string,
  }
  isPersonalTasks?: boolean
  setPersonalTasks?: React.Dispatch<React.SetStateAction<ITask[]>>
  isOpenTrash?: boolean
  onReturnTask?: (task: ITask) => void
}

export const Task: React.FC<TaskProps> = ({ task, setTasks, currentDate, isPersonalTasks = false, setPersonalTasks, isOpenTrash, onReturnTask }) => {
  const { deleteTask } = useDeleteTask(task.id);
  const { editTasks } = useEditTask();
  const [isOp, setIsOp] = React.useState(false)
  const [isDone, setIsDone] = React.useState(task.isDone);
  const [isReturned, setIsReturned] = React.useState(false);
  const { currentDay, currentMonth, currentYear } = currentDate;

  const handleDelete = async () => {
    try {
      if (confirm('Вы уверены, что хотите удалить задачу?')) {
        await deleteTask(isPersonalTasks);
        if (isPersonalTasks && setPersonalTasks) {
          setPersonalTasks(prev => prev.filter(t => t.id !== task.id));
        } else {
          setTasks(prev => prev.filter(t => t.id !== task.id));
        }
      }
    } catch (error) {
      console.error('Ошибка при удалении задачи:', error);
    }
  };

  const openEditModal = () => {
    setIsOp(true);
  }


  const isPastTask = () => {
    // Если задача "в течении месяца" (day === '') и месяц совпадает с текущим
    if (task.day === '' && task.month === currentMonth) {
      return '';
    }

    // Для задач с конкретной датой
    const taskDate = new Date(`20${task.year}-${task.month}-${task.day}`);
    const date = new Date(`${currentYear}-${currentMonth}-${currentDay}`);
    return taskDate < date ? 'border-4 border-red-600' : '';
  };

  const isDoneTask = async () => {
    const newIsDone = !isDone;
    try {
      setIsDone(newIsDone);
      await editTasks(task.id, { ...task, isDone: newIsDone }, isPersonalTasks);
      if (isPersonalTasks && setPersonalTasks) {
        setPersonalTasks(prev => prev.map(t =>
          t.id === task.id ? { ...t, isDone: newIsDone } : t
        ));
      } else {
        setTasks(prev => prev.map(t =>
          t.id === task.id ? { ...t, isDone: newIsDone } : t
        ));
      }
    } catch (error) {
      setIsDone(!newIsDone);
      console.error('Ошибка при обновлении задачи:', error);
    }
  }

  const requestToServer = async (data: ITask) => {
    try {
      const updatedTask = await editTasks(task.id, {
        ...data,
        isDone: task.isDone
      }, isPersonalTasks);
      if (isPersonalTasks && setPersonalTasks) {
        setPersonalTasks(prev => prev.map(t =>
          t.id === task.id ? { ...data, id: task.id, isDone: task.isDone } : t
        ));
      } else {
        setTasks(prev => prev.map(t =>
          t.id === task.id ? { ...data, id: task.id, isDone: task.isDone } : t
        ));
      }
      return updatedTask;
    } catch (error) {
      console.error('Ошибка при обновлении задачи:', error);
      throw error;
    }
  }

  const handleReturnTask = () => {
    if (onReturnTask) {
      onReturnTask(task);
      setIsReturned(true);
    }
  };

  return (
    <div className="flex w-full flex-grow relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              "flex w-full items-center bg-white hover:shadow-lg hover:border-gray-300 hover:shadow-gray-300/40 rounded-xl py-4 px-5 hover:-translate-y-0.5 transition-all duration-200 ease-in-out",
              {
                'border-4 border-green-600': isDone,
                'border-4 border-red-600': !isDone && isPastTask() !== ''
              }
            )}>
              {/* Основной текст задачи - прижат к левому краю */}
              <div className="flex-grow text-left break-words">
                <p className="text-gray-600">
                  {task.name}
                </p>
              </div>

              {/* Правая часть с датой и кнопками */}
              <div className="flex items-center gap-2 pl-4 flex-shrink-0">
                <div className="flex flex-col text-gray-400 whitespace-nowrap">
                  {
                    !isPersonalTasks && (
                      <>
                        {task.day === '' ? "В течении месяца" : `до ${task.day} числа`}
                      </>
                    )
                  }
                  
                  <p className="text-gray-400">
                    {task.author}
                  </p>
                </div>

                {
                  !isOpenTrash ?
                  <div>
                    <Switch checked={isDone} onClick={isDoneTask} />

                    {/* Кнопка редактирования */}
                    <button onClick={openEditModal} className="ml-3 text-gray-400 hover:text-gray-600 focus:outline-none">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </button>

                    {/* Кнопка удаления */}
                    <button onClick={handleDelete} className="ml-3 text-red-400/70 hover:text-red-400 focus:outline-none">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div> : 
                  <Button variant="destructive" onClick={handleReturnTask} disabled={isReturned}>
                    Вернуть
                  </Button>
                }
              </div>
            </div>
          </TooltipTrigger>
          {
            task.description &&
            <TooltipContent className="w-[700px] p-5 border-[2px] border-black bg-white rounded-md absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2">
              <p>{task.description}</p>
            </TooltipContent>
          }
        </Tooltip>
      </TooltipProvider>
      <Modal
        isOpen={isOp}
        setIsOpen={setIsOp}
        task={task}
        setTasks={setTasks}
        setPersonalTasks={setPersonalTasks || setTasks}
        method={'edit'}
        requestToServer={requestToServer}
        isPersonalTasks={isPersonalTasks}
      />
    </div>
  );
};
