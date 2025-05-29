import React from 'react';
import { Main, Search, Modal, Trash } from '@/components/shared'
import { useGetTask } from '@/hooks/get-tasks';
import { usePostTask } from '@/hooks/post-task';
import { CurrentDateTime } from './components/shared/CurrentDateTime';
import { Button } from './components/ui/button';
import { Birthday } from './components/shared/Birthday';
import { TodayBirthdays } from './components/shared/TodayBirthdays';

export interface ITask {
  id: string;
  name: string;
  description: string;
  day: string;
  month: string;
  year: string;
  isDone: boolean,
  author: string
}

const task = {
  name: "",
  description: "",
  day: "",
  month: "",
  year: "",
  isDone: false,
  author: ""
}

const date = new Date();
const currentMonth = (date.getMonth() + 1).toString().padStart(2, '0');
const currentYear = date.getFullYear().toString()//.slice(2, 5);
const currentDay = date.getDate().toString();
const currentDate = {
  currentMonth,
  currentYear,
  currentDay
}

const key = 'tasks';
const value = localStorage.getItem(key);
const size = value ? value.length * 2 : 0; // Размер в байтах
console.log(`Размер ключа "${key}": ${size} байт`);

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isPersonalTasks, setIsPersonalTasks] = React.useState(false);
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const [personalTasks, setPersonalTasks] = React.useState<ITask[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const { getTasks } = useGetTask(setTasks, setPersonalTasks);
  const { postTask } = usePostTask();
  const [isOpenTrash, setIsOpenTrash] = React.useState(false);

  const updateYearForAllTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

    const updatedTasks = tasks.map((task: ITask) => {
      const newYear = (parseInt(task.year) + 1).toString();
      return { ...task, year: newYear };
    });

    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  React.useEffect(() => {
    getTasks(isOpenTrash);
    if (date.getMonth() + 1 === 8 && date.getDate() === 31) {
      updateYearForAllTasks();
    }
  }, [getTasks, isOpen, isOpenTrash]);

  return (
    <div className='w-[95%] m-auto mt-10 dark text-center'>
      <div className='flex gap-[300px] items-end items-center mb-20'>
        <div className='flex gap-7 items-center'>
          <img width={150} src={'ВУЦ.png'} alt={'logo'} />
          <h1 className='text-[50px] font-bold text-white text-left uppercase'>Планировщик <br />задач</h1>
        </div>
        <CurrentDateTime />
        <div className='w-full flex gap-7 items-center'>
          <Search searchValue={searchValue} setSearchValue={setSearchValue} />
          {
            !isOpenTrash ? <Trash setIsOpenTrash={setIsOpenTrash} isActive={isOpenTrash} /> :
              <div className='text-white'>
                <Button variant="outline" onClick={() => setIsOpenTrash(false)}>В главное меню</Button>
              </div>
          }
            <Birthday/>
        </div>
      </div>
      <TodayBirthdays />
      <Main
        setIsOpen={setIsOpen}
        setIsPersonalTasks={setIsPersonalTasks}
        currentDate={currentDate}
        tasks={tasks}
        setTasks={setTasks}
        personalTasks={personalTasks}
        setPersonalTasks={setPersonalTasks}
        searchValue={searchValue}
        isOpenTrash={isOpenTrash}
      />
      <Modal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        task={task}
        setTasks={setTasks}
        setPersonalTasks={setPersonalTasks}
        method={'post'}
        requestToServer={postTask}
        isPersonalTasks={isPersonalTasks}
      />
    </div>
  )
}

export default App
