import React from 'react';

const VacationSettingsPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px #eee' }}>
      <h2 style={{ fontWeight: 700, fontSize: 24, marginBottom: 24, color: '#1976d2' }}>휴가/사전 근무 설정</h2>
      <div style={{ color: '#888', fontSize: 16, marginBottom: 16 }}>
        ※ 휴가/사전 근무 기능은 추후 구현 예정입니다.
      </div>
    </div>
  );
};

export default VacationSettingsPage;