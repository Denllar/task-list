import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

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

export function InputOTPWithSeparator({ state, setState, setIsOnChange }: InputOTPWithSeparatorProps) {
    const handleChange = (value: string) => {
        setIsOnChange(true);
        const numericValue = value.replace(/\D/g, '');

        // Устанавливаем значения для дня, месяца и года
        const validDay = numericValue.slice(0, 2);
        const validMonth = numericValue.slice(2, 4);
        const validYear = numericValue.slice(4, 6);

        // Обновляем состояние с новыми значениями
        setState({
            day: validDay,
            month: validMonth,
            year: validYear,
        });
    };
    
    return (
        <InputOTP maxLength={6} onChange={handleChange}>
            <InputOTPGroup>
                <InputOTPSlot placeholder="Д" index={0} value={state.day[0]} />
                <InputOTPSlot placeholder="Д" index={1} value={state.day[1]} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot placeholder="М" index={2} value={state.month[0]} />
                <InputOTPSlot placeholder="М" index={3} value={state.month[1]} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot placeholder="Г" index={4} value={state.year[0]} />
                <InputOTPSlot placeholder="Г" index={5} value={state.year[1]} />
            </InputOTPGroup>
        </InputOTP>
    )
}
