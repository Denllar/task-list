import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Birthday {
  id: string;
  name: string;
  date: string; // формат: YYYY-MM-DD
}

export function BirthdaySidebar({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sortByDate, setSortByDate] = useState(true);

  // Загрузка дней рождения из localStorage
  useEffect(() => {
    const storedBirthdays = localStorage.getItem('birthday');
    if (storedBirthdays) {
      setBirthdays(JSON.parse(storedBirthdays));
    }
  }, [open]);

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

  // Сохранение дней рождения в localStorage
  const saveBirthdays = (updatedBirthdays: Birthday[]) => {
    localStorage.setItem('birthday', JSON.stringify(updatedBirthdays));
    setBirthdays(updatedBirthdays);
  };

  // Добавление нового дня рождения
  const addBirthday = () => {
    if (newName.trim() && newDate) {
      if (editingId) {
        // Редактирование существующего
        const updated = birthdays.map(b => 
          b.id === editingId ? { ...b, name: newName, date: newDate } : b
        );
        saveBirthdays(updated);
        setEditingId(null);
      } else {
        // Добавление нового
        const newBirthday: Birthday = {
          id: Date.now().toString(),
          name: newName,
          date: newDate
        };
        saveBirthdays([...birthdays, newBirthday]);
      }
      setNewName('');
      setNewDate('');
    }
  };

  // Удаление дня рождения
  const deleteBirthday = (id: string) => {
    const updated = birthdays.filter(b => b.id !== id);
    saveBirthdays(updated);
  };

  // Редактирование дня рождения
  const editBirthday = (birthday: Birthday) => {
    setNewName(birthday.name);
    setNewDate(birthday.date);
    setEditingId(birthday.id);
  };

 // Сортировка дней рождения
 const sortedBirthdays = [...birthdays].sort((a, b) => {
    if (sortByDate) {
      const today = new Date();
      const [monthA, dayA] = a.date.split('-');
      const [monthB, dayB] = b.date.split('-');
      
      // Создаем даты дней рождения в текущем году
      const birthdayA = new Date(
        today.getFullYear(),
        parseInt(monthA) - 1,
        parseInt(dayA)
      );
      
      const birthdayB = new Date(
        today.getFullYear(),
        parseInt(monthB) - 1,
        parseInt(dayB)
      );
      
      // Если день рождения уже прошел в этом году, переносим на следующий год
      if (birthdayA < today) {
        birthdayA.setFullYear(today.getFullYear() + 1);
      }
      
      if (birthdayB < today) {
        birthdayB.setFullYear(today.getFullYear() + 1);
      }
      
      // Сортируем по близости к текущей дате (по количеству дней до дня рождения)
      return birthdayA.getTime() - birthdayB.getTime();
    } else {
      // Сортировка по имени
      return a.name.localeCompare(b.name);
    }
  });

  // Проверка, скоро ли день рождения (в течение 3 дней)
  const isBirthdaySoon = (date: string): boolean => {
    const today = new Date();
    const [month, day] = date.split('-');
    
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
  };

  // Проверка, сегодня ли день рождения
  const isBirthdayToday = (date: string): boolean => {
    const today = new Date();
    const [_, month, day] = date.split('-');
    
    return (
      today.getDate() === parseInt(day) &&
      today.getMonth() + 1 === parseInt(month)
    );
  };

  // Форматирование даты для отображения
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  if (!open) return null;

  return (
    <div className="text-white fixed inset-y-0 right-0 z-50 w-[1000px] bg-background border-l-[3px] border-black shadow-xl flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center p-4">
        <h2 className="text-center text-3xl font-bold ">Именинники</h2>
        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-4">
          <div className="flex items-end gap-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="name">Имя</Label>
              <Input 
                id="name" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                className='text-black'
                placeholder="Введите имя" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Дата рождения</Label>
              <Input 
                id="date" 
                type="date" 
                value={newDate}
                className='text-black' 
                onChange={(e) => setNewDate(e.target.value)} 
              />
            </div>
            <Button disabled={newName.length===0 && newDate.length===0} onClick={addBirthday}>
              {editingId ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <h3 className="text-lg font-semibold">Список дней рождения</h3>
            <Button 
              variant="outline" 
              onClick={() => setSortByDate(!sortByDate)}
            >
              Сортировать по {sortByDate ? 'имени' : 'дате'}
            </Button>
          </div>
          
          <div className="border rounded-md divide-y">
            {sortedBirthdays.length > 0 ? (
              sortedBirthdays.map((birthday) => (
                <div 
                  key={birthday.id} 
                  className="flex justify-between items-center p-3"
                >
                  <div className='text-xl'>
                    <span className="font-bold">{birthday.name}</span>
                    <span className="ml-2">{formatDate(birthday.date)}</span>
                    <span className="ml-2">({calculateAge(birthday.date)})</span>
                    {isBirthdayToday(birthday.date) && (
                      <span className="ml-2 text-orange-500 font-bold">🎂</span>
                    )}
                    {!isBirthdayToday(birthday.date) && isBirthdaySoon(birthday.date) && (
                      <span className="ml-2 text-orange-500 font-bold">Скоро!</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => editBirthday(birthday)}
                    >
                      Изменить
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteBirthday(birthday.id)}
                    >
                      Удалить
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="p-3 text-center">Нет сохраненных дней рождения</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}