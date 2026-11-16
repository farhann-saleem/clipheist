import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

// In-page links (#about, #how, ...) scroll smoothly.
// "Join the waitlist" links (.js-to-waitlist) open Google sign-in straight away: signing in IS joining.
// Already signed in, they go to the pricing page instead.
export default function useSmoothAnchors() {
  const auth = useAuth();
  const navigate = useNavigate();
  const ref = useRef({ auth, navigate });
  ref.current = { auth, navigate };

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const { auth: au, navigate: nav } = ref.current;
      if (a.classList.contains('js-to-waitlist')) {
        e.preventDefault();
        if (au?.user) nav('/pricing?step=plan');
        else au?.signIn();
        return;
      }
      const id = a.getAttribute('href') || '';
      if (!id.startsWith('#')) return;
      if (id.length < 2) { e.preventDefault(); return; }
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
}

// Same behaviour as a component that renders nothing, so pages using it don't re-render when the login changes.
export function SmoothAnchors() {
  useSmoothAnchors();
  return null;
}
