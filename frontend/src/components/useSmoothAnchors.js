import { useEffect } from 'react';

// In-page links (#about, #waitlist, ...) scroll smoothly; waitlist links also focus the email field.
// Same behaviour as the original page, done with one listener on the document.
export default function useSmoothAnchors() {
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) { e.preventDefault(); return; }
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (a.classList.contains('js-to-waitlist')) {
        setTimeout(() => {
          const f = document.getElementById('email');
          if (f && f.offsetParent) f.focus({ preventScroll: true });
        }, 900);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}
