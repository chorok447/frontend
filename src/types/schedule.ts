export type DutyType = 'D' | 'E' | 'N' | 'O' | 'W' | ''; // 아침, 점심, 야간, 휴무, 연차, 없음

export type NurseRole = '인차지' | '중환' | '엑팅';

export interface Nurse {
  id: number;
  name: string;
  role: NurseRole;
}

export interface DutyCell {
  date: string; // '2025-04-01'
  type: DutyType;
  fixed?: boolean; // 고정 듀티 여부
}

export interface ScheduleRow {
  nurse: Nurse;
  duties: DutyCell[];
}

export interface Schedule {
  year: number;
  month: number;
  rows: ScheduleRow[];
}