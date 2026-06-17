export const EXPENSE_CATEGORIES = [
  { key: 'food', label: 'อาหาร', icon: '🍜', color: 'coral' },
  { key: 'transport', label: 'เดินทาง', icon: '🚌', color: 'mint' },
  { key: 'home', label: 'ที่พัก/บ้าน', icon: '🏠', color: 'grape' },
  { key: 'shopping', label: 'ช้อปปิ้ง', icon: '🛍️', color: 'coral' },
  { key: 'bills', label: 'บิล/สาธารณูปโภค', icon: '💡', color: 'mint' },
  { key: 'health', label: 'สุขภาพ', icon: '💊', color: 'grape' },
  { key: 'fun', label: 'บันเทิง', icon: '🎮', color: 'coral' },
  { key: 'education', label: 'การศึกษา', icon: '📚', color: 'mint' },
  { key: 'pet', label: 'เพื่อนสี่ขา', icon: '🐾', color: 'grape' },
  { key: 'other_expense', label: 'อื่นๆ', icon: '✨', color: 'mango' },
];

export const INCOME_CATEGORIES = [
  { key: 'salary', label: 'เงินเดือน', icon: '💼', color: 'mint' },
  { key: 'bonus', label: 'โบนัส', icon: '🎁', color: 'mango' },
  { key: 'gift', label: 'ของขวัญ', icon: '🎉', color: 'coral' },
  { key: 'invest', label: 'ลงทุน', icon: '📈', color: 'grape' },
  { key: 'freelance', label: 'ฟรีแลนซ์', icon: '🧑‍💻', color: 'mint' },
  { key: 'other_income', label: 'อื่นๆ', icon: '✨', color: 'mango' },
];

export const PAYMENT_METHODS = [
  { key: 'cash', label: 'เงินสด', icon: '💵' },
  { key: 'bank', label: 'เงินในบัญชี', icon: '💳' },
];

export function findCategory(type, key) {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return list.find((c) => c.key === key) || list[list.length - 1];
}

export function formatTHB(n) {
  const num = Number(n) || 0;
  return num.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function monthKey(dateStr) {
  return dateStr.slice(0, 7);
}

const THAI_MONTHS = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

export function monthLabel(key) {
  const [y, m] = key.split('-');
  const buddhistYear = Number(y) + 543;
  return `${THAI_MONTHS[Number(m) - 1]} ${buddhistYear}`;
}

export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function formatDateThai(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const buddhistYear = y + 543;
  return `${d} ${THAI_MONTHS[m - 1]} ${buddhistYear}`;
}

export function uid() {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const CAT_QUOTES_HAPPY = [
  'เงินเหลือ เปาเบียร์ยิ้มแก้มปริ!',
  'เก่งมาก! พุงเปาเบียร์อิ่มเอม',
  'รักษาฟอร์มนี้ไว้นะเหมียว~',
];

export const CAT_QUOTES_WORRIED = [
  'พุงเปาเบียร์แฟบ ใช้เกินงบแล้วน้า',
  'เหมียว... เดือนนี้จ่ายหนักไปนะ',
  'ลองหารายรับเพิ่ม หรือพักช้อปปิ้งดูไหม',
];
