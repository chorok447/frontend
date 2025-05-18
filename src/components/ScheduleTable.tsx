import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useScheduleContext, DutyType, NurseRole } from '../contexts/ScheduleContext';

const dutyTypes: DutyType[] = ['', 'N', 'D', 'E', 'OFF'];
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
const roleLabels: Record<NurseRole, string> = {
  '인차지': '인차지',
  '중환': '중환',
  '엑팅': '엑팅',
};

const ScheduleTable: React.FC = () => {
  const {
    rows, setDuty, holidays, year, month,
  } = useScheduleContext();
  const router = useRouter();

  // 역할 필터 상태 추가
  const [roleFilter, setRoleFilter] = useState<NurseRole | '전체'>('전체');

  // 실제 달의 일수 계산
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 역행 듀티 금지 검사 함수
  const isReverseDuty = (prev: DutyType, curr: DutyType, next?: DutyType) => {
    if ((prev === 'N' && (curr === 'D' || curr === 'E')) ||
        (prev === 'E' && curr === 'D')) {
      return true;
    }
    if (curr === 'N' && next && (next === 'D' || next === 'E')) return true;
    if (curr === 'E' && next && next === 'D') return true;
    return false;
  };

  // 연속 근무 5일 이상 금지 검사
  const isOverFiveConsecutiveWorkDays = (duties: DutyType[], day: number, newDuty: DutyType) => {
    let count = 0;
    for (let i = day - 4; i <= day; i++) {
      if (i < 0) continue;
      const duty = i === day ? newDuty : duties[i];
      if (duty !== 'OFF' && duty !== '') count++;
      else count = 0;
      if (count >= 5) return true;
    }
    return false;
  };

  // 나이트(N) 연속 3일 이상 금지 검사
  const isOverThreeConsecutiveNight = (duties: DutyType[], day: number, newDuty: DutyType) => {
    let count = 0;
    for (let i = day - 2; i <= day; i++) {
      if (i < 0) continue;
      const duty = i === day ? newDuty : duties[i];
      if (duty === 'N') count++;
      else count = 0;
      if (count >= 3) return true;
    }
    return false;
  };

  // 카테고리별로 그룹화 및 정렬 (이름순)
  const groupedRows: Record<NurseRole, typeof rows> = {
    '인차지': [],
    '중환': [],
    '엑팅': [],
  };
  rows.forEach(row => {
    groupedRows[row.role]?.push(row);
  });
  (Object.keys(groupedRows) as NurseRole[]).forEach(role => {
    groupedRows[role].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  });

  // 근무표가 없을 때 안내
  if (!rows.length) return <div style={{ padding: 24, textAlign: 'center', color: '#888' }}>근무표를 생성할 간호사가 없습니다.</div>;

  // 역할 필터링 적용
  const filteredRoles: NurseRole[] =
    roleFilter === '전체' ? (['인차지', '중환', '엑팅'] as NurseRole[]) : [roleFilter];

  // 자동 배정 함수 (간단 예시: 각 간호사에게 순서대로 D, E, N, OFF 반복)
  const handleAutoAssign = () => {
    const dutyCycle: DutyType[] = ['D', 'E', 'N', 'OFF'];
    const updatedRows = rows.map((row, rowIdx) => {
      const duties = days.map((_, dayIdx) => {
        // OFF는 공휴일에만, 그 외는 순환
        if (holidays.includes(dayIdx + 1)) return 'OFF';
        return dutyCycle[(rowIdx + dayIdx) % dutyCycle.length];
      });
      return { ...row, duties };
    });
    // 실제 setDuty를 반복 호출하여 반영
    updatedRows.forEach((row, rowIdx) => {
      row.duties.forEach((duty, dayIdx) => {
        setDuty(rowIdx, dayIdx, duty as DutyType);
      });
    });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          onClick={() => router.push('/settings/nurse')}
          style={{
            padding: '8px 14px',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          근무자 설정
        </button>
        <button
          onClick={() => router.push('/settings/holiday')}
          style={{
            padding: '8px 14px',
            background: '#388e3c',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          수당일 설정
        </button>
        <button
          onClick={() => router.push('/settings/vacation')}
          style={{
            padding: '8px 14px',
            background: '#ffa000',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          휴가/사전 근무
        </button>
        <button
          onClick={handleAutoAssign}
          style={{
            padding: '8px 14px',
            background: '#0097a7',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: 15,
            cursor: 'pointer',
          }}
        >
          자동 배정
        </button>
      </div>
      {/* 역할 필터 */}
      <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontWeight: 600, color: '#1976d2' }}>역할별 보기:</span>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value as NurseRole | '전체')}
          style={{
            padding: '4px 12px',
            borderRadius: 4,
            border: '1px solid #bbb',
            fontWeight: 600,
            fontSize: 15,
            color: '#1976d2',
            background: '#f5faff',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="전체">전체</option>
          <option value="인차지">인차지</option>
          <option value="중환">중환</option>
          <option value="엑팅">엑팅</option>
        </select>
      </div>
      <h3 style={{ marginBottom: 16, color: '#1976d2', fontWeight: 700, fontSize: 22 }}>
        {year}년 {month}월 근무표
      </h3>
      <div style={{ marginBottom: 12, color: '#d32f2f', fontWeight: 500, fontSize: 15 }}>
        ※ <span style={{ background: '#ffe0e0', padding: '2px 8px', borderRadius: 4 }}>공휴일</span>은 <b>수당일</b>입니다. 공휴일에도 근무 지정이 가능합니다.
      </div>
      <div style={{ overflowX: 'auto', borderRadius: 8, boxShadow: '0 2px 8px #eee' }}>
        <table
          border={0}
          cellPadding={0}
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            background: '#fff',
            fontSize: 15,
            minWidth: 900,
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  background: '#f5f5f5',
                  color: '#222',
                  fontWeight: 600,
                  padding: '10px 8px',
                  borderBottom: '2px solid #1976d2',
                  position: 'sticky',
                  left: 0,
                  zIndex: 2,
                  textAlign: 'center',
                }}
              >
                이름
              </th>
              {days.map(day => {
                const weekDayIdx = new Date(year, month - 1, day).getDay();
                const isHoliday = holidays?.includes(day);
                return (
                  <th
                    key={day}
                    style={{
                      background: isHoliday
                        ? '#ffe0e0'
                        : (weekDayIdx === 0
                          ? '#e3f2fd'
                          : weekDayIdx === 6
                          ? '#f3e5f5'
                          : '#f5f5f5'),
                      color: isHoliday || weekDayIdx === 0 ? '#d32f2f' : weekDayIdx === 6 ? '#512da8' : '#222',
                      fontWeight: 500,
                      padding: '8px 4px',
                      borderBottom: '2px solid #1976d2',
                      textAlign: 'center',
                      minWidth: 48,
                    }}
                  >
                    {day}
                    <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
                      {weekDays[weekDayIdx]}
                      {isHoliday && weekDayIdx === 0 && (
                        <span title="공휴일+일요일" style={{ color: '#d32f2f', marginLeft: 2 }}>★</span>
                      )}
                      {isHoliday && (
                        <span title="수당일" style={{ color: '#d32f2f', marginLeft: 4, fontWeight: 700, fontSize: 13 }}>수당일</span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map(role => (
              groupedRows[role].length > 0 && (
                <React.Fragment key={role}>
                  <tr>
                    <td
                      colSpan={days.length + 1}
                      style={{
                        background: '#f0f4c3',
                        color: '#33691e',
                        fontWeight: 700,
                        textAlign: 'left',
                        padding: '8px 12px',
                        fontSize: 16,
                        borderTop: '2px solid #cddc39',
                      }}
                    >
                      {roleLabels[role]}
                    </td>
                  </tr>
                  {groupedRows[role].map((row, rowIdx) => (
                    <tr key={row.name} style={{ borderBottom: '1px solid #eee', background: rowIdx % 2 === 0 ? '#fafbfc' : '#fff' }}>
                      <td
                        style={{
                          fontWeight: 600,
                          background: '#f5f5f5',
                          position: 'sticky',
                          left: 0,
                          zIndex: 1,
                          padding: '8px 8px',
                          borderRight: '1px solid #e0e0e0',
                        }}
                      >
                        {row.name}
                      </td>
                      {days.map((day, dayIdx) => {
                        const weekDayIdx = new Date(year, month - 1, day).getDay();
                        const isHoliday = holidays?.includes(day);
                        const duty = row.duties[dayIdx] ?? '';
                        return (
                          <td
                            key={dayIdx}
                            style={{
                              background: isHoliday
                                ? '#ffe0e0'
                                : (weekDayIdx === 0
                                  ? '#e3f2fd'
                                  : weekDayIdx === 6
                                  ? '#f3e5f5'
                                  : undefined),
                              padding: 0,
                              textAlign: 'center',
                              minWidth: 48,
                              borderRight: '1px solid #f0f0f0',
                              borderBottom: '1px solid #f0f0f0',
                            }}
                          >
                            <select
                              value={duty}
                              onChange={e => {
                                const newDuty = e.target.value as DutyType;
                                const prevDuty = row.duties[dayIdx - 1] ?? '';
                                const nextDuty = row.duties[dayIdx + 1] ?? '';
                                // 제약조건 검사
                                if (
                                  (dayIdx > 0 && isReverseDuty(prevDuty, newDuty, nextDuty)) ||
                                  (dayIdx < days.length - 1 && isReverseDuty(newDuty, nextDuty))
                                ) {
                                  alert('역행 듀티(N→D/E, E→D 등)는 배정할 수 없습니다.');
                                  return;
                                }
                                if (isOverFiveConsecutiveWorkDays(row.duties, dayIdx, newDuty)) {
                                  alert('연속 근무는 5일을 초과할 수 없습니다.');
                                  return;
                                }
                                if (isOverThreeConsecutiveNight(row.duties, dayIdx, newDuty)) {
                                  alert('나이트(N) 근무는 연속 3일을 초과할 수 없습니다.');
                                  return;
                                }
                                setDuty(
                                  rows.findIndex(r => r.name === row.name),
                                  dayIdx,
                                  newDuty
                                );
                              }}
                              style={{
                                width: '100%',
                                minWidth: 48,
                                padding: '4px 0',
                                border: 'none',
                                background: 'transparent',
                                textAlign: 'center',
                                color: duty === 'OFF' ? '#aaa' : '#222',
                                fontWeight: 500,
                                outline: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              {dutyTypes.map(type => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              )
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 16, color: '#888', fontSize: 13 }}>
        <span style={{ background: '#ffe0e0', padding: '2px 8px', borderRadius: 4, marginRight: 8 }}>공휴일</span>
        <span style={{ background: '#e3f2fd', padding: '2px 8px', borderRadius: 4, marginRight: 8 }}>일요일</span>
        <span style={{ background: '#f3e5f5', padding: '2px 8px', borderRadius: 4 }}>토요일</span>
        <span style={{ marginLeft: 16, color: '#d32f2f', fontWeight: 500 }}>공휴일은 <b>수당일</b>입니다.</span>
      </div>
    </div>
  );
};

export default ScheduleTable;