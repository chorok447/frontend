import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDutyContext } from '../../contexts/DutyContext';

const DutyForm: React.FC = () => {
  const router = useRouter();
  const { addDuty } = useDutyContext();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDuty({ title, date, assignedTo, description });
    router.push('/duties');
  };

  return (
    <div>
      <h2>Create New Duty</h2>
      <form onSubmit={handleSubmit}>
        {/* ...input fields (생략, 기존과 동일)... */}
        <div style={{ marginBottom: 12 }}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Date:
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Assigned To:
            <input
              type="text"
              value={assignedTo}
              onChange={e => setAssignedTo(e.target.value)}
              required
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            Description:
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ marginLeft: 8, verticalAlign: 'top' }}
              rows={3}
            />
          </label>
        </div>
        <button type="submit">Register Duty</button>
      </form>
    </div>
  );
};

export default DutyForm;