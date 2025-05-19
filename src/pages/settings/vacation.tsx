import React, { useState, useEffect } from 'react';
import { useScheduleContext } from '../../contexts/ScheduleContext';

const daysInMonth = 30;

const shiftTypes = {
  D: { label: '데이근무', color: '#ffe082' },
  E: { label: '이브닝', color: '#ffb74d' },
  N: { label: '나이트', color: '#ba68c8' },
  V: { label: '휴가', color: '#e0e0e0' },
  '': { label: '', color: '#fff' }
};

const STORAGE_KEY = 'vacation_schedule';

const VacationSettingsPage: React.FC = () => {
  const {
    dutySettings,
    setDutySettings,
    nurses
  } = useScheduleContext();

  const [schedule, setSchedule] = useState<string[][]>(
    nurses.map(() => Array(daysInMonth).fill(''))
  );
  const [message, setMessage] = useState<string | null>(null);

  // nurses 변경 시 schedule 행수 동기화
  useEffect(() => {
    setSchedule(prev =>
      nurses.map((n, idx) => prev[idx] ?? Array(daysInMonth).fill(''))
    );
  }, [nurses]);

  // 로컬스토리지에서 불러오기
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.schedule && parsed.dutySettings) {
        setSchedule(parsed.schedule);
        setDutySettings(parsed.dutySettings);
        setMessage('저장된 데이터를 불러왔습니다.');
      }
    }
    // eslint-disable-next-line
  }, []);

  // 저장
  const handleSave = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        schedule,
        dutySettings
      })
    );
    setMessage('저장되었습니다.');
  };

  // 초기화
  const handleReset = () => {
    setSchedule(nurses.map(() => Array(daysInMonth).fill('')));
    setMessage('초기화되었습니다.');
  };

  // 제출(예시: 콘솔 출력)
  const handleSubmit = () => {
    console.log('제출 데이터:', { schedule, dutySettings });
    setMessage('제출되었습니다.');
  };

  // 셀 클릭 시 근무 타입 순환
  const handleCellClick = (nurseIdx: number, dayIdx: number) => {
    const order = ['', 'D', 'E', 'N', 'V'];
    const current = schedule[nurseIdx][dayIdx];
    const next = order[(order.indexOf(current) + 1) % order.length];
    const newSchedule = schedule.map((row, i) =>
      i === nurseIdx ? row.map((cell, j) => (j === dayIdx ? next : cell)) : row
    );
    setSchedule(newSchedule);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px #eee' }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: '#1976d2' }}>3단계: 휴가 및 사전 근무 신청</h2>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <div>
          <label>데이근무(D) 인원</label>
          <input
            type="number"
            min={0}
            value={dutySettings.D}
            onChange={e => setDutySettings(ds => ({ ...ds, D: Number(e.target.value) }))}
            style={{ width: 40, marginLeft: 8 }}
          />
        </div>
        <div>
          <label>이브닝(E) 인원</label>
          <input
            type="number"
            min={0}
            value={dutySettings.E}
            onChange={e => setDutySettings(ds => ({ ...ds, E: Number(e.target.value) }))}
            style={{ width: 40, marginLeft: 8 }}
          />
        </div>
        <div>
          <label>나이트(N) 인원</label>
          <input
            type="number"
            min={0}
            value={dutySettings.N}
            onChange={e => setDutySettings(ds => ({ ...ds, N: Number(e.target.value) }))}
            style={{ width: 40, marginLeft: 8 }}
          />
        </div>
      </div>
      <div style={{ overflowX: 'auto', marginBottom: 16 }}>
        <table style={{ borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr>
              <th style={{ width: 80, background: '#f5f5f5' }}>이름</th>
              {[...Array(daysInMonth)].map((_, i) => (
                <th key={i} style={{ width: 28, background: (i+1)%7===4 ? '#ffeaea' : '#f5f5f5', color: '#888' }}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {nurses.map((nurse, nurseIdx) => (
              <tr key={nurse.id}>
                <td style={{ fontWeight: 500, background: '#fafafa', border: '1px solid #eee', textAlign: 'center' }}>{nurse.name}</td>
                {schedule[nurseIdx]?.map((shift, dayIdx) => (
                  <td
                    key={dayIdx}
                    style={{
                      border: '1px solid #eee',
                      background: shiftTypes[shift as keyof typeof shiftTypes].color,
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontWeight: 700,
                      color: shift === '' ? '#bbb' : '#222'
                    }}
                    onClick={() => handleCellClick(nurseIdx, dayIdx)}
                  >
                    {shift}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ margin: '16px 0', fontSize: 14 }}>
        <span style={{ marginRight: 16 }}><span style={{ background: '#ffe082', padding: '2px 8px', borderRadius: 4 }}>D</span> : 데이근무</span>
        <span style={{ marginRight: 16 }}><span style={{ background: '#ffb74d', padding: '2px 8px', borderRadius: 4 }}>E</span> : 이브닝</span>
        <span style={{ marginRight: 16 }}><span style={{ background: '#ba68c8', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>N</span> : 나이트</span>
        <span style={{ marginRight: 16 }}><span style={{ background: '#e0e0e0', padding: '2px 8px', borderRadius: 4 }}>V</span> : 휴가</span>
        <span style={{ marginRight: 16 }}>- : 없음</span>
      </div>
      {message && (
        <div style={{ margin: '8px 0 16px 0', color: '#1976d2', fontWeight: 500 }}>{message}</div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button onClick={handleReset} style={{ padding: '8px 20px', background: '#eee', border: 'none', borderRadius: 4, fontWeight: 500 }}>초기화</button>
        <button onClick={handleSave} style={{ padding: '8px 20px', background: '#eee', border: 'none', borderRadius: 4, fontWeight: 500 }}>저장</button>
        <button style={{ padding: '8px 20px', background: '#eee', border: 'none', borderRadius: 4, fontWeight: 500 }}>이전 단계로</button>
        <button onClick={handleSubmit} style={{ padding: '8px 20px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, fontWeight: 500 }}>다음 단계로</button>
      </div>
    </div>
  );
};

export default VacationSettingsPage;