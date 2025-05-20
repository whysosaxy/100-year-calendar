import React, { useState, useRef } from 'react';
import './App.css';

const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function App() {
  const [dob, setDob] = useState('');
  const [calendar, setCalendar] = useState([]);
  const [birthdayRefs, setBirthdayRefs] = useState([]);
  const birthdayIndexRef = useRef(0);
  const todayRef = useRef(null);

  const generateCalendar = () => {
    if (!dob) return alert('Please enter your date of birth.');

    const startDate = new Date(dob);
    const endDate = new Date(dob);
    endDate.setFullYear(endDate.getFullYear() + 100);

    const todayStr = new Date().toDateString();
    const rotatedDays = Array.from({ length: 7 }, (_, i) =>
      fullDayNames[(startDate.getDay() + i) % 7].slice(0, 3)
    );

    const weeks = [];
    let current = new Date(startDate);
    let pulse = 1, quad = 1, orbit = 1;

    const birthdays = [];
    const dobDay = startDate.getDate();
    const dobMonth = startDate.getMonth();

    while (current < endDate) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const isToday = current.toDateString() === todayStr;
        const isPast = current < new Date();
        const isBirthday = current.getDate() === dobDay && current.getMonth() === dobMonth;

        const dateObj = {
          date: new Date(current),
          isToday,
          isPast,
          isBirthday,
        };

        if (isToday) todayRef.current = dateObj;
        if (isBirthday) birthdays.push(dateObj);

        week.push(dateObj);
        current.setDate(current.getDate() + 1);
      }

      weeks.push({ pulse, quad, orbit, days: week });

      if (pulse % 4 === 0) quad++;
      if (pulse % 52 === 0) {
        orbit++;
        quad = 1;
      }

      pulse++;
    }

    const refs = birthdays.map(() => React.createRef());
    setBirthdayRefs(refs);

    // Attach refs to birthdays
    weeks.forEach(week => {
      week.days.forEach(day => {
        if (day.isBirthday) {
          day.ref = refs.shift();
        }
      });
    });

    const futureBirthdays = birthdays.filter(b => b.date >= new Date()).sort((a, b) => a.date - b.date);
    const pastBirthdays = birthdays.filter(b => b.date < new Date()).sort((a, b) => b.date - a.date);
    birthdayIndexRef.current = {
      future: futureBirthdays,
      past: pastBirthdays,
      futureIndex: 0,
      pastIndex: 0,
    };

    setCalendar({ rotatedDays, weeks });
  };

  const scrollToBirthday = (direction) => {
    const set = birthdayIndexRef.current;
    const list = direction === 'next' ? set.future : set.past;
    const indexKey = direction === 'next' ? 'futureIndex' : 'pastIndex';

    if (list.length === 0 || set[indexKey] >= list.length) return;

    const birthday = list[set[indexKey]];
    const el = document.querySelector(`[data-date="${birthday.date.toDateString()}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    set[indexKey]++;
  };

  const scrollToToday = () => {
    const today = new Date().toDateString();
    const el = document.querySelector(`[data-date="${today}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="app">
      <h2>🌌 100-Orbit Spark Calendar</h2>
      <div className="input-group">
        <label>Date of Birth:</label>
        <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
        <button onClick={generateCalendar}>Generate</button>
        <button onClick={scrollToToday}>Today</button>
        <button onClick={() => scrollToBirthday('next')}>Next Birthday</button>
        <button onClick={() => scrollToBirthday('past')}>Previous Birthday</button>
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
                    className={`date-cell ${day.isToday ? 'today' : ''} ${day.isPast ? 'past' : ''} ${day.isBirthday ? 'birthday' : ''}`}
                    data-date={day.date.toDateString()}
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
