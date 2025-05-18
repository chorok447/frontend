import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getHolidays } from '../utils/getHolidays';

export type DutyType = '' | 'N' | 'D' | 'E' | 'OFF';

export type ScheduleRow = {
  name: string;
  duties: DutyType[];
  role: NurseRole;
};

type DutySettings = {
  D: number;
  E: number;
  N: number;
};

export type NurseRole = '인차지' | '중환' | '엑팅';

export interface Nurse {
  id: number;
  name: string;
  role: NurseRole;
}

type ScheduleContextType = {
  year: number;
  month: number;
  rows: ScheduleRow[];
  setDuty: (rowIdx: number, dayIdx: number, type: DutyType) => void;
  dutySettings: DutySettings;
  setDutySettings: React.Dispatch<React.SetStateAction<DutySettings>>;
  nurses: Nurse[];
  setNurses: React.Dispatch<React.SetStateAction<Nurse[]>>;
  holidays: number[];
  setHolidays: React.Dispatch<React.SetStateAction<number[]>>; // 추가
  generateSchedule: () => void;
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const DAYS_IN_MONTH = 30;
const defaultDutySettings: DutySettings = { D: 4, E: 4, N: 4 };

const initialNurses: Nurse[] = [
  { id: 1, name: '김철수', role: '인차지' },
  { id: 2, name: '이영희', role: '중환' },
  { id: 3, name: '박민수', role: '엑팅' },
];

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [nurses, setNurses] = useState<Nurse[]>(initialNurses);
  const [rows, setRows] = useState<ScheduleRow[]>(
    initialNurses.map(nurse => ({
      name: nurse.name,
      duties: Array(DAYS_IN_MONTH).fill(''),
      role: nurse.role,
    }))
  );
  const [dutySettings, setDutySettings] = useState<DutySettings>(defaultDutySettings);
  const [holidays, setHolidays] = useState<number[]>([]);
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // getMonth()는 0부터 시작하므로 +1

  useEffect(() => {
    getHolidays(year, month, process.env.NEXT_PUBLIC_HOLIDAY_API_KEY as string).then(setHolidays);
  }, [year, month]);

  useEffect(() => {
    setRows(prevRows =>
      nurses.map(nurse => {
        const found = prevRows.find(row => row.name === nurse.name);
        return found
          ? { ...found, role: nurse.role }
          : { name: nurse.name, duties: Array(DAYS_IN_MONTH).fill(''), role: nurse.role };
      })
    );
  }, [nurses]);

  const setDuty = (rowIdx: number, dayIdx: number, type: DutyType) => {
    setRows(prev =>
      prev.map((row, rIdx) =>
        rIdx === rowIdx
          ? { ...row, duties: row.duties.map((d, dIdx) => (dIdx === dayIdx ? type : d)) }
          : row
      )
    );
  };

  // 역행 듀티 금지 검사 함수
  function isReverseDuty(prev: DutyType, curr: DutyType, next?: DutyType) {
    if ((prev === 'N' && (curr === 'D' || curr === 'E')) ||
        (prev === 'E' && curr === 'D')) {
      return true;
    }
    if (curr === 'N' && next && (next === 'D' || next === 'E')) return true;
    if (curr === 'E' && next && next === 'D') return true;
    return false;
  }

  // 연속 근무 5일 이상 금지 검사
  function isOverFiveConsecutiveWorkDays(duties: DutyType[], day: number, newDuty: DutyType) {
    let count = 0;
    for (let i = day - 4; i <= day; i++) {
      if (i < 0) continue;
      const duty = i === day ? newDuty : duties[i];
      if (duty !== 'OFF' && duty !== '') count++;
      else count = 0;
      if (count >= 5) return true;
    }
    return false;
  }

  // 나이트(N) 연속 3일 이상 금지 검사
  function isOverThreeConsecutiveNight(duties: DutyType[], day: number, newDuty: DutyType) {
    let count = 0;
    for (let i = day - 2; i <= day; i++) {
      if (i < 0) continue;
      const duty = i === day ? newDuty : duties[i];
      if (duty === 'N') count++;
      else count = 0;
      if (count >= 3) return true;
    }
    return false;
  }

  // 자동 배정 함수 (역행 듀티, 연속근무, 연속NIGHT 금지 적용)
  const generateSchedule = () => {
    setRows(prevRows => {
      const nurseCount = prevRows.length;
      const daysInMonth = new Date(year, month, 0).getDate();
      const newRows: ScheduleRow[] = prevRows.map(row => ({
        ...row,
        duties: Array(daysInMonth).fill(''),
        role: row.role,
      }));

      for (let i = 0; i < nurseCount; i++) {
        for (let day = 0; day < daysInMonth; day++) {
          const types: DutyType[] = ['D', 'E', 'N', 'OFF'];
          let duty: DutyType;
          let tryCount = 0;
          do {
            duty = types[Math.floor(Math.random() * types.length)];
            const prevDuty = newRows[i].duties[day - 1] ?? '';
            const nextDuty = newRows[i].duties[day + 1] ?? '';
            if (
              (day > 0 && isReverseDuty(prevDuty, duty, nextDuty)) ||
              (day < daysInMonth - 1 && isReverseDuty(duty, nextDuty)) ||
              isOverFiveConsecutiveWorkDays(newRows[i].duties, day, duty) ||
              isOverThreeConsecutiveNight(newRows[i].duties, day, duty)
            ) {
              duty = '';
            }
            tryCount++;
          } while (duty === '' && tryCount < 10);
          newRows[i].duties[day] = duty || 'OFF';
        }
      }
      return newRows;
    });
  };

  return (
    <ScheduleContext.Provider
      value={{
        year,
        month,
        rows,
        setDuty,
        dutySettings,
        setDutySettings,
        nurses,
        setNurses,
        holidays,
        setHolidays, // 추가
        generateSchedule,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useScheduleContext = () => {
  const ctx = useContext(ScheduleContext);
  if (!ctx) throw new Error('useScheduleContext must be used within a ScheduleProvider');
  return ctx;
};