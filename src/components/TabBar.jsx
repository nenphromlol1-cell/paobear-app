const TABS = [
  { key: 'add', label: 'เพิ่ม', icon: '➕' },
  { key: 'list', label: 'รายการ', icon: '📋' },
  { key: 'loans', label: 'กู้/ทอง', icon: '🤝' },
  { key: 'chart', label: 'สรุป', icon: '📊' },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar" aria-label="เมนูหลัก">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`tabbar__btn ${active === tab.key ? 'tabbar__btn--active' : ''}`}
          onClick={() => onChange(tab.key)}
          aria-current={active === tab.key ? 'page' : undefined}
        >
          <span className="tabbar__icon" aria-hidden="true">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
