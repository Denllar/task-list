interface State {
    day: string;
    month: string;
    year: string;
}

interface InputOTPWithSeparatorProps {
    state: State;
    setState: (newState: State) => void;
    setIsOnChange: React.Dispatch<React.SetStateAction<boolean>>
}

export function InputOTPWithSeparator({ setState, setIsOnChange }: InputOTPWithSeparatorProps) {
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsOnChange(true);
        const selectedDate = new Date(event.target.value);
        
        // Проверяем, является ли дата валидной
        if (!isNaN(selectedDate.getTime())) {
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
            const year = String(selectedDate.getFullYear()).slice(-2); // Двузначный год

            setState({ day, month, year });
        } else {
            setState({ day: '', month: '', year: '' });
        }
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsOnChange(true);
        const selectedMonthYear = event.target.value; // Формат: YYYY-MM
        const [year, month] = selectedMonthYear.split('-');

        setState({
            day: '', // Оставляем день пустым
            month: month.padStart(2, '0'), // Форматируем месяц
            year: year.slice(-2), // Двузначный год
        });
    };

    return (
        <div className="flex gap-4">
            до
            <input type="date" className="text-black" onChange={handleDateChange} />
            или в течении месяца
            <input type="month" className="text-black" onChange={handleMonthChange} />
        </div>
    )
}
