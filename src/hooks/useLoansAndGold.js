import { useCallback, useEffect, useState } from 'react';

const LOANS_KEY = 'paobear_loans_v1';
const GOLD_KEY = 'paobear_gold_v1';

function loadList(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('โหลดข้อมูลล้มเหลว', e);
    return [];
  }
}

function persist(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) {
    console.error('บันทึกข้อมูลล้มเหลว', e);
  }
}

export function useLoansAndGold() {
  const [loans, setLoans] = useState(() => loadList(LOANS_KEY));
  const [goldEntries, setGoldEntries] = useState(() => loadList(GOLD_KEY));

  useEffect(() => {
    persist(LOANS_KEY, loans);
  }, [loans]);

  useEffect(() => {
    persist(GOLD_KEY, goldEntries);
  }, [goldEntries]);

  const addLoan = useCallback((loan) => {
    setLoans((prev) => [loan, ...prev].sort((a, b) => b.lendDate.localeCompare(a.lendDate)));
  }, []);

  const updateLoan = useCallback((id, changes) => {
    setLoans((prev) => prev.map((l) => (l.id === id ? { ...l, ...changes } : l)));
  }, []);

  const deleteLoan = useCallback((id) => {
    setLoans((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const addGoldEntry = useCallback((entry) => {
    setGoldEntries((prev) => [entry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  const deleteGoldEntry = useCallback((id) => {
    setGoldEntries((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const clearLoansAndGold = useCallback(() => {
    setLoans([]);
    setGoldEntries([]);
  }, []);

  return {
    loans,
    addLoan,
    updateLoan,
    deleteLoan,
    goldEntries,
    addGoldEntry,
    deleteGoldEntry,
    clearLoansAndGold,
  };
}
