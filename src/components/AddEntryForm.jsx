import { useState } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_METHODS, todayISO, uid } from '../lib/helpers';

export default function AddEntryForm({ onAdd }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [categoryKey, setCategoryKey] = useState(EXPENSE_CATEGORIES[0].key);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].key);
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayISO());
  const [error, setError] = useState('');
  const [successPulse, setSuccessPulse] = useState(false);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  function handleTypeSwitch(nextType) {
    setType(nextType);
    const list = nextType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    setCategoryKey(list[0].key);
    setError('');
  }

  function handleSubmit(e) {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setError('กรอกจำนวนเงินที่มากกว่า 0 นะเหมียว');
      return;
    }
    setError('');
    onAdd({
      id: uid(),
      type,
      amount: num,
      categoryKey,
      paymentMethod,
      note: note.trim(),
      date,
    });
    setAmount('');
    setNote('');
    setSuccessPulse(true);
    setTimeout(() => setSuccessPulse(false), 1500);
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <div className="type-switch" role="radiogroup" aria-label="ประเภทรายการ">
        <button
          type="button"
          role="radio"
          aria-checked={type === 'expense'}
          className={`type-switch__btn type-switch__btn--expense ${type === 'expense' ? 'is-active' : ''}`}
          onClick={() => handleTypeSwitch('expense')}
        >
          จ่ายออก
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={type === 'income'}
          className={`type-switch__btn type-switch__btn--income ${type === 'income' ? 'is-active' : ''}`}
          onClick={() => handleTypeSwitch('income')}
        >
          รับเข้า
        </button>
      </div>

      <label className="field">
        <span className="field__label">จำนวนเงิน (บาท)</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="field__input field__input--amount"
        />
      </label>

      <fieldset className="field" style={{ border: 'none', padding: 0 }}>
        <legend className="field__label">หมวดหมู่</legend>
        <div className="category-grid">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.key}
              className={`category-chip category-chip--${cat.color} ${categoryKey === cat.key ? 'is-active' : ''}`}
              onClick={() => setCategoryKey(cat.key)}
              aria-pressed={categoryKey === cat.key}
            >
              <span aria-hidden="true">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="field" style={{ border: 'none', padding: 0 }}>
        <legend className="field__label">จ่ายด้วย</legend>
        <div className="payment-row" role="radiogroup" aria-label="ช่องทางการเงิน">
          {PAYMENT_METHODS.map((pm) => (
            <button
              type="button"
              key={pm.key}
              role="radio"
              aria-checked={paymentMethod === pm.key}
              className={`payment-chip ${paymentMethod === pm.key ? 'is-active' : ''}`}
              onClick={() => setPaymentMethod(pm.key)}
            >
              <span aria-hidden="true">{pm.icon}</span>
              <span>{pm.label}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span className="field__label">รายละเอียด (ไม่บังคับ)</span>
        <input
          type="text"
          placeholder="เช่น ก๋วยเตี๋ยวหน้าปากซอย"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="field__input"
          maxLength={80}
        />
      </label>

      <label className="field">
        <span className="field__label">วันที่</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="field__input"
        />
      </label>

      {error && <p className="field__error" role="alert">{error}</p>}

      <button type="submit" className={`submit-btn ${successPulse ? 'submit-btn--pulse' : ''}`}>
        {successPulse ? 'บันทึกแล้ว เหมียว! 🐱' : 'บันทึกรายการ'}
      </button>
    </form>
  );
}
