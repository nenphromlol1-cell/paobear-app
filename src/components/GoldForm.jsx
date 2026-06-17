import { useState } from 'react';
import { todayISO, uid } from '../lib/helpers';

export default function GoldForm({ onAdd }) {
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [successPulse, setSuccessPulse] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const weightNum = parseFloat(weight);
    const priceNum = parseFloat(price);
    if (!weightNum || weightNum <= 0) {
      setError('กรอกน้ำหนักทองที่มากกว่า 0 นะเหมียว');
      return;
    }
    if (!priceNum || priceNum <= 0) {
      setError('กรอกราคาที่ซื้อให้ถูกต้องด้วย');
      return;
    }
    setError('');
    onAdd({
      id: uid(),
      weight: weightNum,
      price: priceNum,
      date,
      note: note.trim(),
    });
    setWeight('');
    setPrice('');
    setNote('');
    setSuccessPulse(true);
    setTimeout(() => setSuccessPulse(false), 1500);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field__label">น้ำหนักทอง (บาททอง)</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="เช่น 1 หรือ 0.5"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="field__input field__input--amount"
        />
      </label>

      <label className="field">
        <span className="field__label">ราคาที่ซื้อ (บาท)</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="field__input"
        />
      </label>

      <label className="field">
        <span className="field__label">วันที่ซื้อ</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="field__input"
        />
      </label>

      <label className="field">
        <span className="field__label">รายละเอียด (ไม่บังคับ)</span>
        <input
          type="text"
          placeholder="เช่น ทองรูปพรรณ ร้านแม่สมศรี"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="field__input"
          maxLength={80}
        />
      </label>

      {error && <p className="field__error" role="alert">{error}</p>}

      <button type="submit" className={`submit-btn ${successPulse ? 'submit-btn--pulse' : ''}`}>
        {successPulse ? 'บันทึกแล้ว เหมียว! 🐱' : 'บันทึกการออมทอง'}
      </button>
    </form>
  );
}
