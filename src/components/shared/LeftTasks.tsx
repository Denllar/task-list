import React from 'react';
import { ITask } from '@/App';
import { months } from '@/constants';
import { Task } from '@/components/shared/Task';
import { AddTask } from '@/components/shared/AddTask';
import { useEditTask } from '@/hooks/edit-tasks';
import { Button } from '@/components/ui/button';
import { TooltipDemo } from './Tooltip';

interface LeftTasksProps {
  currentDate: {
    currentMonth: string,
    currentYear: string
    currentDay: string,
  }
  tasks: ITask[];
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  searchValue: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPersonalTasks: React.Dispatch<React.SetStateAction<boolean>>;
  isOpenTrash: boolean;
}

const date = new Date();

export const LeftTasks: React.FC<LeftTasksProps> = ({ setIsOpen, setIsPersonalTasks, currentDate, tasks, setTasks, searchValue, isOpenTrash }) => {
  const [filter, setFilter] = React.useState<'all' | 'overdue' | 'urgent' | 'completed' | 'undone'>('all');
  const filterName = {
    overdue: 'Просроченные',
    urgent: 'Срочные',
    completed: 'Выполненные',
    undone: 'Невыполненные'
  }
  const currentMonthIndex = parseInt(currentDate.currentMonth);
  const { resetAllTasksStatus } = useEditTask();

  const handleResetAllTasks = async () => {
    if (confirm('Вы уверены, что хотите сбросить статус выполнения всех календарных задач?')) {
      const resetTasks = await resetAllTasksStatus();
      setTasks(resetTasks);

      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

      const updatedTasks = tasks.map((task: ITask) => {
        const newYear = (parseInt(task.year) + 1).toString();
        return { ...task, year: newYear };
      });
  
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
      window.location.reload();
    }
  };

  const handleReturnTask = (task: ITask) => {
    // Удаляем задачу из remoteTasks
    const remoteTasks = JSON.parse(localStorage.getItem('remoteTasks') || '[]');
    const updatedRemoteTasks = remoteTasks.filter((t: ITask) => t.id !== task.id);
    localStorage.setItem('remoteTasks', JSON.stringify(updatedRemoteTasks));

    // Добавляем задачу обратно в tasks
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  };

  const filteredTasks = tasks.filter(task => {
    const taskDate = new Date(`20${task.year}-${task.month}-${task.day}`);
    const threeDaysFromNow = new Date(date);
    threeDaysFromNow.setDate(date.getDate() + 3);

    // Для задач "в течении месяца"
    if (task.day === '') {
      if (filter === 'overdue') {
        // Задача просрочена только если её месяц меньше текущего
        return task.isDone === false && parseInt(task.month) < parseInt(currentDate.currentMonth);
      }
      if (filter === 'urgent') {
        // Задача срочная, если она в текущем месяце
        return task.isDone === false && task.month === currentDate.currentMonth;
      }
      if (filter === 'completed') {
        return task.isDone === true;
      }
      if (filter === 'undone') {
        return !task.isDone;
      }
      return true;
    }

    // Для задач с конкретной датой - оставляем старую логику
    if (filter === 'overdue') {
      return task.isDone === false && taskDate < date;
    }
    if (filter === 'urgent') {
      return task.isDone === false && taskDate >= date && taskDate <= threeDaysFromNow;
    }
    if (filter === 'completed') {
      return task.isDone === true;
    }
    if (filter === 'undone') {
      return !task.isDone;
    }
    return true;
  });

  // Группируем задачи по месяцам
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const month = task.month; // Используем только месяц

    // Инициализируем массив для месяца, если его еще нет
    if (!acc[month]) {
      acc[month] = [];
    }

    // Добавляем задачу в соответствующий месяц
    acc[month].push(task);

    return acc;
  }, {} as Record<string, ITask[]>);

  // Создаем сортированный массив месяцев, начиная с текущего
  const sortedMonths = Object.keys(groupedTasks).sort((a, b) => {
    const aMonth = parseInt(a);
    const bMonth = parseInt(b);

    // Вычисляем относительную позицию от текущего месяца
    const aPos = (aMonth + 12 - currentMonthIndex) % 12;
    const bPos = (bMonth + 12 - currentMonthIndex) % 12;

    return aPos - bPos;
  });

  const countTasks = (filterType: 'overdue' | 'urgent' | 'completed' | 'undone') => {
    return tasks.filter(task => {
      const taskDate = new Date(`20${task.year}-${task.month}-${task.day}`);
      const threeDaysFromNow = new Date(date);
      threeDaysFromNow.setDate(date.getDate() + 3);

      // Для задач "в течении месяца"
      if (task.day === '') {
        if (filterType === 'overdue') {
          // Задача просрочена только если её месяц меньше текущего
          return task.isDone === false && parseInt(task.month) < parseInt(currentDate.currentMonth);
        }
        if (filterType === 'urgent') {
          // Задача срочная, если она в текущем месяце
          return task.isDone === false && task.month === currentDate.currentMonth;
        }
        if (filterType === 'completed') {
          return task.isDone === true;
        }
        if (filterType === 'undone') {
          return !task.isDone;
        }
        return false;
      }

      // Для задач с конкретной датой - оставляем старую логику
      if (filterType === 'overdue') {
        return task.isDone === false && taskDate < date;
      }
      if (filterType === 'urgent') {
        return task.isDone === false && taskDate >= date && taskDate <= threeDaysFromNow;
      }
      if (filterType === 'completed') {
        return task.isDone === true;
      }
      if (filterType === 'undone') {
        return !task.isDone;
      }
      return false;
    }).length;
  };

  const handleFilterChange = (newFilter: 'all' | 'overdue' | 'urgent' | 'completed' | 'undone') => {
    setFilter(prevFilter => (prevFilter === newFilter ? 'all' : newFilter));
  };

  return (
    <div className='w-1/2'>
      <div className='w-full flex flex-col justify-between items-center mb-10'>
        <h1 className='text-white text-left text-4xl font-bold mb-4 uppercase'>Календарные задачи</h1>
        {
          !isOpenTrash &&
          <div className='flex gap-3'>
            <TooltipDemo setIsOpen={setIsOpen} setIsPersonalTasks={setIsPersonalTasks} isPersonalTasks={false} />
            <AddTask filter={filter} handleFilterChange={handleFilterChange} countTasks={countTasks} />
            <div className='flex justify-between items-center'>
              <Button
                variant="destructive"
                onClick={handleResetAllTasks}
                className="bg-red-600 hover:bg-red-700"
              >
                Сбросить все задачи
              </Button>
            </div>
          </div>
        }
      </div>


      {
        filter !== 'all' &&
        <div className='flex justify-between items-center'>
          <h2 className='text-white text-left text-3xl italic font-bold mb-4'>{filterName[filter]}</h2>
        </div>
      }

      {Object.keys(groupedTasks).length === 0 ? (
        <div className='flex justify-center items-center mt-20'>
          <p className='text-white text-2xl'>Пусто 😕</p>
        </div>
      ) : (
        sortedMonths.map((month) => {
          let monthTaskCounter = -1;

          const daysWithTasks = groupedTasks[month].some(task =>
            task.name.toLowerCase().includes(searchValue.toLowerCase())
          );

          return daysWithTasks ? (
            <div key={month} className='flex w-full flex-col gap-4 justify-center items-center '>
              <h3 className='text-xl text-white font-bold mb-4'>{months[parseInt(month) - 1]}</h3>
              <div className='flex flex-col w-full justify-center items-center'>
                {groupedTasks[month]
                  .filter(task => task.name.toLowerCase().includes(searchValue.toLowerCase()))
                  .map((task) => {
                    monthTaskCounter++; // Увеличиваем счетчик для каждой задачи
                    return (
                      <Task
                        key={task.id}
                        index={monthTaskCounter}
                        task={task}
                        setTasks={setTasks}
                        currentDate={currentDate}
                        isPersonalTasks={false}
                        isOpenTrash={isOpenTrash}
                        onReturnTask={handleReturnTask}
                      />
                    );
                  })}
              </div>
            </div>
          ) : null;
        })
      )}
    </div>
  );
};
