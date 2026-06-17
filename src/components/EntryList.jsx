import { useMemo, useState } from 'react';
import { findCategory, formatTHB, formatDateThai, monthKey, monthLabel, PAYMENT_METHODS } from '../lib/helpers';
import CatMascot from './CatMascot';
import Baht from './Baht';

export default function EntryList({ entries, onDelete }) {
  const months = useMemo(() => {
    const set = new Set(entries.map((e) => monthKey(e.date)));
    return Array.from(set).sort().reverse();
  }, [entries]);

  const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return entries;
    return entries.filter((e) => monthKey(e.date) === filter);
  }, [entries, filter]);

  return (
    <section>
      {months.length > 0 && (
        <select
          className="month-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="กรองตามเดือน"
        >
          <option value="all">ทุกเดือน</option>
          {months.map((m) => (
            <option key={m} value={m}>{monthLabel(m)}</option>
          ))}
        </select>
      )}

      {filtered.length === 0 ? (
        <div className="empty-state">
          <CatMascot mood="neutral" size={96} />
          <p className="empty-state__title">ยังไม่มีรายการ</p>
          <p className="empty-state__subtitle">กดแท็บ "เพิ่มรายการ" เพื่อเริ่มบันทึกกันเลย</p>
        </div>
      ) : (
        <ul className="entry-list">
          {filtered.map((entry) => {
            const cat = findCategory(entry.type, entry.categoryKey);
            const paymentMethod = PAYMENT_METHODS.find((p) => p.key === (entry.paymentMethod || 'bank'));
            return (
              <li key={entry.id} className="entry-row">
                <span className={`entry-row__icon entry-row__icon--${cat.color}`} aria-hidden="true">
                  {cat.icon}
                </span>
                <div className="entry-row__info">
                  <p className="entry-row__title">
                    {cat.label}{entry.note ? ` · ${entry.note}` : ''}
                  </p>
                  <p className="entry-row__date">
                    {formatDateThai(entry.date)}
                    <span className="entry-row__method" aria-label={paymentMethod.label}>
                      <span aria-hidden="true">{paymentMethod.icon}</span>
                    </span>
                  </p>
                </div>
                <span className={`entry-row__amount entry-row__amount--${entry.type}`}>
                  {entry.type === 'income' ? '+' : '−'}<Baht />{formatTHB(entry.amount)}
                </span>
                <button
                  className="entry-row__delete"
                  aria-label={`ลบรายการ ${cat.label}`}
                  onClick={() => onDelete(entry.id)}
                >
                  ✕
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
