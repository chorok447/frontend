import React from 'react';
import { useRouter } from 'next/router';
import { useDutyContext } from '../../contexts/DutyContext';

const DutyDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { duties } = useDutyContext();

  const duty = duties.find(d => d.id === Number(id));

  if (!duty) {
    return <div>Duty not found.</div>;
  }

  return (
    <div>
      <h2>{duty.title}</h2>
      <p><strong>Date:</strong> {duty.date}</p>
      <p><strong>Assigned To:</strong> {duty.assignedTo}</p>
      <p><strong>Description:</strong> {duty.description}</p>
      <button onClick={() => router.push(`/duties/${duty.id}/edit`)}>Edit</button>
      <button onClick={() => router.push('/duties')}>Back to List</button>
    </div>
  );
};

export default DutyDetail;