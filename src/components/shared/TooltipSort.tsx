import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ITooltipSort {
  // setIsOpen: (isOpen: boolean) => void,
  text: string,
  description: string,
  variant: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "overdue" | "urgent" | "completed" | "undone",
  setFilter: ()=>void,
  isActive: boolean
}

export const TooltipSort = ({ text, description, variant, setFilter, isActive}: ITooltipSort) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className={cn('text-white', isActive ? 'bg-blue-500' : '')} variant={variant} onClick={setFilter}>{text}</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
