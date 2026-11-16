import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CountdownBoxes } from './Countdown.jsx';

function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const v = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
      setError('Enter a valid email address.');
      e.currentTarget.email.focus();
      return;
    }
    setError('');
    // TODO(backend): POST { email: v } to the waitlist endpoint here.
    setDone(v);
  };

  return (
    <div className={`form-block${done ? ' signed-up' : ''}`}>
      <form className="form" noValidate onSubmit={submit}>
        <label htmlFor="email" className="sr-only">Email address</label>
        <input className="text-field" maxLength="256" name="email" placeholder="you@example.com" type="email" id="email" autoComplete="email" required
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit" className="button form-button">
          <div className="button-text-holder"><div className="button-text">Join waitlist</div><div className="button-text">Join waitlist</div></div>
          <span className="button-icon" aria-hidden="true"><svg viewBox="0 0 14 14"><path d="M3 11L11 3M11 3H4.5M11 3v6.5" stroke="#000" strokeWidth="1.6" fill="none" strokeLinecap="round"/></svg></span>
        </button>
      </form>
      <div className="form-error" role="alert">{error}</div>
      <div className="success-message" role="status"><strong>You're on the list.</strong><p>We'll email <span className="success-email">{done || 'you'}</span> when early access opens, with your launch discount.</p></div>
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
