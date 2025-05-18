import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDutyContext } from '../../../contexts/DutyContext';

const EditDuty: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { duties, updateDuty } = useDutyContext();

  const duty = duties.find(d => d.id === Number(id));

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (duty) {
      setTitle(duty.title);
      setDate(duty.date);
      setAssignedTo(duty.assignedTo);
      setDescription(duty.description || '');
    }
  }, [duty]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    updateDuty(Number(id), { title, date, assignedTo, description });
    router.push(`/duties/${id}`);
  };

  if (!duty) return <div>Duty not found.</div>;

  return (
    <div>
      <h2>Edit Duty</h2>
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
        <button type="submit">Update Duty</button>
      </form>
    </div>
  );
};

export default EditDuty;