// PaoBear — the chubby-bellied cat mascot. "เปาเบียร์" = beer belly.
// Mood reflects the user's balance: happy (positive), neutral (zero-ish), worried (negative).
export default function CatMascot({ mood = 'happy', size = 120, className = '' }) {
  const bellyColor = mood === 'worried' ? '#FFD9CF' : '#FFF1DA';

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={
        mood === 'happy'
          ? 'แมวเปาเบียร์ทำหน้ายิ้ม การเงินดี'
          : mood === 'worried'
          ? 'แมวเปาเบียร์ทำหน้าเป็นกังวล ใช้เงินเกิน'
          : 'แมวเปาเบียร์ทำหน้าปกติ'
      }
    >
      {/* tail */}
      <path
        d="M158 138 Q186 132 182 104 Q180 88 166 90 Q172 104 162 116"
        fill="#FFB627"
        stroke="#3D2C2E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ears */}
      <path d="M48 56 L62 92 L34 90 Z" fill="#FFB627" stroke="#3D2C2E" strokeWidth="3" strokeLinejoin="round" />
      <path d="M152 56 L138 92 L166 90 Z" fill="#FFB627" stroke="#3D2C2E" strokeWidth="3" strokeLinejoin="round" />
      <path d="M50 68 L58 84 L42 83 Z" fill="#FF6F59" />
      <path d="M150 68 L142 84 L158 83 Z" fill="#FF6F59" />

      {/* body / belly */}
      <ellipse cx="100" cy="128" rx="62" ry="54" fill="#FFB627" stroke="#3D2C2E" strokeWidth="3" />
      <ellipse cx="100" cy="134" rx="42" ry="38" fill={bellyColor} stroke="#3D2C2E" strokeWidth="2.5" />

      {/* head */}
      <circle cx="100" cy="82" r="46" fill="#FFB627" stroke="#3D2C2E" strokeWidth="3" />

      {/* face patch */}
      <ellipse cx="100" cy="92" rx="32" ry="26" fill="#FFF6E5" />

      {/* eyes */}
      {mood === 'worried' ? (
        <>
          <path d="M76 78 Q82 72 90 78" stroke="#3D2C2E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M110 78 Q118 72 124 78" stroke="#3D2C2E" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="83" cy="80" rx="5" ry="7" fill="#3D2C2E" />
          <ellipse cx="117" cy="80" rx="5" ry="7" fill="#3D2C2E" />
          <circle cx="85" cy="77" r="1.6" fill="#fff" />
          <circle cx="119" cy="77" r="1.6" fill="#fff" />
        </>
      )}

      {/* blush */}
      <ellipse cx="70" cy="94" rx="7" ry="4.5" fill="#FF6F59" opacity="0.55" />
      <ellipse cx="130" cy="94" rx="7" ry="4.5" fill="#FF6F59" opacity="0.55" />

      {/* nose + mouth */}
      <path d="M96 92 L104 92 L100 98 Z" fill="#FF6F59" />
      {mood === 'worried' ? (
        <path d="M88 108 Q100 100 112 108" stroke="#3D2C2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M88 100 Q94 110 100 100 Q106 110 112 100" stroke="#3D2C2E" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}

      {/* whiskers */}
      <path d="M58 94 L36 90 M58 100 L34 100" stroke="#3D2C2E" strokeWidth="2" strokeLinecap="round" />
      <path d="M142 94 L164 90 M142 100 L166 100" stroke="#3D2C2E" strokeWidth="2" strokeLinecap="round" />

      {/* belly button / coin shine when happy */}
      {mood === 'happy' && (
        <path d="M88 130 L94 124 L100 130 L106 124 L112 130" stroke="#F2960B" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />
      )}

      {/* paws */}
      <ellipse cx="64" cy="172" rx="16" ry="11" fill="#FFB627" stroke="#3D2C2E" strokeWidth="3" />
      <ellipse cx="136" cy="172" rx="16" ry="11" fill="#FFB627" stroke="#3D2C2E" strokeWidth="3" />
    </svg>
  );
}
