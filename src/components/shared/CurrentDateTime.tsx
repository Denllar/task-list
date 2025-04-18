import React from 'react';

export const CurrentDateTime: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = React.useState({
    date: '',
    time: ''
  });

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();
      setCurrentDateTime({ date: formattedDate, time: formattedTime });
    };

    const intervalId = setInterval(updateTime, 1000);
    updateTime(); // Обновляем сразу при монтировании

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-white font-bold mt-4">
      <p className="text-6xl">{currentDateTime.date}</p>
      <p className="text-4xl">{currentDateTime.time}</p>
    </div>
  );
};