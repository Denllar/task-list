import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipDemoProps {
  setIsOpen: (isOpen: boolean) => void;
  setIsPersonalTasks: (isPersonalTasks: boolean) => void;
  isPersonalTasks: boolean;
}

export const TooltipDemo = ({setIsOpen, setIsPersonalTasks, isPersonalTasks}: TooltipDemoProps) => {

  const handleClick = () => {
    setIsOpen(true);
    setIsPersonalTasks(isPersonalTasks);
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="text-white" variant="outline" onClick={handleClick}>+</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Создать задачу</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
