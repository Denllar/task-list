import React from 'react';
import { ITask } from '@/App';
import { LeftTasks } from '@/components/shared/LeftTasks';
import { RightTasks } from '@/components/shared/RightTasks';
import { Button } from '@/components/ui/button';
import { CalendarDemo } from './CalendarDemo';
interface MainProps {
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
  personalTasks: ITask[];
  setPersonalTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  isOpenTrash: boolean;
}

export const Main: React.FC<MainProps> = ({ setIsOpen, setIsPersonalTasks, currentDate, tasks, setTasks, personalTasks, setPersonalTasks, searchValue, isOpenTrash }) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [monthOnlyFilter, setMonthOnlyFilter] = React.useState<boolean>(false);

  const allTasks = [...tasks, ...personalTasks];

  const handleDateSelect = (date: Date | undefined, monthOnly: boolean = false) => {
    setSelectedDate(date || null);
    setMonthOnlyFilter(monthOnly);
  };

  const resetDateFilter = () => {
    setSelectedDate(null);
    setMonthOnlyFilter(false);
  };

  const handleClearTrash = () => {
    if (confirm('Вы уверены, что хотите очистить корзину?')){
      localStorage.removeItem('remoteTasks');
      localStorage.removeItem('remotePersonalTasks');
      window.location.reload();
    }
  }

  return (
    <div>
      {
        isOpenTrash && (
          <div className='text-white text-5xl font-bold mb-10'>
            <h1>Корзина</h1>
            <Button variant="destructive" onClick={handleClearTrash}>
              Очистить корзину
            </Button>
          </div>
        )
      }
      <div className='flex flex-col items-center gap-5'> 
        <CalendarDemo 
          onSelectDate={handleDateSelect} 
          tasks={allTasks} 
          externalSelectedDate={selectedDate} 
        />
        {selectedDate && (
          <div className="flex items-center gap-2 mb-2">
            <p className="text-white font-bold text-3xl">
              {monthOnlyFilter 
                ? `Отфильтровано по месяцу: ${selectedDate.toLocaleDateString('ru-RU', {month: 'long', year: 'numeric'})}`
                : `Отфильтровано по дате: ${selectedDate.toLocaleDateString('ru-RU')}`
              }
            </p>
            <Button onClick={resetDateFilter} variant="outline" size="sm" className="text-white border-white hover:bg-white/20">
              Сбросить фильтр
            </Button>
          </div>
        )}
        <div className='flex w-full gap-10'>
          <LeftTasks 
            setIsOpen={setIsOpen} 
            setIsPersonalTasks={setIsPersonalTasks} 
            currentDate={currentDate} 
            tasks={tasks} 
            setTasks={setTasks} 
            searchValue={searchValue} 
            isOpenTrash={isOpenTrash} 
            selectedDate={selectedDate}
            monthOnlyFilter={monthOnlyFilter} 
          />
          <RightTasks 
            setIsOpen={setIsOpen} 
            setIsPersonalTasks={setIsPersonalTasks} 
            currentDate={currentDate} 
            personalTasks={personalTasks} 
            setPersonalTasks={setPersonalTasks} 
            searchValue={searchValue} 
            isOpenTrash={isOpenTrash} 
            selectedDate={selectedDate}
            monthOnlyFilter={monthOnlyFilter} 
          />
        </div>
      </div>
    </div>
  );
};