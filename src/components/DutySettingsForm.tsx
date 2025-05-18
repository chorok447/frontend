import React from 'react';
import { useScheduleContext } from '../contexts/ScheduleContext';

const DutySettingsForm: React.FC = () => {
const { dutySettings, setDutySettings } = useScheduleContext();
  const handleChange = (duty: string, value: number) => {
    setDutySettings({ ...dutySettings, [duty]: value });
  };

  return (
    <div>
      <h3>듀티별 인원 설정</h3>
      {(['D', 'E', 'N'] as Array<keyof typeof dutySettings>).map(duty => (
        <div key={duty}>
          {duty} 인원:
          <input
            type="number"
            min={4}
            max={7}
            value={dutySettings[duty] || 4}
            onChange={e => handleChange(duty, Number(e.target.value))}
          />
        </div>
      ))}
    </div>
  );
};

export default DutySettingsForm;