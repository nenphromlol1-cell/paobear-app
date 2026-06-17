import { useMemo, useState } from 'react';
import './App.css';
import { useEntries } from './hooks/useEntries';
import { useLoansAndGold } from './hooks/useLoansAndGold';
import { monthKey, computeWalletAdjustments } from './lib/helpers';
import SummaryHero from './components/SummaryHero';
import TabBar from './components/TabBar';
import AddEntryForm from './components/AddEntryForm';
import EntryList from './components/EntryList';
import ChartSummary from './components/ChartSummary';
import LoansAndGoldTab from './components/LoansAndGoldTab';
import CatMascot from './components/CatMascot';
import InstallBanner from './components/InstallBanner';

function currentMonthKey() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export default function App() {
  const { entries, addEntry, deleteEntry, clearAll } = useEntries();
  const {
    loans, addLoan, updateLoan, deleteLoan,
    goldEntries, addGoldEntry, deleteGoldEntry, clearLoansAndGold,
  } = useLoansAndGold();
  const [tab, setTab] = useState('add');
  const [confirmingReset, setConfirmingReset] = useState(false);

  const { income, expense, cashBalance, bankBalance } = useMemo(() => {
    const thisMonth = currentMonthKey();
    const monthEntries = entries.filter((e) => monthKey(e.date) === thisMonth);
    const signedAmount = (e) => (e.type === 'income' ? e.amount : -e.amount);

    // Entries saved before the payment-method field existed default to "bank"
    // so existing data keeps showing up rather than vanishing from both totals.
    const methodOf = (e) => e.paymentMethod || 'bank';

    const rawCash = entries.filter((e) => methodOf(e) === 'cash').reduce((s, e) => s + signedAmount(e), 0);
    const rawBank = entries.filter((e) => methodOf(e) === 'bank').reduce((s, e) => s + signedAmount(e), 0);
    const { cashDelta, bankDelta } = computeWalletAdjustments(loans, goldEntries);

    return {
      income: monthEntries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0),
      expense: monthEntries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0),
      cashBalance: rawCash + cashDelta,
      bankBalance: rawBank + bankDelta,
    };
  }, [entries, loans, goldEntries]);

  function handleReset() {
    if (confirmingReset) {
      clearAll();
      clearLoansAndGold();
      setConfirmingReset(false);
    } else {
      setConfirmingReset(true);
      setTimeout(() => setConfirmingReset(false), 4000);
    }
  }

  function handleToggleRepaid(id, repaid) {
    updateLoan(id, { repaid });
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <CatMascot mood="happy" size={40} />
          <div>
            <h2 className="app-header__title">เปาเบียร์</h2>
            <p className="app-header__subtitle">รายรับ-รายจ่ายของเรา</p>
          </div>
        </div>
        {(entries.length > 0 || loans.length > 0 || goldEntries.length > 0) && (
          <button className="app-header__reset" onClick={handleReset}>
            {confirmingReset ? 'แน่ใจนะ? กดอีกครั้ง' : 'ล้างข้อมูล'}
          </button>
        )}
      </header>

      <InstallBanner />

      <main className="app-main">
        <SummaryHero income={income} expense={expense} cashBalance={cashBalance} bankBalance={bankBalance} />

        <div className="tab-panel">
          {tab === 'add' && <AddEntryForm onAdd={addEntry} />}
          {tab === 'list' && <EntryList entries={entries} onDelete={deleteEntry} />}
          {tab === 'loans' && (
            <LoansAndGoldTab
              loans={loans}
              onAddLoan={addLoan}
              onToggleRepaid={handleToggleRepaid}
              onDeleteLoan={deleteLoan}
              goldEntries={goldEntries}
              onAddGold={addGoldEntry}
              onDeleteGold={deleteGoldEntry}
              cashBalance={cashBalance}
              bankBalance={bankBalance}
            />
          )}
          {tab === 'chart' && (
            <ChartSummary
              entries={entries}
              cashBalance={cashBalance}
              bankBalance={bankBalance}
              loans={loans}
              goldEntries={goldEntries}
            />
          )}
        </div>
      </main>

      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
