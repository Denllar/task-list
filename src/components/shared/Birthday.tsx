import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { BirthdaySidebar } from "./BirthdaySidebar";

export const Birthday = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [hasSoonBirthdays, setHasSoonBirthdays] = useState(false);

    // Проверяем, есть ли дни рождения в ближайшие 3 дня
    useEffect(() => {
        const checkSoonBirthdays = () => {
            const storedBirthdays = localStorage.getItem('birthday');
            if (!storedBirthdays) return false;
            
            const birthdays = JSON.parse(storedBirthdays);
            const today = new Date();
            
            return birthdays.some((birthday: { date: string }) => {
                const [month, day] = birthday.date.split('-');
                
                // Создаем дату дня рождения в текущем году
                const birthdayThisYear = new Date(
                    today.getFullYear(),
                    parseInt(month) - 1,
                    parseInt(day)
                );
                
                // Если день рождения уже прошел в этом году, проверяем на следующий год
                if (birthdayThisYear < today) {
                    birthdayThisYear.setFullYear(today.getFullYear() + 1);
                }
                
                // Разница в миллисекундах
                const diffTime = birthdayThisYear.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return diffDays <= 3 && diffDays >= 0;
            });
        };
        
        setHasSoonBirthdays(checkSoonBirthdays());
        
        // Проверяем каждый день
        const interval = setInterval(() => {
            setHasSoonBirthdays(checkSoonBirthdays());
        }, 86400000); // 24 часа
        
        return () => clearInterval(interval);
    }, []);

    const handleOpenSidebar = () => {
        setIsSidebarOpen(true);
    };

    const handleCloseSidebar = (open: boolean) => {
        setIsSidebarOpen(open);
    };

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="relative">
                            <Button 
                                className="text-white" 
                                variant='outline' 
                                onClick={handleOpenSidebar}
                            >
                                <svg fill="#ffffff" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M206,84H132V66.77881c11.68359-4.61865,18.45959-11.37842,20.14258-20.126,3.75879-19.53564-20.49121-40.78271-21.52539-41.67724a3.99871,3.99871,0,0,0-5.17774-.04834c-1.06738.88867-26.083,21.9956-22.39648,41.53271,1.67358,8.87207,8.7229,15.71045,20.957,20.35742V84H50a28.03146,28.03146,0,0,0-28,28v13.32812a39.19941,39.19941,0,0,0,11.71,27.8003c.739.7251,1.50684,1.40625,2.29,2.063V208a12.01312,12.01312,0,0,0,12,12H208a12.01312,12.01312,0,0,0,12-12V155.19287c.78333-.65674,1.55078-1.33935,2.29-2.06445A39.19941,39.19941,0,0,0,234,125.32812V112A28.03146,28.03146,0,0,0,206,84ZM110.90527,44.98486c-2.06445-10.90429,9.88379-24.83447,17.04493-31.582,6.94335,6.79444,18.44726,20.7666,16.33691,31.73877-1.17871,6.12305-6.66406,11.03711-16.31348,14.61865C117.81836,56.14014,112.07715,51.17285,110.90527,44.98486ZM212,208a4.00427,4.00427,0,0,1-4,4H48a4.00427,4.00427,0,0,1-4-4V160.35645a36.98453,36.98453,0,0,0,16.73926,3.63671,38.1714,38.1714,0,0,0,33.23718-21.09765,37.97775,37.97775,0,0,0,68.04712,0,38.1714,38.1714,0,0,0,33.23718,21.09765c.24121.0044.48047.00684.72168.00684A36.985,36.985,0,0,0,212,160.3623Zm14-82.67188a31.15032,31.15032,0,0,1-9.3125,22.08936,29.38081,29.38081,0,0,1-21.27441,8.57666A30.14653,30.14653,0,0,1,166,126a4,4,0,0,0-8,0,30,30,0,0,1-60,0,4,4,0,0,0-8,0,30.14653,30.14653,0,0,1-29.41309,29.99414,29.31112,29.31112,0,0,1-21.27441-8.57666A31.15032,31.15032,0,0,1,30,125.32812V112A20.02229,20.02229,0,0,1,50,92H206a20.02229,20.02229,0,0,1,20,20Z"></path> </g></svg>
                            </Button>
                            {hasSoonBirthdays && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></div>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Именинники</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            
            <BirthdaySidebar 
                open={isSidebarOpen} 
                onOpenChange={handleCloseSidebar} 
            />
        </>
    );
}