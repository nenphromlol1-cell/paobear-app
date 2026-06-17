import { useMemo, useState } from 'react';
import LoanForm from './LoanForm';
import GoldForm from './GoldForm';
import Baht from './Baht';
import { formatTHB, formatGoldWeight, formatDateThai, loanDueStatus, PAYMENT_METHODS } from '../lib/helpers';

function LoanRow({ loan, onToggleRepaid, onDelete }) {
  const status = loan.repaid ? null : loanDueStatus(loan.dueDate);
  const totalOwed = loan.principal + (loan.interest || 0);
  const method = PAYMENT_METHODS.find((p) => p.key === (loan.paymentMethod || 'bank'));

  return (
    <li className={`loan-row ${loan.repaid ? 'loan-row--repaid' : ''}`}>
      <div className="loan-row__top">
        <div className="loan-row__who">
          <span aria-hidden="true">🤝</span>
          <span className="loan-row__name">{loan.borrower}</span>
          {loan.repaid && <span className="loan-row__badge loan-row__badge--repaid">คืนแล้ว</span>}
          {status === 'overdue' && <span className="loan-row__badge loan-row__badge--overdue">เลยกำหนด</span>}
          {status === 'soon' && <span className="loan-row__badge loan-row__badge--soon">ใกล้ครบกำหนด</span>}
        </div>
        <button className="entry-row__delete" aria-label={`ลบรายการกู้ของ ${loan.borrower}`} onClick={() => onDelete(loan.id)}>✕</button>
      </div>

      <div className="loan-row__amounts">
        <div>
          <p className="loan-row__label">เงินต้น</p>
          <p className="loan-row__value"><Baht />{formatTHB(loan.principal)}</p>
        </div>
        <div>
          <p className="loan-row__label">ดอกเบี้ย</p>
          <p className="loan-row__value"><Baht />{formatTHB(loan.interest || 0)}</p>
        </div>
        <div>
          <p className="loan-row__label">ยอดรวมที่ต้องได้คืน</p>
          <p className="loan-row__value loan-row__value--total"><Baht />{formatTHB(totalOwed)}</p>
        </div>
      </div>

      <p className="loan-row__meta">
        ให้กู้ {formatDateThai(loan.lendDate)}
        {' · '}<span aria-hidden="true">{method.icon}</span> {method.label}
        {loan.dueDate && ` · ครบกำหนด ${formatDateThai(loan.dueDate)}`}
        {loan.note && ` · ${loan.note}`}
      </p>

      <button className="loan-row__toggle" onClick={() => onToggleRepaid(loan.id, !loan.repaid)}>
        {loan.repaid ? 'ทำเครื่องหมายว่ายังไม่คืน' : `ทำเครื่องหมายว่าคืนแล้ว (เงินเข้า${method.label})`}
      </button>
    </li>
  );
}

