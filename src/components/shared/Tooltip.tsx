import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export const TooltipDemo = ({setIsOpen}: {setIsOpen: (isOpen: boolean) => void}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="text-white" variant="outline" onClick={() => setIsOpen(true)}>+</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Создать задачу</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
