import { useMemo } from 'react';
import CatMascot from './CatMascot';
import Baht from './Baht';
import { formatTHB, CAT_QUOTES_HAPPY, CAT_QUOTES_WORRIED } from '../lib/helpers';

export default function SummaryHero({ income, expense, cashBalance, bankBalance }) {
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
    <>
      <section className="hero-card">
        <div className="hero-card__text">
          <p className="hero-card__label">คงเหลือเดือนนี้</p>
          <h1 className="hero-card__amount" style={{ color: balance < 0 ? 'var(--coral-deep)' : 'var(--ink)' }}>
            <Baht />{formatTHB(balance)}
          </h1>
          <p className="hero-card__quote">{quote}</p>
          <div className="hero-card__stats">
            <div className="hero-stat hero-stat--income">
              <span className="hero-stat__dot" />
              <span className="hero-stat__label">รายรับ</span>
              <span className="hero-stat__value"><Baht />{formatTHB(income)}</span>
            </div>
            <div className="hero-stat hero-stat--expense">
              <span className="hero-stat__dot" />
              <span className="hero-stat__label">รายจ่าย</span>
              <span className="hero-stat__value"><Baht />{formatTHB(expense)}</span>
            </div>
          </div>
        </div>
        <div className="hero-card__cat">
          <CatMascot mood={mood} size={132} />
        </div>
      </section>

      <div className="wallet-row">
        <div className="wallet-card wallet-card--cash">
          <span className="wallet-card__icon" aria-hidden="true">💵</span>
          <div className="wallet-card__info">
            <p className="wallet-card__label">เงินสด</p>
            <p className="wallet-card__amount"><Baht />{formatTHB(cashBalance)}</p>
          </div>
        </div>
        <div className="wallet-card wallet-card--bank">
          <span className="wallet-card__icon" aria-hidden="true">💳</span>
          <div className="wallet-card__info">
            <p className="wallet-card__label">เงินในบัญชี</p>
            <p className="wallet-card__amount"><Baht />{formatTHB(bankBalance)}</p>
          </div>
        </div>
      </div>
    </>
  );
}
