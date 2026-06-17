import { useMemo, useState } from 'react';
import './App.css';
import { useEntries } from './hooks/useEntries';
import { monthKey } from './lib/helpers';
import SummaryHero from './components/SummaryHero';
import TabBar from './components/TabBar';
import AddEntryForm from './components/AddEntryForm';
import EntryList from './components/EntryList';
import ChartSummary from './components/ChartSummary';
import CatMascot from './components/CatMascot';
import InstallBanner from './components/InstallBanner';

function currentMonthKey() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export default function App() {
  const { entries, addEntry, deleteEntry, clearAll } = useEntries();
  const [tab, setTab] = useState('add');
  const [confirmingReset, setConfirmingReset] = useState(false);

  const { income, expense, cashBalance, bankBalance } = useMemo(() => {
    const thisMonth = currentMonthKey();
    const monthEntries = entries.filter((e) => monthKey(e.date) === thisMonth);
    const signedAmount = (e) => (e.type === 'income' ? e.amount : -e.amount);

    // Entries saved before the payment-method field existed default to "bank"
    // so existing data keeps showing up rather than vanishing from both totals.
    const methodOf = (e) => e.paymentMethod || 'bank';

    return {
      income: monthEntries.filter((e) => e.type === 'income').reduce((s, e) => s + e.amount, 0),
      expense: monthEntries.filter((e) => e.type === 'expense').reduce((s, e) => s + e.amount, 0),
      cashBalance: entries.filter((e) => methodOf(e) === 'cash').reduce((s, e) => s + signedAmount(e), 0),
      bankBalance: entries.filter((e) => methodOf(e) === 'bank').reduce((s, e) => s + signedAmount(e), 0),
    };
  }, [entries]);

  function handleReset() {
    if (confirmingReset) {
      clearAll();
      setConfirmingReset(false);
    } else {
      setConfirmingReset(true);
      setTimeout(() => setConfirmingReset(false), 4000);
    }
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
        {entries.length > 0 && (
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
          {tab === 'chart' && <ChartSummary entries={entries} />}
        </div>
      </main>

      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
