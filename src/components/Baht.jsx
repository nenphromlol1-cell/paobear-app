// Renders the ฿ symbol with its own sizing so it doesn't visually fuse with
// the digits next to it (the glyph runs wide and tall in most fonts).
export default function Baht({ className = '' }) {
  return <span className={`baht-symbol ${className}`} aria-hidden="true">฿</span>;
}
