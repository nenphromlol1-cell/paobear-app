import { useMemo, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { findCategory, formatTHB, monthKey, monthLabel } from '../lib/helpers';
import Baht from './Baht';

const RAMP = {
  coral: '#FF6F59',
  mint: '#2EC4B6',
  grape: '#8E6FE5',
  mango: '#FFB627',
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div className="chart-tooltip">
      <strong>{item.name}</strong>
      <span><Baht />{formatTHB(item.value)}</span>
    </div>
  );
}

export default function ChartSummary({ entries }) {
  const months = useMemo(() => {
    const set = new Set(entries.map((e) => monthKey(e.date)));
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    set.add(`${now.getFullYear()}-${pad(now.getMonth() + 1)}`);
    return Array.from(set).sort().reverse();
  }, [entries]);

  const [selectedMonth, setSelectedMonth] = useState(months[0]);
  const activeMonth = months.includes(selectedMonth) ? selectedMonth : months[0];

  const monthEntries = useMemo(
    () => entries.filter((e) => monthKey(e.date) === activeMonth),
    [entries, activeMonth]
  );

  const pieData = useMemo(() => {
    const byCategory = {};
    monthEntries
      .filter((e) => e.type === 'expense')
      .forEach((e) => {
        const cat = findCategory('expense', e.categoryKey);
        byCategory[cat.key] = byCategory[cat.key] || { name: cat.label, value: 0, color: cat.color, icon: cat.icon };
        byCategory[cat.key].value += e.amount;
      });
    return Object.values(byCategory).sort((a, b) => b.value - a.value);
  }, [monthEntries]);

  const totalExpense = pieData.reduce((s, d) => s + d.value, 0);

  const trendData = useMemo(() => {
    const now = new Date();
    const list = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const pad = (n) => String(n).padStart(2, '0');
      const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
      const income = entries.filter((e) => monthKey(e.date) === key && e.type === 'income').reduce((s, e) => s + e.amount, 0);
      const expense = entries.filter((e) => monthKey(e.date) === key && e.type === 'expense').reduce((s, e) => s + e.amount, 0);
      list.push({ key, label: monthLabel(key).split(' ')[0], income, expense });
    }
    return list;
  }, [entries]);

  return (
    <section>
      <select
        className="month-select"
        value={activeMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        aria-label="เลือกเดือนสำหรับกราฟ"
      >
        {months.map((m) => (
          <option key={m} value={m}>{monthLabel(m)}</option>
        ))}
      </select>

      <div className="chart-block">
        <h3 className="chart-block__title">รายจ่ายตามหมวดหมู่</h3>
        {pieData.length === 0 ? (
          <p className="chart-block__empty">ยังไม่มีรายจ่ายในเดือนนี้</p>
        ) : (
          <>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={RAMP[d.color]} stroke="var(--cream)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="legend-list">
              {pieData.map((d, i) => (
                <li key={i} className="legend-list__item">
                  <span className="legend-list__dot" style={{ background: RAMP[d.color] }} />
                  <span aria-hidden="true">{d.icon}</span>
                  <span className="legend-list__name">{d.name}</span>
                  <span className="legend-list__pct">{totalExpense ? Math.round((d.value / totalExpense) * 100) : 0}%</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="chart-block">
        <h3 className="chart-block__title">แนวโน้ม 6 เดือนล่าสุด</h3>
        <div className="legend-row">
          <span className="legend-row__item"><span className="legend-row__dot" style={{ background: '#2EC4B6' }} />รายรับ</span>
          <span className="legend-row__item"><span className="legend-row__dot" style={{ background: '#FF6F59' }} />รายจ่าย</span>
        </div>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={trendData} barGap={4}>
              <CartesianGrid vertical={false} stroke="var(--cream-deep)" />
              <XAxis dataKey="label" tick={{ fill: 'var(--ink-soft)', fontSize: 12, fontFamily: 'Noto Sans Thai' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--ink-soft)', fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" name="รายรับ" fill="#2EC4B6" radius={[8, 8, 0, 0]} maxBarSize={22} />
              <Bar dataKey="expense" name="รายจ่าย" fill="#FF6F59" radius={[8, 8, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
