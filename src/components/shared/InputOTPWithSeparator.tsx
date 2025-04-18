import React from "react";

interface State {
    day: string;
    month: string;
    year: string;
}

interface InputOTPWithSeparatorProps {
    state: State;
    setState: (newState: State) => void;
}

export function InputOTPWithSeparator({ state, setState }: InputOTPWithSeparatorProps) {
    // Форматируем начальную дату для input type="date"
    const getInitialDate = () => {
        if (state.year && state.month && state.day) {
            return `20${state.year}-${state.month}-${state.day}`;
        }
        return '';
    };

    // Форматируем начальную дату для input type="month"
    const getInitialMonth = () => {
        // Если есть день, значит это задача с конкретной датой,
        // поэтому поле "в течении месяца" должно быть пустым
        if (state.day) {
            return '';
        }
        // Если дня нет, но есть год и месяц, значит это задача "в течении месяца"
        if (state.year && state.month) {
            return `20${state.year}-${state.month}`;
        }
        return '';
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        const selectedMonthYear = event.target.value; // Формат: YYYY-MM
        const [year, month] = selectedMonthYear.split('-');

        setState({
            day: '', // Оставляем день пустым
            month: month.padStart(2, '0'), // Форматируем месяц
            year: year.slice(-2), // Двузначный год
        });
    };
    
    return (
        <div>
            <div className="flex gap-4 items-center mb-10">
                до
                <input 
                    type="date" 
                    className="text-black" 
                    onChange={handleDateChange}
                    value={getInitialDate()} 
                />
                или в течении месяца
                <input 
                    type="month" 
                    className="text-black" 
                    onChange={handleMonthChange}
                    value={getInitialMonth()} 
                />
            </div>
        </div>
    )
}
