import { useState } from 'react';
import { todayISO, uid } from '../lib/helpers';

export default function LoanForm({ onAdd }) {
  const [borrower, setBorrower] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interest, setInterest] = useState('');
  const [lendDate, setLendDate] = useState(todayISO());
  const [dueDate, setDueDate] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [successPulse, setSuccessPulse] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const principalNum = parseFloat(principal);
    if (!borrower.trim()) {
      setError('กรอกชื่อผู้กู้ด้วยนะเหมียว');
      return;
    }
    if (!principalNum || principalNum <= 0) {
      setError('กรอกจำนวนเงินต้นที่มากกว่า 0');
      return;
    }
    setError('');
    onAdd({
      id: uid(),
      borrower: borrower.trim(),
      principal: principalNum,
      interest: parseFloat(interest) || 0,
      lendDate,
      dueDate: dueDate || null,
      note: note.trim(),
      repaid: false,
    });
    setBorrower('');
    setPrincipal('');
    setInterest('');
    setDueDate('');
    setNote('');
    setSuccessPulse(true);
    setTimeout(() => setSuccessPulse(false), 1500);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">ชื่อผู้กู้</span>
        <input
          type="text"
          placeholder="เช่น น้องเอ"
          value={borrower}
          onChange={(e) => setBorrower(e.target.value)}
          className="field__input"
          maxLength={60}
        />
      </label>

      <label className="field">
        <span className="field__label">เงินต้น (บาท)</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          className="field__input field__input--amount"
        />
      </label>

      <label className="field">
        <span className="field__label">ดอกเบี้ย (บาท ไม่บังคับ)</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="field__input"
        />
      </label>

      <label className="field">
        <span className="field__label">วันที่ให้กู้</span>
        <input
          type="date"
          value={lendDate}
          onChange={(e) => setLendDate(e.target.value)}
          className="field__input"
        />
      </label>

      <label className="field">
        <span className="field__label">วันครบกำหนด (ไม่บังคับ)</span>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="field__input"
        />
      </label>

      <label className="field">
        <span className="field__label">รายละเอียด (ไม่บังคับ)</span>
        <input
          type="text"
          placeholder="เช่น ยืมซื้อมอเตอร์ไซค์"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="field__input"
          maxLength={80}
        />
      </label>

      {error && <p className="field__error" role="alert">{error}</p>}

      <button type="submit" className={`submit-btn ${successPulse ? 'submit-btn--pulse' : ''}`}>
        {successPulse ? 'บันทึกแล้ว เหมียว! 🐱' : 'บันทึกรายการกู้'}
      </button>
    </form>
  );
}
