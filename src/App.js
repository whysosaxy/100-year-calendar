import React, { useState } from 'react';
import './App.css';

const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function App() {
  const [dob, setDob] = useState('');
  const [calendar, setCalendar] = useState([]);
  const [startDayIndex, setStartDayIndex] = useState(0);
  const [todayIndex, setTodayIndex] = useState(null);

  const generateCalendar = () => {
    if (!dob) return alert('Please enter your date of birth.');

    const startDate = new Date(dob);
    const endDate = new Date(dob);
    endDate.setFullYear(endDate.getFullYear() + 100);
    const originalDayIndex = startDate.getDay();
    setStartDayIndex(originalDayIndex);

    const rotatedDays = Array.from({ length: 7 }, (_, i) => fullDayNames[(originalDayIndex + i) % 7].slice(0, 3));
    const weeks = [];
    let current = new Date(startDate);
    let pulseNumber = 1;
    let quadNumber = 1;
    let orbitNumber = 1;
    const todayStr = new Date().toDateString();

    while (current < endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const dateStr = current.toDateString();
        week.push({
          date: new Date(current),
          isToday: dateStr === todayStr,
          isPast: new Date(current) < new Date()
        });
        current.setDate(current.getDate() + 1);
      }

      weeks.push({
        pulse: pulseNumber,
        quad: quadNumber,
        orbit: orbitNumber,
        days: week
      });

      if (pulseNumber % 4 === 0) quadNumber++;
      if (pulseNumber % 52 === 0) {
        orbitNumber++;
        quadNumber = 1;
      }

      pulseNumber++;
    }

    setCalendar({ rotatedDays, weeks });
  };

  const scrollToToday = () => {
    const todayElement = document.querySelector('.today');
    if (todayElement) {
      todayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="app">
      <h2>🌌 100-Orbit Spark Calendar</h2>
      <div className="input-group">
        <label>Date of Birth:</label>
        <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
        <button onClick={generateCalendar}>Generate</button>
        <button onClick={scrollToToday}>Today</button>
      </div>

      {calendar.rotatedDays && (
        <div className="calendar">
          <div className="week-header">
            <div>Pulse #</div>
            {calendar.rotatedDays.map((day, idx) => <div key={idx}>{day}</div>)}
          </div>

          {calendar.weeks.map((week, idx) => (
            <React.Fragment key={idx}>
              {week.pulse % 52 === 1 && (
                <div className="section-label orbit-label">🪐 Orbit {week.orbit}</div>
              )}
              {week.pulse % 4 === 1 && (
                <div className="section-label quad-label">📦 Quad {week.quad}</div>
              )}
              <div className="week-row">
                <div className="week-number">{week.pulse}</div>
                {week.days.map((day, i) => (
                  <div
                    key={i}
                    className={`date-cell ${day.isToday ? 'today' : ''} ${day.isPast ? 'past' : ''}`}
                  >
                    {day.date.getDate().toString().padStart(2, '0')}/
                    {(day.date.getMonth() + 1).toString().padStart(2, '0')}/
                    {day.date.getFullYear()}
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
