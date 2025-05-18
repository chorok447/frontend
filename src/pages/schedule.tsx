import React from 'react';
import { ScheduleProvider, useScheduleContext } from '../contexts/ScheduleContext';
import ScheduleTable from '../components/ScheduleTable';
import NurseAssignmentForm from '../components/NurseAssignmentForm';
import DutySettingsForm from '../components/DutySettingsForm';
import ExportExcelButton from '../components/ExportExcelButton';

// "근무표 자동 생성" 버튼을 Context와 연결
const GenerateButton: React.FC = () => {
  const { generateSchedule } = useScheduleContext();
  return <button onClick={generateSchedule}>근무표 자동 생성</button>;
};

const SchedulePage: React.FC = () => (
  <ScheduleProvider>
    <NurseAssignmentForm />
    <DutySettingsForm />
    <GenerateButton />
    <ExportExcelButton />
    <ScheduleTable />
  </ScheduleProvider>
);

export default SchedulePage;