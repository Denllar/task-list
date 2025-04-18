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
}

const date = new Date();

export const RightTasks: React.FC<RightTasksProps> = ({ setIsOpen, setIsPersonalTasks, currentDate, personalTasks, setPersonalTasks, searchValue, isOpenTrash }) => {
  const [filter, setFilter] = React.useState<'all' | 'overdue' | 'urgent' | 'completed'>('all');
  console.log(setFilter);
  // const filterName = {
  //   overdue: 'Просроченные',
  //   urgent: 'Срочные',
  //   completed: 'Выполненные'
  // }
  const currentMonthIndex = parseInt(currentDate.currentMonth);

  const filteredTasks = personalTasks.filter(task => {
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
  // const countTasks = (filterType: 'overdue' | 'urgent' | 'completed') => {
  //   return personalTasks.filter(task => {
  //     const taskDate = new Date(`20${task.year}-${task.month}-${task.day}`);
  //     const threeDaysFromNow = new Date(date);
  //     threeDaysFromNow.setDate(date.getDate() + 3);

  //     // Для задач "в течении месяца"
  //     if (task.day === '') {
  //       if (filterType === 'overdue') {
  //         // Задача просрочена только если её месяц меньше текущего
  //         return task.isDone === false && parseInt(task.month) < parseInt(currentDate.currentMonth);
  //       }
  //       if (filterType === 'urgent') {
  //         // Задача срочная, если она в текущем месяце
  //         return task.isDone === false && task.month === currentDate.currentMonth;
  //       }
  //       if (filterType === 'completed') {
  //         return task.isDone === true;
  //       }
  //       return false;
  //     }

  //     // Для задач с конкретной датой - оставляем старую логику
  //     if (filterType === 'overdue') {
  //       return task.isDone === false && taskDate < date;
  //     }
  //     if (filterType === 'urgent') {
  //       return task.isDone === false && taskDate >= date && taskDate <= threeDaysFromNow;
  //     }
  //     if (filterType === 'completed') {
  //       return task.isDone === true;
  //     }
  //     return false;
  //   }).length;
  // };

  // const handleFilterChange = (newFilter: 'all' | 'overdue' | 'urgent' | 'completed') => {
  //   setFilter(prevFilter => (prevFilter === newFilter ? 'all' : newFilter));
  // };

  return (
    <div className='w-1/2'>
      <div className='w-full flex flex-col justify-between items-center mb-10'>
        <h1 className='text-white text-left text-4xl font-bold mb-4 uppercase'>Повседневные задачи</h1>
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
            {/* <AddTask filter={filter} handleFilterChange={handleFilterChange} countTasks={countTasks}/> */}
          </div>
        }
      </div>


      {/* {
        filter !== 'all' &&
        <div className='flex justify-between items-center mt-10'>
          <h2 className='text-white text-left text-3xl italic font-bold mb-4'>{filterName[filter]}</h2>
        </div>
      } */}

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
            <div key={month} className='flex w-full flex-col gap-4 justify-center items-center'>
              <h3 className='text-xl text-white font-bold mb-4'>{months[parseInt(month) - 1]}</h3>
              <div className='flex flex-col w-full justify-center items-center'>
                {groupedTasks[month]
                  .filter(task => task.name.toLowerCase().includes(searchValue.toLowerCase()))
                  .map((personalTasks) => {
                    monthTaskCounter++; // Увеличиваем счетчик для каждой задачи
                    return (
                      <Task
                        key={personalTasks.id}
                        index={monthTaskCounter}
                        task={personalTasks}
                        setTasks={setPersonalTasks}
                        currentDate={currentDate}
                        isPersonalTasks={true}
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
