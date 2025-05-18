import React, { useState } from 'react';
import { useScheduleContext, NurseRole } from '../../contexts/ScheduleContext';

const roleLabels: Record<NurseRole, string> = {
  '인차지': '인차지',
  '중환': '중환',
  '엑팅': '엑팅',
};

const NurseSettingsPage: React.FC = () => {
  const { nurses, setNurses } = useScheduleContext();
  const [newNurse, setNewNurse] = useState<{ name: string; role: NurseRole }>({ name: '', role: '인차지' });

  const addNurse = () => {
    if (!newNurse.name.trim()) return;
    setNurses(prev => [
      ...prev,
      { id: Date.now(), name: newNurse.name.trim(), role: newNurse.role }
    ]);
    setNewNurse({ name: '', role: '인차지' });
  };

  const removeNurse = (id: number) => {
    setNurses(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px #eee' }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: '#1976d2' }}>근무자 설정</h2>
      <ul style={{ marginBottom: 12, paddingLeft: 0 }}>
        {nurses.map(n => (
          <li key={n.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <span style={{ flex: 1 }}>{n.name} <span style={{ color: '#1976d2', fontWeight: 500 }}>({roleLabels[n.role]})</span></span>
            <button onClick={() => removeNurse(n.id)} style={{ marginLeft: 8, color: '#d32f2f', border: 'none', background: 'none', cursor: 'pointer' }}>삭제</button>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        <input
          type="text"
          placeholder="이름"
          value={newNurse.name}
          onChange={e => setNewNurse(n => ({ ...n, name: e.target.value }))}
          style={{ flex: 1, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <select
          value={newNurse.role}
          onChange={e => setNewNurse(n => ({ ...n, role: e.target.value as NurseRole }))}
          style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
        >
          <option value="인차지">인차지</option>
          <option value="중환">중환</option>
          <option value="엑팅">엑팅</option>
        </select>
        <button onClick={addNurse} style={{ padding: '4px 8px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 500 }}>추가</button>
      </div>
    </div>
  );
};

export default NurseSettingsPage;