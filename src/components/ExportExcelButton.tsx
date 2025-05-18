import React from 'react';
import { useScheduleContext } from '../contexts/ScheduleContext';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const ExportExcelButton: React.FC = () => {
  const { rows } = useScheduleContext();

  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('근무표');

    // 헤더 생성
    const days = Array.from({ length: rows[0]?.duties.length || 0 }, (_, i) => `${i + 1}일`);
    worksheet.addRow(['이름', ...days]);

    // 데이터 행 생성
    rows.forEach(row => {
      worksheet.addRow([row.name, ...row.duties]);
    });

    // 스타일(선택)
    worksheet.columns.forEach(col => {
      col.width = 10;
    });

    // 파일 저장
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'schedule.xlsx');
  };

  return (
    <button onClick={handleExport}>엑셀로 내보내기</button>
  );
};

export default ExportExcelButton;