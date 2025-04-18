import React from 'react';
import { ITask } from '@/App';
import { LeftTasks } from '@/components/shared/LeftTasks';
import { RightTasks } from '@/components/shared/RightTasks';
import { Button } from '@/components/ui/button';
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
      <div className='flex w-full gap-10'>
        <LeftTasks setIsOpen={setIsOpen} setIsPersonalTasks={setIsPersonalTasks} currentDate={currentDate} tasks={tasks} setTasks={setTasks} searchValue={searchValue} isOpenTrash={isOpenTrash} />
        <RightTasks setIsOpen={setIsOpen} setIsPersonalTasks={setIsPersonalTasks} currentDate={currentDate} personalTasks={personalTasks} setPersonalTasks={setPersonalTasks} searchValue={searchValue} isOpenTrash={isOpenTrash} />
      </div>
    </div>
  );
};