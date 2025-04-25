import React from 'react';
import { ITask } from '@/App';
import { months } from '@/constants';
import { Task } from '@/components/shared/Task';
//import { AddTask } from '@/components/shared/AddTask';
import { TooltipDemo } from './Tooltip';
import { Button } from '@/components/ui/button';
interface RightTasksProps {
  currentDate: {
    currentMonth: string,
    currentYear: string
    currentDay: string,
  }
  searchValue: string
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPersonalTasks: React.Dispatch<React.SetStateAction<boolean>>;
  personalTasks: ITask[];
  setPersonalTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  isOpenTrash: boolean;
  selectedDate: Date | null;
  monthOnlyFilter: boolean;
}

const date = new Date();

export const RightTasks: React.FC<RightTasksProps> = ({ setIsOpen, setIsPersonalTasks, currentDate, personalTasks, setPersonalTasks, searchValue, isOpenTrash, selectedDate, monthOnlyFilter }) => {
  const [filter, setFilter] = React.useState<'all' | 'overdue' | 'urgent' | 'completed'>('all');
  console.log(setFilter);
  // const filterName = {
  //   overdue: 'Просроченные',
  //   urgent: 'Срочные',
  //   completed: 'Выполненные'
  // }
  const currentMonthIndex = parseInt(currentDate.currentMonth);

  // Функция для проверки, просрочена ли задача (по аналогии с isPastTask в Task.tsx)
  const isTaskOverdue = (task: ITask): boolean => {
    // Если задача уже выполнена, она не считается просроченной
    if (task.isDone) {
      return false;
    }
    
    // Для задач "в течении месяца"
    if (task.day === '') {
      // Задача просрочена, если её месяц меньше текущего
      return parseInt(task.month) < parseInt(currentDate.currentMonth);
    }

    // Для задач с конкретной датой
    const taskDate = new Date(`20${task.year}-${task.month}-${task.day}`);
    const currentDateObj = new Date(`${currentDate.currentYear}-${currentDate.currentMonth}-${currentDate.currentDay}`);
    return taskDate < currentDateObj;
  };

  // Функция для проверки соответствия задачи выбранной дате из календаря
  const matchesSelectedDate = (task: ITask): boolean => {
    if (!selectedDate) return true; // Если дата не выбрана, все задачи проходят

    const taskDay = task.day ? parseInt(task.day, 10) : null;
    const taskMonth = parseInt(task.month, 10) - 1; // JavaScript месяцы от 0 до 11
    const taskYear = parseInt(task.year, 10) + 2000; // Предполагаем, что год в формате "23" -> 2023
    
    if (monthOnlyFilter) {
      // Фильтрация только по месяцу и году
      return taskMonth === selectedDate.getMonth() && 
             taskYear === selectedDate.getFullYear();
    } else {
      // Фильтрация по конкретной дате
      // Если задача не привязана к конкретному дню, проверяем только месяц и год
      if (taskDay === null) {
        return taskMonth === selectedDate.getMonth() && 
               taskYear === selectedDate.getFullYear();
      } else {
        // Проверяем точное совпадение дня, месяца и года
        return taskDay === selectedDate.getDate() && 
               taskMonth === selectedDate.getMonth() && 
               taskYear === selectedDate.getFullYear();
      }
    }
  };

  // Функция для проверки соответствия задачи выбранному фильтру статуса
  const matchesStatusFilter = (task: ITask): boolean => {
    if (filter === 'all') return true; // Если фильтр не выбран, все задачи проходят
    
    if (filter === 'overdue') {
      return isTaskOverdue(task);
    }
    
    const taskDate = new Date(`20${task.year}-${task.month}-${task.day}`);
    const threeDaysFromNow = new Date(date);
    threeDaysFromNow.setDate(date.getDate() + 3);

    // Для задач "в течении месяца"
    if (task.day === '') {
      if (filter === 'urgent') {
        // Задача срочная, если она в текущем месяце
        return task.isDone === false && task.month === currentDate.currentMonth;
      }
      if (filter === 'completed') {
        return task.isDone === true;
      }
    } else {
      // Для задач с конкретной датой
      if (filter === 'urgent') {
        return task.isDone === false && taskDate >= date && taskDate <= threeDaysFromNow;
      }
      if (filter === 'completed') {
        return task.isDone === true;
      }
    }
    
    return true;
  };

  // Применяем оба фильтра: по дате и по статусу
  const filteredTasks = personalTasks.filter(task => 
    matchesSelectedDate(task) && matchesStatusFilter(task) && 
    task.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleReturnTask = (task: ITask) => {
    // Удаляем задачу из remotePersonalTasks
    const remotePersonalTasks = JSON.parse(localStorage.getItem('remotePersonalTasks') || '[]');
    const updatedRemotePersonalTasks = remotePersonalTasks.filter((t: ITask) => t.id !== task.id);
    localStorage.setItem('remotePersonalTasks', JSON.stringify(updatedRemotePersonalTasks));

    // Добавляем задачу обратно в personalTasks
    const personalTasks = JSON.parse(localStorage.getItem('personalTasks') || '[]');
    personalTasks.push(task);
    localStorage.setItem('personalTasks', JSON.stringify(personalTasks));
  };

  const handleClearTasks = () => {
    if (confirm('Вы уверены, что хотите очистить корзину?')){
      localStorage.removeItem('personalTasks');
      window.location.reload();
    }
  }

  // Группируем задачи по месяцам и дням
  const groupedTasks = filteredTasks.reduce((acc, task) => {
    const month = task.month; // Месяц
    const day = task.day || 'noday'; // День (или 'noday' для задач без дня)

    // Инициализируем структуру для месяца, если её еще нет
    if (!acc[month]) {
      acc[month] = {};
    }

    // Инициализируем массив для дня, если его еще нет
    if (!acc[month][day]) {
      acc[month][day] = [];
    }

    // Добавляем задачу в соответствующий день и месяц
    acc[month][day].push(task);

    return acc;
  }, {} as Record<string, Record<string, ITask[]>>);

  // Создаем сортированный массив месяцев, начиная с текущего
  const sortedMonths = Object.keys(groupedTasks).sort((a, b) => {
    const aMonth = parseInt(a);
    const bMonth = parseInt(b);

    // Вычисляем относительную позицию от текущего месяца
    const aPos = (aMonth + 12 - currentMonthIndex) % 12;
    const bPos = (bMonth + 12 - currentMonthIndex) % 12;

    return aPos - bPos;
  });

  return (
    <div className='w-1/2'>
      <div className='w-full flex flex-col justify-between items-center mb-10'>
        <h1 className='text-white text-left text-4xl font-bold mb-4 uppercase'>Текущие задачи</h1>
        {
          !isOpenTrash &&
          <div className='flex gap-3'>
            <TooltipDemo setIsOpen={setIsOpen} setIsPersonalTasks={setIsPersonalTasks} isPersonalTasks={true} />
            <div className='flex justify-between items-center'>
              <Button
                variant="destructive"
                onClick={handleClearTasks}
                className="bg-red-600 hover:bg-red-700"
              >
                Очистить все задачи
              </Button>
            </div>
          </div>
        }
      </div>

      {Object.keys(groupedTasks).length === 0 ? (
        <div className='flex justify-center items-center mt-20'>
          <p className='text-white text-2xl'>Пусто 😕</p>
        </div>
      ) : (
        sortedMonths.map((month) => {
          return (
            <div key={month} className='flex w-full flex-col gap-4 justify-center items-center mb-8'>
              <h3 className='text-xl text-white font-bold mb-4'>{months[parseInt(month) - 1]}</h3>
              <div className='flex flex-col w-full justify-center items-center'>
                {Object.entries(groupedTasks[month])
                  .sort(([dayA], [dayB]) => {
                    // 'noday' всегда в конце
                    if (dayA === 'noday') return 1;
                    if (dayB === 'noday') return -1;
                    return parseInt(dayA) - parseInt(dayB);
                  })
                  .map(([day, tasks]) => {
                    return (
                      <div key={`${month}-${day}`} className='w-full mb-5'>
                        <div className='flex'>
                          {day !== 'noday' ? (
                            <div className={`w-[90px] ${day === currentDate.currentDay && month === currentDate.currentMonth ? 'bg-orange-500' : 'bg-white'} rounded-xl flex items-center justify-center p-2 self-stretch mr-4`}>
                              <span className={`text-5xl font-bold ${day === currentDate.currentDay && month === currentDate.currentMonth ? 'text-white' : 'text-gray-600'}`}>{day}</span>
                            </div>
                          ) : (
                            <div className='w-[90px] bg-white rounded-xl flex items-center justify-center p-2 self-stretch mr-4'>
                              <span className='text-xl font-medium text-gray-600'>В течении месяца</span>
                            </div>
                          )}
                          <div className='flex-1 space-y-4'>
                            {tasks.map((task, index) => (
                              <Task
                                key={task.id}
                                index={index}
                                task={task}
                                setTasks={setPersonalTasks}
                                currentDate={currentDate}
                                isPersonalTasks={true}
                                isOpenTrash={isOpenTrash}
                                onReturnTask={handleReturnTask}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
