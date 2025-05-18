import React from 'react';
import Link from 'next/link';
import { useDutyContext } from '../../contexts/DutyContext';

const DutyList: React.FC = () => {
  const { duties, deleteDuty } = useDutyContext();

  return (
    <div>
      <h2>Duty List</h2>
      <Link href="/duties/new">
        <button style={{ marginBottom: 16 }}>+ Add Duty</button>
      </Link>
      <ul>
        {duties.map((duty) => (
          <li key={duty.id} style={{ marginBottom: 12 }}>
            <Link href={`/duties/${duty.id}`}>
              <strong>{duty.title}</strong> ({duty.date}) - {duty.assignedTo}
            </Link>
            <button
              style={{ marginLeft: 12, color: 'red' }}
              onClick={() => {
                if (confirm('Delete this duty?')) deleteDuty(duty.id);
              }}
            >
              Delete
            </button>
            <Link href={`/duties/${duty.id}/edit`}>
              <button style={{ marginLeft: 8 }}>Edit</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DutyList;