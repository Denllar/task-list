import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { useRef, useEffect } from "react"
import { ITask } from "@/App"
import { ru } from 'date-fns/locale'

interface CalendarDemoProps {
  onSelectDate: (date: Date | undefined, monthOnly?: boolean) => void;
  tasks: ITask[];
  externalSelectedDate?: Date | null; // Новый проп для синхронизации с родительским компонентом
}

export function CalendarDemo({ onSelectDate, tasks, externalSelectedDate }: CalendarDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const calendarRef = useRef<HTMLDivElement>(null);
  const lastSelectedMonthRef = useRef<string | null>(null);
  const [selectedMonthElement, setSelectedMonthElement] = React.useState<HTMLElement | null>(null);

  // Синхронизация с внешним значением selectedDate
  useEffect(() => {
    // Если внешний selectedDate равен null, сбрасываем внутренний выбор
    if (externalSelectedDate === null) {
      setDate(new Date()); // Возвращаем к текущей дате
      lastSelectedMonthRef.current = null; // Сбрасываем информацию о выбранном месяце
      
      // Снимаем выделение с текущего месяца
      if (selectedMonthElement) {
        selectedMonthElement.style.backgroundColor = 'transparent';
        setSelectedMonthElement(null);
      }
    } else if (externalSelectedDate) {
      setDate(externalSelectedDate);
      
      // Если это месячный фильтр, ищем и выделяем соответствующий заголовок месяца
      if (lastSelectedMonthRef.current) {
        highlightSelectedMonth();
      }
    }
  }, [externalSelectedDate]);

  // Функция для подсветки выбранного месяца
  const highlightSelectedMonth = () => {
    if (!calendarRef.current || !lastSelectedMonthRef.current) return;

    // Сбрасываем предыдущее выделение
    if (selectedMonthElement) {
      selectedMonthElement.style.backgroundColor = 'transparent';
    }

    // Находим все заголовки месяцев
    setTimeout(() => {
      const monthHeaders = calendarRef.current?.querySelectorAll('.rdp-caption_label, .month-title');
      if (!monthHeaders || !lastSelectedMonthRef.current) return;

      // Получаем месяц и год из lastSelectedMonthRef
      const [selectedMonth, selectedYear] = lastSelectedMonthRef.current.split('-');
      const monthNum = parseInt(selectedMonth);
      const year = parseInt(selectedYear);

      // Находим соответствующий заголовок
      monthHeaders.forEach(header => {
        const text = header.textContent || '';
        const match = text.match(/([А-Яа-яA-Za-z]+)\s+(\d{4})/);
        
        if (match) {
          const monthName = match[1];
          const headerYear = parseInt(match[2]);
          
          if (headerYear === year) {
            // Получаем индекс месяца из названия
            const monthIndex = getMonthIndexFromName(monthName);
            
            // Если это наш месяц (с учетом +1 для индексов)
            if (monthIndex + 1 === monthNum) {
              const element = header as HTMLElement;
              element.style.backgroundColor = 'rgba(59, 130, 246, 0.5)'; // Голубоватый цвет
              setSelectedMonthElement(element);
            }
          }
        }
      });
    }, 300);
  };

  // Создаем кастомную локализацию с заглавными буквами
  const customRussianLocale = {
    ...ru,
    localize: {
      ...ru.localize,
      day: (day: number, options?: { width?: string }) => {
        console.log(options);
        
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        return days[day];
      },
      month: (month: number, options?: { width?: string }) => {
        console.log(options);
        const months = [
          'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
          'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];
        return months[month];
      }
    }
  };

  // Функция для проверки наличия задач на конкретную дату
  const hasTasksOnDate = (day: Date): boolean => {
    return tasks.some(task => {
      // Проверяем совпадение дня, месяца и года
      if (task.day) {
        const taskDay = parseInt(task.day, 10);
        const taskMonth = parseInt(task.month, 10) - 1; // JavaScript месяцы начинаются с 0
        const taskYear = parseInt(task.year, 10) + 2000; // Предполагаем 20XX год
        
        return day.getDate() === taskDay && 
               day.getMonth() === taskMonth && 
               day.getFullYear() === taskYear;
      } else {
        // Для задач "в течение месяца" сравниваем только месяц и год
        const taskMonth = parseInt(task.month, 10) - 1;
        const taskYear = parseInt(task.year, 10) + 2000;
        
        return day.getMonth() === taskMonth && 
               day.getFullYear() === taskYear;
      }
    });
  };

  // Добавляем атрибуты data-* для упрощения выбора месяцев
  useEffect(() => {
    if (calendarRef.current) {
      // Отложенное выполнение для уверенности, что календарь отрендерился
      setTimeout(() => {
        const monthHeaders = calendarRef.current?.querySelectorAll('.rdp-caption_label, .month-title');
        
        // Отладочная информация
        console.log("Найдено заголовков месяцев:", monthHeaders?.length);
        
        monthHeaders?.forEach(header => {
          const text = header.textContent || '';
          console.log("Заголовок месяца:", text);
          
          // Добавляем атрибут data-month-selector
          header.setAttribute('data-month-selector', 'true');
          
          // Добавляем стили напрямую, если они не применились через classNames
          const element = header as HTMLElement;
          element.style.cursor = 'pointer';
          element.style.padding = '4px 8px';
          element.style.borderRadius = '4px';
          element.style.transition = 'background-color 0.2s';
          
          // Добавляем обработчики событий наведения для визуальной подсказки
          element.addEventListener('mouseover', () => {
            if (element !== selectedMonthElement) {
              element.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
            }
          });
          
          element.addEventListener('mouseout', () => {
            if (element !== selectedMonthElement) {
              element.style.backgroundColor = 'transparent';
            }
          });
        });
        
        // Подсвечиваем выбранный месяц, если он есть
        if (lastSelectedMonthRef.current) {
          highlightSelectedMonth();
        }
      }, 200);
    }
  }, [date]); // Запускаем при изменении даты

  // Функция для получения индекса месяца из его названия
  const getMonthIndexFromName = (monthName: string): number => {
    const monthsRu = [
      'январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 
      'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];
    const monthsEn = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december'
    ];
    
    const monthNameLower = monthName.toLowerCase();
    
    // Ищем в русских названиях
    let monthIndex = monthsRu.findIndex(m => 
      monthNameLower.includes(m) || m.includes(monthNameLower)
    );
    
    // Если не нашли, ищем в английских
    if (monthIndex === -1) {
      monthIndex = monthsEn.findIndex(m => 
        monthNameLower.includes(m) || m.includes(monthNameLower)
      );
    }
    
    return monthIndex !== -1 ? monthIndex : new Date().getMonth();
  };

  const selectMonthOnly = (monthText: string) => {
    console.log("Выбор месяца по тексту:", monthText);
    
    // Пробуем различные форматы месяц-год: "Январь 2023", "January 2023", "01/2023" и т.д.
    let match = monthText.match(/([А-Яа-яA-Za-z]+)\s+(\d{4})/);
    
    if (!match) {
      match = monthText.match(/(\d{1,2})[\/\-\.](\d{4})/);
      if (match) {
        // Если формат "MM/YYYY"
        const monthNum = parseInt(match[1], 10);
        const year = parseInt(match[2], 10);
        if (!isNaN(monthNum) && !isNaN(year)) {
          // Проверяем, был ли этот месяц уже выбран
          const monthKey = `${monthNum}-${year}`;
          if (lastSelectedMonthRef.current === monthKey) {
            // Если уже был выбран этот месяц, сбрасываем выбор
            console.log("Сбрасываем выбор месяца");
            lastSelectedMonthRef.current = null;
            
            // Сбрасываем выделение выбранного месяца
            if (selectedMonthElement) {
              selectedMonthElement.style.backgroundColor = 'transparent';
              setSelectedMonthElement(null);
            }
            
            setDate(new Date());
            onSelectDate(undefined, false);
            return true;
          }
          
          // Иначе выбираем этот месяц
          lastSelectedMonthRef.current = monthKey;
          const selectedDate = new Date(year, monthNum - 1, 1);
          console.log("Выбран месяц (числовой формат):", selectedDate);
          setDate(selectedDate);
          onSelectDate(selectedDate, true);
          
          // Выделяем выбранный месяц визуально
          highlightSelectedMonth();
          
          return true;
        }
      }
      return false;
    }
    
    const monthName = match[1];
    const year = parseInt(match[2], 10);
    
    if (isNaN(year)) return false;
    
    const monthIndex = getMonthIndexFromName(monthName);
    if (monthIndex === -1) return false;

    // Проверяем, был ли этот месяц уже выбран
    const monthKey = `${monthIndex+1}-${year}`;
    if (lastSelectedMonthRef.current === monthKey) {
      // Если уже был выбран этот месяц, сбрасываем выбор
      console.log("Сбрасываем выбор месяца");
      lastSelectedMonthRef.current = null;
      
      // Сбрасываем выделение выбранного месяца
      if (selectedMonthElement) {
        selectedMonthElement.style.backgroundColor = 'transparent';
        setSelectedMonthElement(null);
      }
      
      setDate(new Date());
      onSelectDate(undefined, false);
      return true;
    }

    // Иначе выбираем этот месяц
    lastSelectedMonthRef.current = monthKey;
    const selectedDate = new Date(year, monthIndex, 1);
    console.log("Выбран месяц (текстовый формат):", selectedDate);
    setDate(selectedDate);
    onSelectDate(selectedDate, true);
    
    // Выделяем выбранный месяц визуально
    highlightSelectedMonth();
    
    return true;
  };

  // Глобальный обработчик кликов внутри календаря
  const handleCalendarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    
    // Логируем информацию о клике для отладки
    console.log("Клик в календаре:", target.tagName, target.className, target.textContent);
    
    // Проверяем атрибут data-month-selector
    if (target.getAttribute('data-month-selector') === 'true') {
      if (target.textContent && selectMonthOnly(target.textContent)) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }
    
    // Проверяем, соответствует ли текст формату месяц+год
    const hasMonthYearPattern = target.textContent && /^[А-Яа-яA-Za-z]+\s+\d{4}$/.test(target.textContent);
    
    // Ищем любой элемент заголовка месяца
    const possibleHeaderElement = 
      target.closest('[data-month-selector="true"]') ||
      target.closest('.month-title') ||
      target.closest('.rdp-caption_label') || 
      target.closest('.rdp-caption') ||
      (hasMonthYearPattern ? target : null);
    
    if (possibleHeaderElement && possibleHeaderElement.textContent) {
      console.log("Найден возможный заголовок месяца:", possibleHeaderElement.textContent);
      const text = possibleHeaderElement.textContent;
      if (selectMonthOnly(text)) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Проверяем, есть ли задачи на выбранную дату
      if (hasTasksOnDate(selectedDate)) {
        console.log("Выбрана дата с задачами:", selectedDate);
        
        // Если выбрана та же дата, которая уже выбрана, снимаем выделение
        if (date && 
            date.getDate() === selectedDate.getDate() && 
            date.getMonth() === selectedDate.getMonth() && 
            date.getFullYear() === selectedDate.getFullYear()) {
          console.log("Снимаем выделение с даты");
          lastSelectedMonthRef.current = null; // Также сбрасываем выбранный месяц
          
          // Сбрасываем выделение выбранного месяца
          if (selectedMonthElement) {
            selectedMonthElement.style.backgroundColor = 'transparent';
            setSelectedMonthElement(null);
          }
          
          setDate(new Date()); // Сбрасываем на текущую дату без выделения
          onSelectDate(undefined, false);
          return;
        }
        
        // Если это новый день, сбрасываем выбранный месяц
        lastSelectedMonthRef.current = null;
        
        // Сбрасываем выделение выбранного месяца
        if (selectedMonthElement) {
          selectedMonthElement.style.backgroundColor = 'transparent';
          setSelectedMonthElement(null);
        }
        
        setDate(selectedDate);
        onSelectDate(selectedDate, false);
      } else {
        console.log("На выбранную дату нет задач, выбор игнорируется");
        // Не меняем выбранную дату, если на неё нет задач
      }
    } else {
      lastSelectedMonthRef.current = null;
      
      // Сбрасываем выделение выбранного месяца
      if (selectedMonthElement) {
        selectedMonthElement.style.backgroundColor = 'transparent';
        setSelectedMonthElement(null);
      }
      
      setDate(selectedDate);
      onSelectDate(selectedDate, false);
    }
  };

  // Функция для преобразования заголовков месяцев и выделения выходных в head_cell
  useEffect(() => {
    // Отложенное выполнение для уверенности, что календарь полностью отрендерился
    const timeout = setTimeout(() => {
      if (calendarRef.current) {
        // Находим все заголовки дней недели
        const headCells = calendarRef.current.querySelectorAll('.rdp-head_cell');
        headCells.forEach(cell => {
          if (cell.textContent) {
            // Преобразуем текст - переводим все буквы в верхний регистр
            cell.textContent = cell.textContent.toUpperCase();
            // Если это СБ или ВС, красим в серый
            if (cell.textContent === 'СБ' || cell.textContent === 'ВС') {
              (cell as HTMLElement).style.color = '#bbbbbd';
            }
          }
        });

        // Находим все названия месяцев и делаем первую букву заглавной
        const captionLabels = calendarRef.current.querySelectorAll('.rdp-caption_label');
        captionLabels.forEach(label => {
          if (label.textContent) {
            // Проверяем, содержит ли текст пробел (месяц и год)
            const parts = label.textContent.split(' ');
            if (parts.length === 2) {
              // Делаем первую букву месяца заглавной, остальные строчными
              const month = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
              label.textContent = `${month} ${parts[1]}`;
            }
          }
        });
        // Подсвечиваем выбранный месяц, если он есть
        if (lastSelectedMonthRef.current) {
          highlightSelectedMonth();
        }
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [date]); // Перезапускаем при изменении даты
  
  return (
    <div onClick={handleCalendarClick} ref={calendarRef} className="calendar-wrapper">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        numberOfMonths={8}
        locale={customRussianLocale} // Используем настроенную русскую локализацию
        weekStartsOn={1} // Неделя начинается с понедельника
        className="rounded-xl bg-violet-600 text-white"
        classNames={{
          caption: "flex justify-center pt-1 relative items-center text-white month-caption",
          caption_label: "text-white font-bold px-2 py-1 hover:bg-purple-500 rounded transition-colors duration-200 cursor-pointer month-title",
          nav_button: "h-7 w-7 bg-white/20 p-0 hover:bg-white/30 text-white rounded-full",
          day_today: "bg-orange-500 text-white font-semibold", // Выделяем текущий день оранжевым цветом
          day_selected: "bg-blue-500 text-white font-semibold hover:bg-blue-600", // Выделяем выбранный день голубым цветом
          day_disabled: "text-gray-400 font-normal cursor-not-allowed" // Только текст серого цвета без фона
        }}
        modifiers={{
          disabled: (day) => !hasTasksOnDate(day), // Отключаем дни без задач
          weekend: (day) => day.getDay() === 0 || day.getDay() === 6 // СБ и ВС
        }}
        modifiersStyles={{
          disabled: { opacity: 1 }, // Полная непрозрачность
          weekend: { backgroundColor: 'rgba(230, 231, 233, 0.4)' } // Серый фон для выходных
        }}
      />
    </div>
  )
}
