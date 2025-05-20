import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [dob, setDob] = useState('');
  const [calendar, setCalendar] = useState([]);
  const [startDay, setStartDay] = useState(0);

  const today = new Date();
  const formattedToday = today.toDateString();

  const generateCalendar = () => {
    if (!dob) return;

    const start = new Date(dob);
    const end = new Date(dob);
    end.setFullYear(start.getFullYear() + 100);

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const rotatedDays = [];
    const startIndex = start.getDay();
    setStartDay(startIndex);

    for (let i = 0; i < 7; i++) {
      rotatedDays.push(days[(startIndex + i) % 7]);
    }

    const calendarData = [];
    let current = new Date(start);
    let week = [];
    let weekNum = 1;

    while (current < end) {
      if (week.length === 0) week.push(weekNum); // first item is week number

      let dateStr = current.toDateString();
      week.push({
        date: new Date(current),
        label: `${current.getDate().toString().padStart(2, '0')} ${current.toLocaleString('default', { month: 'short' })} ${current.getFullYear()}`,
        isToday: dateStr === formattedToday,
        isPast: current < today,
      });

      current.setDate(current.getDate() + 1);

      if (week.length === 8) { // 1 week number + 7 days
        calendarData.push(week);
        weekNum++;
        week = [];
      }
    }

    setCalendar({ rotatedDays, data: calendarData });
  };

  const scrollToToday = () => {
    const el = document.getElementById('today-week');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="app">
      <h2>📅 Beautiful 100-Year Calendar from Your Birth Date</h2>
      <div className="input-section">
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
        <button onClick={generateCalendar}>Generate Calendar</button>
        <button onClick={scrollToToday}>Today</button>
      </div>

      {calendar.data && (
        <div className="calendar">
          <div className="week-header">
            <div>Week #</div>
            {calendar.rotatedDays.map(day => (
              <div key={day}>{day.slice(0, 3)}</div>
            ))}
          </div>

          {calendar.data.map((week, idx) => {
            const weekNumber = week[0];
            const yearLabel = weekNumber % 52 === 1 ? (
              <div className="year-label">Year {Math.ceil(weekNumber / 52)}</div>
            ) : null;

            const isThisWeekToday = week.slice(1).some(d => d.isToday);

            return (
              <div key={idx}>
                {idx !== 0 && idx % 4 === 0 && <div className="week-break" />}
                {yearLabel}
                <div
                  className="week-row"
                  id={isThisWeekToday ? 'today-week' : undefined}
                >
                  <div className="week-number">{weekNumber}</div>
                  {week.slice(1).map((d, i) => (
                    <div
                      key={i}
                      className={`date-cell ${d.isToday ? 'today' : ''} ${d.isPast ? 'past' : ''}`}
                    >
                      {d.label}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default App;
