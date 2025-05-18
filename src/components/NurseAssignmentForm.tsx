import React, { useState } from 'react';
import { useScheduleContext } from '../contexts/ScheduleContext';

type NurseRole = '인차지' | '중환' | '엑팅';

const NurseAssignmentForm: React.FC = () => {
  const { nurses, setNurses } = useScheduleContext();
  const [name, setName] = useState('');
  const [role, setRole] = useState<NurseRole>('인차지');

  const addNurse = () => {
    if (!name.trim()) {
      alert('이름을 입력하세요.');
      return;
    }
    if (nurses.some(n => n.name === name.trim())) {
      alert('이미 등록된 이름입니다.');
      return;
    }
    setNurses([...nurses, { id: Date.now(), name: name.trim(), role }]);
    setName('');
  };

  const removeNurse = (id: number) => {
    setNurses(nurses.filter(n => n.id !== id));
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <h3>간호사 명단</h3>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="이름"
        style={{ marginRight: 8, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
      />
      <select
        value={role}
        onChange={e => setRole(e.target.value as NurseRole)}
        style={{ marginRight: 8, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
      >
        <option value="인차지">인차지</option>
        <option value="중환">중환</option>
        <option value="엑팅">엑팅</option>
      </select>
      <button
        onClick={addNurse}
        style={{ padding: '4px 12px', borderRadius: 4, background: '#1976d2', color: '#fff', border: 'none' }}
        disabled={!name.trim()}
      >
        추가
      </button>
      <ul style={{ marginTop: 12 }}>
        {nurses.map(n => (
          <li key={n.id} style={{ marginBottom: 4 }}>
            {n.name} ({n.role})
            <button
              onClick={() => removeNurse(n.id)}
              style={{
                marginLeft: 8,
                padding: '2px 8px',
                borderRadius: 4,
                background: '#e57373',
                color: '#fff',
                border: 'none',
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NurseAssignmentForm;