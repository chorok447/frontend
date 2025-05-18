import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Duty = {
  id: number;
  title: string;
  date: string;
  assignedTo: string;
  description?: string;
};

type DutyContextType = {
  duties: Duty[];
  addDuty: (duty: Omit<Duty, 'id'>) => void;
  updateDuty: (id: number, duty: Omit<Duty, 'id'>) => void;
  deleteDuty: (id: number) => void;
};



const DutyContext = createContext<DutyContextType | undefined>(undefined);

const initialDuties: Duty[] = [
  { id: 1, title: 'Night Shift', date: '2025-05-13', assignedTo: 'Alice', description: 'Overnight duty at main office.' },
  { id: 2, title: 'Morning Shift', date: '2025-05-14', assignedTo: 'Bob', description: 'Morning shift at branch office.' },
  { id: 3, title: 'Weekend Duty', date: '2025-05-17', assignedTo: 'Charlie', description: 'Weekend support duty.' },
];

export const DutyProvider = ({ children }: { children: ReactNode }) => {
  const [duties, setDuties] = useState<Duty[]>(initialDuties);

  const addDuty = (duty: Omit<Duty, 'id'>) => {
    setDuties(prev => [...prev, { ...duty, id: Date.now() }]);
  };

  const updateDuty = (id: number, duty: Omit<Duty, 'id'>) => {
    setDuties(prev => prev.map(d => (d.id === id ? { ...d, ...duty } : d)));
  };

  const deleteDuty = (id: number) => {
    setDuties(prev => prev.filter(d => d.id !== id));
  };

  return (
    <DutyContext.Provider value={{ duties, addDuty, updateDuty, deleteDuty }}>
      {children}
    </DutyContext.Provider>
  );
};

export const useDutyContext = () => {
  const ctx = useContext(DutyContext);
  if (!ctx) throw new Error('useDutyContext must be used within a DutyProvider');
  return ctx;
};