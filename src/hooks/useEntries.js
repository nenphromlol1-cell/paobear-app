import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'paobear_entries_v1';

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('โหลดข้อมูลล้มเหลว', e);
    return [];
  }
}

function persist(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('บันทึกข้อมูลล้มเหลว', e);
  }
}

export function useEntries() {
  const [entries, setEntries] = useState(() => loadEntries());

  useEffect(() => {
    persist(entries);
  }, [entries]);

  const addEntry = useCallback((entry) => {
    setEntries((prev) => [entry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
  }, []);

  const deleteEntry = useCallback((id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setEntries([]);
  }, []);

  return { entries, addEntry, deleteEntry, clearAll };
}
