import React from "react";
import ReactDOM from "react-dom";
import { Input } from "@/components/ui/input";
import { InputOTPWithSeparator } from "@/components/shared";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ITask } from "@/App";

type tTask = {
  name: string;
  description: string;
  day: string;
  month: string;
  year: string;
  isDone: boolean;
  author?: string;
}

interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  task: tTask,
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  setPersonalTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  method: string
  requestToServer: any;
  isPersonalTasks: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, setIsOpen, task, setTasks, setPersonalTasks, method, requestToServer, isPersonalTasks }) => {
  const [state, setState] = React.useState(task);
  // const { getTasks } = useGetTask(setTasks, setPersonalTasks);

  React.useEffect(() => {
    setState(task);
  }, [isOpen, task]);

  const requestTaskAndClose = async () => {
    await requestToServer({
      ...state,
      isDone: task.isDone // сохраняем текущее состояние isDone из пропса task
    }, isPersonalTasks);

    // Обновляем только нужный список задач
    if (isPersonalTasks) {
      const tasks = JSON.parse(localStorage.getItem('personalTasks') || '[]');
      setPersonalTasks(tasks);
    } else {
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      setTasks(tasks);
    }

    setIsOpen(false);
  }

  // Проверяем, были ли внесены изменения
  const hasChanges = React.useMemo(() => {
    return task.name !== state.name ||
      task.description !== state.description ||
      task.day !== state.day ||
      task.month !== state.month ||
      task.year !== state.year ||
      task.author !== state.author;
  }, [state, task]);

  // Кнопка неактивна если: пустое название, пустой месяц или нет изменений при редактировании
  const isDisabled = state.name.length === 0 ||
    state.month.length === 0 ||
    (method === 'edit' && !hasChanges);

  if (!isOpen) {
    return null;
  }

  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) {
    throw new Error("Modal root element not found");
  }

  return ReactDOM.createPortal(
    <div className="w-[100%] h-[100%] bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="flex flex-col gap-3 justify-between items-center rounded-2xl border border-slate-[#292524] w-[70%] max-w-[1000px] p-3 bg-background">
        <div className="text-white text-2xl font-bold mb-6">
          {
            isPersonalTasks ? `${method === 'post' ? 'Создать' : 'Изменить'} новую задачу` : `${method === 'post' ? 'Создать' : 'Изменить'} календарную задачу`
          }
        </div>

        <Textarea placeholder='Название задачи' value={state.name} onChange={(e) => {
          setState({ ...state, name: e.target.value })
        }} />
        <Textarea placeholder="Описание задачи (необязательно)" value={state.description} onChange={(e) => {
          setState({ ...state, description: e.target.value });
        }} />

        <div className="flex flex-col items-center text-white">
          <InputOTPWithSeparator
            state={{ day: state.day, month: state.month, year: state.year }}
            setState={(newState) => setState({ ...state, ...newState })}
            isPersonalTasks={isPersonalTasks}
          />

          <div className="text-black">
            <p className="text-white">Ответственный за выполнение задачи</p>
            <Input value={state.author} onChange={(e) => setState({ ...state, author: e.target.value })} type="text" placeholder="Ответственный (необязательно)" />
          </div>
        </div>

        <div className="flex gap-3 mt-10">
          <Button disabled={isDisabled} onClick={requestTaskAndClose} variant="secondary">
            {method === 'post' ? 'Добавить' : 'Изменить'}
          </Button>
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
