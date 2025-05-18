import React, { useState } from 'react';
import { useScheduleContext } from '../../contexts/ScheduleContext';

const HolidaySettingsPage: React.FC = () => {
  const { holidays, setHolidays } = useScheduleContext();
  const [newHoliday, setNewHoliday] = useState<number | ''>('');

  const addHoliday = () => {
    const day = Number(newHoliday);
    if (!day || holidays.includes(day)) return;
    setHolidays(prev => [...prev, day].sort((a, b) => a - b));
    setNewHoliday('');
  };

  const removeHoliday = (day: number) => {
    setHolidays(prev => prev.filter(d => d !== day));
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px #eee' }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: '#1976d2' }}>수당일 설정</h2>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        <input
          type="number"
          min={1}
          max={31}
          placeholder="일"
          value={newHoliday}
          onChange={e => setNewHoliday(e.target.value === '' ? '' : Number(e.target.value))}
          style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button onClick={addHoliday} style={{ padding: '4px 8px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 500 }}>추가</button>
      </div>
      <ul style={{ marginBottom: 12, paddingLeft: 0 }}>
        {holidays.map(day => (
          <li key={day} style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
            <span style={{ flex: 1 }}>{day}일</span>
            <button onClick={() => removeHoliday(day)} style={{ marginLeft: 8, color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer' }}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HolidaySettingsPage;