import React from 'react';
import { ITask } from '@/App';
import { months } from '@/constants';
import { Task } from '@/components/shared/Task';

interface MainProps {
  currentMonthAndYear: {
    currentMonth: string,
    currentYear: string
  }
  tasks: ITask[];
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  searchValue: string
}

export const Main: React.FC<MainProps> = ({ currentMonthAndYear, tasks, setTasks, searchValue }) => {
  // Группируем задачи по годам, месяцам и дням
  const groupedTasks = tasks.reduce((acc, task) => {
    const year = task.year;
    const month = task.month;
    const day = task.day;

    // Инициализируем год, если его еще нет
    if (!acc[year]) {
      acc[year] = {};
    }

    // Инициализируем месяц, если его еще нет
    if (!acc[year][month]) {
      acc[year][month] = {};
    }

    // Инициализируем массив для дней, если его еще нет
    if (!acc[year][month][day]) {
      acc[year][month][day] = [];
    }

    // Добавляем задачу в соответствующий день
    acc[year][month][day].push(task);

    return acc;
  }, {} as Record<string, Record<string, Record<string, ITask[]>>>);

  return (
    <div>
      {Object.keys(groupedTasks).map((year) => (
        <div key={year} className='flex flex-col justify-center items-center mb-10 mt-10'>
          {Object.keys(groupedTasks[year]).map((month) => {
            const daysWithTasks = Object.keys(groupedTasks[year][month]).some(day => 
              groupedTasks[year][month][day].some(task => 
                task.name.toLowerCase().includes(searchValue.toLowerCase())
              )
            );

            return daysWithTasks ? (
              <div key={month} className='flex w-full flex-col gap-4 justify-center items-center p-4'>
                <h3 className='text-xl text-white font-bold mb-4'>{months[parseInt(month) - 1]}</h3>
                {Object.keys(groupedTasks[year][month]).map((day) => (
                  <div key={day} className='flex flex-col w-full justify-center items-center'>
                    {groupedTasks[year][month][day]
                      .filter(task => task.name.toLowerCase().includes(searchValue.toLowerCase()))
                      .map((task, index) => (
                        <Task key={task.id} index={index} task={task} setTasks={setTasks} currentMonthAndYear={currentMonthAndYear}/>
                    ))}
                  </div>
                ))}
              </div>
            ) : null; // Если нет задач, не рендерим месяц
          })}
        </div>
      ))}
    </div>
  );
};
