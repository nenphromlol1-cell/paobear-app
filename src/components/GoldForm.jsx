import { useState } from 'react';
import { todayISO, uid, formatTHB, PAYMENT_METHODS } from '../lib/helpers';
import Baht from './Baht';

export default function GoldForm({ onAdd, cashBalance, bankBalance }) {
  const [weight, setWeight] = useState('');
  const [price, setPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].key);
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [successPulse, setSuccessPulse] = useState(false);

  const availableBalance = paymentMethod === 'cash' ? cashBalance : bankBalance;

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
    if (priceNum > availableBalance) {
      const methodLabel = PAYMENT_METHODS.find((p) => p.key === paymentMethod).label;
      setError(`${methodLabel}เหลือไม่พอ (เหลือ ฿${formatTHB(availableBalance)}) ลองเลือกกระเป๋าอื่นดูนะ`);
      return;
    }
    setError('');
    onAdd({
      id: uid(),
      weight: weightNum,
      price: priceNum,
      paymentMethod,
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

      <fieldset className="field" style={{ border: 'none', padding: 0 }}>
        <legend className="field__label">หักออกจาก</legend>
        <div className="payment-row" role="radiogroup" aria-label="ช่องทางการเงิน">
          {PAYMENT_METHODS.map((pm) => (
            <button
              type="button"
              key={pm.key}
              role="radio"
              aria-checked={paymentMethod === pm.key}
              className={`payment-chip ${paymentMethod === pm.key ? 'is-active' : ''}`}
              onClick={() => { setPaymentMethod(pm.key); setError(''); }}
            >
              <span aria-hidden="true">{pm.icon}</span>
              <span>{pm.label}</span>
            </button>
          ))}
        </div>
        <p className="field__hint">เหลือ <Baht />{formatTHB(availableBalance)}</p>
      </fieldset>

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
