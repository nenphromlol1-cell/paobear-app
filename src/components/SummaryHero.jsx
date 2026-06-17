import CatMascot from './CatMascot';
import { formatTHB, CAT_QUOTES_HAPPY, CAT_QUOTES_WORRIED } from '../lib/helpers';
import { useMemo } from 'react';

export default function SummaryHero({ income, expense }) {
  const balance = income - expense;
  const mood = balance > 0 ? 'happy' : balance < 0 ? 'worried' : 'neutral';

  const quote = useMemo(() => {
    const pool = mood === 'happy' ? CAT_QUOTES_HAPPY : mood === 'worried' ? CAT_QUOTES_WORRIED : null;
    if (!pool) return 'มาเริ่มบันทึกเงินกันเถอะ!';
    // Rotate by day-of-month so it feels fresh without being impure during render.
    const dayIndex = new Date().getDate() % pool.length;
    return pool[dayIndex];
  }, [mood]);

  return (
    <section className="hero-card">
      <div className="hero-card__text">
        <p className="hero-card__label">คงเหลือเดือนนี้</p>
        <h1 className="hero-card__amount" style={{ color: balance < 0 ? 'var(--coral-deep)' : 'var(--ink)' }}>
          ฿{formatTHB(balance)}
        </h1>
        <p className="hero-card__quote">{quote}</p>
        <div className="hero-card__stats">
          <div className="hero-stat hero-stat--income">
            <span className="hero-stat__dot" />
            <span className="hero-stat__label">รายรับ</span>
            <span className="hero-stat__value">฿{formatTHB(income)}</span>
          </div>
          <div className="hero-stat hero-stat--expense">
            <span className="hero-stat__dot" />
            <span className="hero-stat__label">รายจ่าย</span>
            <span className="hero-stat__value">฿{formatTHB(expense)}</span>
          </div>
        </div>
      </div>
      <div className="hero-card__cat">
        <CatMascot mood={mood} size={132} />
      </div>
    </section>
  );
}