export default function LoansAndGoldTab({
  loans, onAddLoan, onToggleRepaid, onDeleteLoan,
  goldEntries, onAddGold, onDeleteGold,
  cashBalance, bankBalance,
}) {
  const [section, setSection] = useState('loans');
  const [formOpen, setFormOpen] = useState(false);

  const loanSummary = useMemo(() => {
    const active = loans.filter((l) => !l.repaid);
    const principal = active.reduce((s, l) => s + l.principal, 0);
    const interest = active.reduce((s, l) => s + (l.interest || 0), 0);
    const overdueCount = active.filter((l) => loanDueStatus(l.dueDate) === 'overdue').length;
    const soonCount = active.filter((l) => loanDueStatus(l.dueDate) === 'soon').length;
    return { principal, interest, total: principal + interest, overdueCount, soonCount, activeCount: active.length };
  }, [loans]);

  const goldSummary = useMemo(() => {
    const totalWeight = goldEntries.reduce((s, g) => s + g.weight, 0);
    const totalCost = goldEntries.reduce((s, g) => s + g.price, 0);
    return { totalWeight, totalCost };
  }, [goldEntries]);

  const sortedLoans = useMemo(
    () => [...loans].sort((a, b) => {
      if (a.repaid !== b.repaid) return a.repaid ? 1 : -1;
      return b.lendDate.localeCompare(a.lendDate);
    }),
    [loans]
  );

  return (
    <section>
      <div className="subtab-row">
        <button
          className={`subtab-btn ${section === 'loans' ? 'is-active' : ''}`}
          onClick={() => { setSection('loans'); setFormOpen(false); }}
        >
          🤝 ปล่อยกู้
        </button>
        <button
          className={`subtab-btn ${section === 'gold' ? 'is-active' : ''}`}
          onClick={() => { setSection('gold'); setFormOpen(false); }}
        >
          🪙 ออมทอง
        </button>
      </div>

      {section === 'loans' && (
        <>
          {(loanSummary.overdueCount > 0 || loanSummary.soonCount > 0) && (
            <div className="reminder-banner">
              <span aria-hidden="true">⏰</span>
              <span>
                {loanSummary.overdueCount > 0 && `มี ${loanSummary.overdueCount} รายการเลยกำหนดแล้ว`}
                {loanSummary.overdueCount > 0 && loanSummary.soonCount > 0 && ' และ '}
                {loanSummary.soonCount > 0 && `${loanSummary.soonCount} รายการใกล้ครบกำหนด`}
              </span>
            </div>
          )}

          <div className="loan-summary-card">
            <div className="loan-summary-card__row">
              <span>เงินต้นที่ปล่อยกู้อยู่</span>
              <strong><Baht />{formatTHB(loanSummary.principal)}</strong>
            </div>
            <div className="loan-summary-card__row">
              <span>ดอกเบี้ยที่ต้องได้</span>
              <strong><Baht />{formatTHB(loanSummary.interest)}</strong>
            </div>
            <div className="loan-summary-card__row loan-summary-card__row--total">
              <span>ยอดรวมที่ต้องได้คืน ({loanSummary.activeCount} รายการ)</span>
              <strong><Baht />{formatTHB(loanSummary.total)}</strong>
            </div>
          </div>

          <button className="add-toggle-btn" onClick={() => setFormOpen((v) => !v)}>
            {formOpen ? 'ปิดฟอร์ม' : '+ เพิ่มรายการปล่อยกู้'}
          </button>

          {formOpen && (
            <LoanForm
              onAdd={(loan) => { onAddLoan(loan); setFormOpen(false); }}
              cashBalance={cashBalance}
              bankBalance={bankBalance}
            />
          )}

          {sortedLoans.length === 0 ? (
            <p className="chart-block__empty">ยังไม่มีรายการปล่อยกู้</p>
          ) : (
            <ul className="loan-list">
              {sortedLoans.map((loan) => (
                <LoanRow key={loan.id} loan={loan} onToggleRepaid={onToggleRepaid} onDelete={onDeleteLoan} />
              ))}
            </ul>
          )}
        </>
      )}

      {section === 'gold' && (
        <>
          <div className="loan-summary-card">
            <div className="loan-summary-card__row">
              <span>ทองสะสมทั้งหมด</span>
              <strong>{formatGoldWeight(goldSummary.totalWeight)} บาททอง</strong>
            </div>
            <div className="loan-summary-card__row loan-summary-card__row--total">
              <span>ต้นทุนรวมที่ซื้อมา</span>
              <strong><Baht />{formatTHB(goldSummary.totalCost)}</strong>
            </div>
          </div>

          <button className="add-toggle-btn" onClick={() => setFormOpen((v) => !v)}>
            {formOpen ? 'ปิดฟอร์ม' : '+ เพิ่มรายการออมทอง'}
          </button>

          {formOpen && (
            <GoldForm
              onAdd={(entry) => { onAddGold(entry); setFormOpen(false); }}
              cashBalance={cashBalance}
              bankBalance={bankBalance}
            />
          )}

          {goldEntries.length === 0 ? (
            <p className="chart-block__empty">ยังไม่มีรายการออมทอง</p>
          ) : (
            <ul className="entry-list">
              {goldEntries.map((g) => {
                const method = PAYMENT_METHODS.find((p) => p.key === (g.paymentMethod || 'bank'));
                return (
                  <li key={g.id} className="entry-row">
                    <span className="entry-row__icon entry-row__icon--mango" aria-hidden="true">🪙</span>
                    <div className="entry-row__info">
                      <p className="entry-row__title">
                        {formatGoldWeight(g.weight)} บาททอง{g.note ? ` · ${g.note}` : ''}
                      </p>
                      <p className="entry-row__date">
                        {formatDateThai(g.date)}
                        <span className="entry-row__method" aria-label={method.label}>
                          <span aria-hidden="true">{method.icon}</span>
                        </span>
                      </p>
                    </div>
                    <span className="entry-row__amount entry-row__amount--expense">
                      <Baht />{formatTHB(g.price)}
                    </span>
                    <button className="entry-row__delete" aria-label="ลบรายการทอง" onClick={() => onDeleteGold(g.id)}>✕</button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
