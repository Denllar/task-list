import { Button } from "@/components/ui/button"
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface ITrash {
    setIsOpenTrash: (isOpen: boolean | ((prev: boolean) => boolean)) => void,
    isActive: boolean
}

export const Trash = ({ setIsOpenTrash, isActive }: ITrash) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button className={cn('text-white', isActive ? 'bg-blue-500' : '')} variant='outline' onClick={() => setIsOpenTrash((prev: boolean) => !prev)}>
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Корзина</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
