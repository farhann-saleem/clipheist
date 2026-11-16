import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CountdownBoxes } from './Countdown.jsx';
import { useAuth, PLAN_NAMES, clipsLeft } from './AuthContext.jsx';

const GoogleG = () => (
  <svg viewBox="0 0 18 18" aria-hidden="true" className="g-logo">
    <path fill="#EA4335" d="M9 3.48c1.69 0 2.83.73 3.48 1.34l2.54-2.48C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l2.91 2.26C4.6 5.05 6.62 3.48 9 3.48z"/>
    <path fill="#4285F4" d="M17.64 9.2c0-.74-.06-1.28-.19-1.84H9v3.34h4.96c-.1.83-.64 2.08-1.84 2.92l2.84 2.2c1.7-1.57 2.68-3.88 2.68-6.62z"/>
    <path fill="#FBBC05" d="M3.88 10.78A5.54 5.54 0 0 1 3.58 9c0-.62.11-1.22.29-1.78L.96 4.96A9.008 9.008 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.92-2.26z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.84-2.2c-.76.53-1.78.9-3.12.9-2.38 0-4.4-1.57-5.12-3.74L.97 13.04C2.45 15.98 5.48 18 9 18z"/>
  </svg>
);

// Joining the waitlist = signing in with Google. The database adds the account to the waitlist and
// keeps its plan and clip credits (filled in automatically when the person buys a plan).
function WaitlistForm() {
  const auth = useAuth();
  const [error, setError] = useState('');
  const signedIn = !!auth?.user;

  const join = () => {
    setError('');
    if (!auth?.enabled) { setError('Sign-in is not available right now. Please try again soon.'); return; }
    auth.signIn();
  };

  if (signedIn) {
    const p = auth.profile;
    return (
      <div className="form-block signed-up">
        <div className="success-message" role="status">
          <strong>You're on the list.</strong>
          <p>
            Signed in as <span className="success-email">{auth.user.email}</span>.{' '}
            {p && p.plan !== 'free'
              ? <>Your <b>{PLAN_NAMES[p.plan]}</b> plan is active with <b>{clipsLeft(p)}</b> clips, ready when accounts open on 19 November.</>
              : <>We'll email you when early access opens on 19 November, with your launch discount and {clipsLeft(p) || 3} free clips.</>}
          </p>
          <button type="button" className="link-button" onClick={auth.signOut}>Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-block">
      <button type="button" className="button google-button" onClick={join} disabled={auth && !auth.ready}>
        <span className="google-icon"><GoogleG /></span>
        <div className="button-text-holder"><div className="button-text">Join with Google</div><div className="button-text">Join with Google</div></div>
      </button>
      <p className="form-hint">One click. We only get your name and email. No spam.</p>
      <div className="form-error" role="alert">{error}</div>
    </div>
  );
}

// Waitlist + links footer. `base` works like in Navbar: '' on the landing page, '/' elsewhere.
export default function Footer({ base = '' }) {
  const href = (hash) => `${base}${hash}`;
  return (
    <footer className="section" id="waitlist">
      <div className="footer-holder">
        <div className="footer-container">
          <div className="container">
            <div className="footer-wrapper">
              <div className="footer-signup-holder">
                <div className="title-small">Join the waitlist</div>
                <h2 className="split-words-light">Get in before the heist.</h2>
                <p className="lead">Early access to ClipHeist and a launch discount, before GTA 6 lands on 19 November 2026.</p>
                <WaitlistForm />
                <div className="footer-perks"><span>Early access</span><span>Launch discount</span><span>No spam</span></div>
                <CountdownBoxes className="footer-count" label="Time until GTA 6 launch" />
              </div>
              <div>
                <div className="footer-content">
                  <div className="footer-block">
                    <div className="title-small">Product</div>
                    <div className="nav-link-wrapper"><a href={href('#about')} className="footer-link">What it does</a><div className="nav-line"></div></div>
                    <div className="nav-link-wrapper"><a href={href('#clips')} className="footer-link">Clips</a><div className="nav-line"></div></div>
                    <div className="nav-link-wrapper"><a href={href('#how')} className="footer-link">How it works</a><div className="nav-line"></div></div>
                    <div className="nav-link-wrapper"><Link to="/pricing" className="footer-link">Pricing</Link><div className="nav-line"></div></div>
                    <div className="nav-link-wrapper"><a href={href('#faq')} className="footer-link">FAQ</a><div className="nav-line"></div></div>
                  </div>
                  <div className="footer-block">
                    <div className="title-small">Social</div>
                    <div className="nav-link-wrapper"><a href="#" className="footer-link">TikTok</a><div className="nav-line"></div></div>
                    <div className="nav-link-wrapper"><a href="#" className="footer-link">YouTube</a><div className="nav-line"></div></div>
                    <div className="nav-link-wrapper"><a href="#" className="footer-link">Instagram</a><div className="nav-line"></div></div>
                    <div className="nav-link-wrapper"><a href="#" className="footer-link">X</a><div className="nav-line"></div></div>
                  </div>
                  <div className="footer-block">
                    <div className="title-small">Legal</div>
                    <div className="nav-link-wrapper"><a href="#" className="footer-link">Privacy</a><div className="nav-line"></div></div>
                    <div className="nav-link-wrapper"><a href="#" className="footer-link">Terms</a><div className="nav-line"></div></div>
                    <div className="nav-link-wrapper"><a href="#" className="footer-link">Contact</a><div className="nav-line"></div></div>
                  </div>
                </div>
                <div className="social-media-holder">
                  <a href="#" className="social-media-container" aria-label="ClipHeist on Instagram"><svg viewBox="0 0 24 24"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6"/></svg></a>
                  <a href="#" className="social-media-container" aria-label="ClipHeist on X"><svg viewBox="0 0 24 24"><path d="M4 4l16 16M20 4L4 20"/></svg></a>
                  <a href="#" className="social-media-container" aria-label="Email ClipHeist"><svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg></a>
                </div>
              </div>
            </div>
            <div className="footer-wordmark" aria-hidden="true">ClipHeist</div>
            <div className="footer-divider">
              <div>© 2026 ClipHeist · clipheist.site</div>
              <div>Not affiliated with Rockstar Games or Take-Two Interactive. Grand Theft Auto and GTA are trademarks of their respective owners.</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
