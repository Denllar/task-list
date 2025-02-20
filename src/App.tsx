import React from 'react';
import { Main, Search, Modal } from '@/components/shared'
import { TooltipDemo } from '@/components/shared'
import { useGetTask } from '@/hooks/get-tasks';
import { usePostTask } from '@/hooks/post-task';


export interface ITask {
  id: number;
  name: string;
  description: string;
  day: string;
  month: string;
  year: string;
  inThisMonth: boolean
}


const task = {
  name: "",
  description: "",
  day: "",
  month: "",
  year: "",
  inThisMonth: true
}

const currentDate = new Date();
const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const currentYear = currentDate.getFullYear().toString().slice(2, 5);
const currentMonthAndYear = {
  currentMonth,
  currentYear
}

function App() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const [searchValue, setSearchValue] = React.useState<string>("");

  const { getTasks } = useGetTask(setTasks);
  const { postTask } = usePostTask(currentMonthAndYear);
  
  React.useEffect(() => {
    getTasks();
  }, [getTasks, isOpen]);

  return (
    <div className='w-[100%] m-auto max-w-[1200px] mt-10 dark text-center'>
      <div className='flex gap-10 items-end'>
        <img width={100} src={'public/вуц.jpg'} alt={'logo'}/>
        <div className='flex flex-col w-full gap-7'>
          <h1 className='text-[30px] font-bold text-white'>Календарь задач</h1>
          <Search searchValue={searchValue} setSearchValue={setSearchValue} />
        </div>
        <TooltipDemo setIsOpen={setIsOpen}/>
      </div>
      <Main currentMonthAndYear={currentMonthAndYear} tasks={tasks} setTasks={setTasks} searchValue={searchValue}/> 
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} task={task} method={'post'} requestToServer={postTask}/>
    </div>
  )
}

export default App
