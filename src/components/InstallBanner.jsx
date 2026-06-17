import { useEffect, useState } from 'react';

const DISMISS_KEY = 'paobear_install_dismissed';

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIosHint] = useState(() => isIos() && !isStandalone());
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === '1');

  useEffect(() => {
    if (isStandalone()) return;

    function handleBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  function dismiss() {
    setDismissed(true);
    sessionStorage.setItem(DISMISS_KEY, '1');
  }

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  }

  if (dismissed || isStandalone()) return null;
  if (!deferredPrompt && !showIosHint) return null;

  return (
    <div className="install-banner">
      <span className="install-banner__icon" aria-hidden="true">📲</span>
      <div className="install-banner__text">
        {deferredPrompt ? (
          <p>ติดตั้งเปาเบียร์ไว้ที่หน้าจอ เปิดได้ไวเหมือนแอปจริง</p>
        ) : (
          <p>เพิ่มเปาเบียร์ที่หน้าจอ: กดปุ่มแชร์ <span aria-hidden="true">⬆️</span> แล้วเลือก "เพิ่มไปยังหน้าจอโฮม"</p>
        )}
      </div>
      <div className="install-banner__actions">
        {deferredPrompt && (
          <button className="install-banner__install" onClick={handleInstallClick}>ติดตั้ง</button>
        )}
        <button className="install-banner__dismiss" onClick={dismiss} aria-label="ปิดข้อความนี้">✕</button>
      </div>
    </div>
  );
}
