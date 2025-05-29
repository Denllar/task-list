import React, { useState, useEffect } from 'react';

interface Birthday {
  id: string;
  name: string;
  date: string; // формат: YYYY-MM-DD
}

export const TodayBirthdays: React.FC = () => {
  const [todayBirthdays, setTodayBirthdays] = useState<Birthday[]>([]);

  useEffect(() => {
    const checkTodayBirthdays = () => {
      const storedBirthdays = localStorage.getItem('birthday');
      if (!storedBirthdays) return [];
      
      const birthdays: Birthday[] = JSON.parse(storedBirthdays);
      const today = new Date();
      
      return birthdays.filter((birthday) => {
        const [_, month, day] = birthday.date.split('-');
        return (
          today.getDate() === parseInt(day) &&
          today.getMonth() + 1 === parseInt(month)
        );
      });
    };
    
    setTodayBirthdays(checkTodayBirthdays());
    
    // Проверяем каждый день
    const interval = setInterval(() => {
      setTodayBirthdays(checkTodayBirthdays());
    }, 86400000); // 24 часа
    
    return () => clearInterval(interval);
  }, []);

  // Расчет возраста человека
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const [birthYear, birthMonth, birthDay] = birthDate.split('-');
    
    let age = today.getFullYear() - parseInt(birthYear);
    
    // Проверяем, был ли уже день рождения в этом году
    const hasBirthdayOccurredThisYear = (
      today.getMonth() + 1 > parseInt(birthMonth) || 
      (today.getMonth() + 1 === parseInt(birthMonth) && today.getDate() >= parseInt(birthDay))
    );
    
    // Если день рождения в этом году еще не наступил, вычитаем 1 год
    if (!hasBirthdayOccurredThisYear) {
      age--;
    }
    
    return age;
  };

  if (todayBirthdays.length === 0) return null;

  return (
    <div className="bg-orange-500/20 p-3 rounded-md mb-4 text-3xl text-white">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🎂</span>
        <span className="font-bold">Сегодня день рождения:</span>
        {todayBirthdays.map((birthday, index) => (
          <React.Fragment key={birthday.id}>
            <span className="font-medium">{birthday.name}</span>
            <span className="font-medium"> ({calculateAge(birthday.date)})</span>
            {index < todayBirthdays.length - 1 && <span>,</span>}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};