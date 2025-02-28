import React from "react";
import ReactDOM from "react-dom";
import { Input } from "@/components/ui/input";
import { InputOTPWithSeparator, LabelDemo } from "@/components/shared";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ITask } from "@/App";
import { useGetTask } from "@/hooks/get-tasks";

type tTask = {
  name: string;
  description: string;
  day: string;
  month: string;
  year: string;
  inThisMonth: boolean
  isDone: boolean
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  task: tTask,
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  method: string
  requestToServer: any;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, task, setTasks, method, requestToServer }) => {
  const [state, setState] = React.useState(task);  
  const [isOnChange, setIsOnChange] = React.useState(false);
  const { getTasks } = useGetTask(setTasks);

  React.useEffect(() => {
    setState(task);
    setIsOnChange(false);
  }, [isOpen, task]);

  React.useEffect(() => {
    setState(prev => ({
      ...prev,
      inThisMonth: prev.day.length === 0
    }));
  }, [state.day]);
  
  const isValidDate = (day: string, month: string, year: string): boolean => {
    // Если дата не указана (в течение месяца), считаем валидной
    if (day === '' && month === '' && year === '') {
      return true;
    }

    // Проверяем, что все поля заполнены
    if (!day || !month || !year) {
      return false;
    }

    const d = parseInt(day);
    const m = parseInt(month) - 1; // JS месяцы от 0 до 11
    const y = 2000 + parseInt(year); // Добавляем 2000 к двузначному году

    const date = new Date(y, m, d);

    return date.getDate() === d &&
           date.getMonth() === m &&
           date.getFullYear() === y;
  }

  const requestTaskAndClose = async () => {
    if (!isValidDate(state.day, state.month, state.year)) {
      alert('Пожалуйста, введите корректную дату');
      return;
    }

    await requestToServer({
      ...state,
      isDone: task.isDone // сохраняем текущее состояние isDone из пропса task
    });
    await getTasks();
    setIsOpen(false);
  }
  const isDisabled = state.name.length==0;

  if (!isOpen) {
    return null;
  }
  
  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) {
    throw new Error("Modal root element not found");
  }

  return ReactDOM.createPortal(
    <div className="w-[100%] h-[100%] bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-3 justify-between items-center rounded-2xl border border-slate-[#292524] w-[50%] max-w-[800px] p-3 bg-background">
        <div className="text-white text-2xl font-bold mb-6">
          {
            method==='post' ? 'Создать задачу' : 'Измененить задачу'
          }
        </div>
        
        <Input type='text' placeholder='Название задачи' value={state.name} onChange={(e) => {
          setState({...state, name: e.target.value})
          setIsOnChange(true)
        }}/>
        <Textarea placeholder="Описание задачи (необязательно)" value={state.description} onChange={(e) => {
          setState({...state, description: e.target.value});
          setIsOnChange(true)
        }}/>

        <div className="flex items-center gap-[50px] text-white">
          <div className="flex items-center gap-3">
            До
            <InputOTPWithSeparator 
                state={{ day: state.day, month: state.month, year: state.year }} 
                setState={(newState) => setState({...state, ...newState})}
                setIsOnChange={setIsOnChange}
            />
          </div>
          или
          <LabelDemo value={state.day} disabled={state.month.length < 0}/>
        </div>

        <div className="flex gap-3 mt-10">
          {
            method==='post' ? 
            <Button disabled={isDisabled} onClick={requestTaskAndClose} variant="secondary">
              Добавить
            </Button> : 
            <Button disabled={!isOnChange} onClick={requestTaskAndClose} variant="secondary">
              Изменить
            </Button>
          }
          <Button variant="outline" onClick={() => {
            setIsOpen(false);
          }}>
              Закрыть
          </Button>
        </div>
      </div>
    </div>,

    modalRoot

  );
};
