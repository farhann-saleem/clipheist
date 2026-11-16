import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { DEAL_ENDS, useCountdown } from '../components/Countdown.jsx';
import useSmoothAnchors from '../components/useSmoothAnchors.js';
import '../styles/pricing.css';

const PLANS = [
  {
    name: 'Starter',
    normal: 25,
    launch: 15,
    clips: 50,
    who: 'Try it on your streams',
    features: ['50 clips', 'Captions, hook and title on every clip', 'Download and post yourself'],
  },
  {
    name: 'Pro',
    normal: 59,
    launch: 35,
    clips: 150,
    who: 'Post every day',
    features: ['150 clips', 'Everything in Starter', 'HD 1080p clips'],
  },
  {
    name: 'Premium',
    normal: 119,
    launch: 69,
    clips: 500,
    who: 'Streamers and clippers going all in',
    badge: 'Best value',
    features: ['500 clips', 'Everything in Pro', 'Auto-post to YouTube Shorts', 'Paste many links at once'],
  },
];

const FAQ = [
  ['Is this a subscription?', 'No. You pay once and get your clips. Nothing renews, nothing to cancel.'],
  ['What happens after the launch deal?', 'The launch price ends Sunday 22 November, 11:59 PM PT. After that the plans go back to their normal price.'],
  ['What counts as a clip?', 'One finished vertical clip, ready to post. We make about 6 to 10 clips from each stream, and a stream can be up to 4 hours long.'],
  ['Can I get a refund?', 'Yes. Within 48 hours, if you have used fewer than 10 clips, just ask and we refund you.'],
];

const Arrow = () => (
  <span className="button-icon" aria-hidden="true">
    <svg viewBox="0 0 14 14"><path d="M3 11L11 3M11 3H4.5M11 3v6.5" stroke="#000" strokeWidth="1.6" fill="none" strokeLinecap="round" /></svg>
  </span>
);

const Check = () => (
  <svg className="pr-check" viewBox="0 0 10 10" aria-hidden="true"><path d="M2 5.2l2 2 4-4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

function DealTimer() {
  const c = useCountdown(DEAL_ENDS);
  if (c.over) {
    return (
      <div className="pr-deal pr-deal-over">
        <div className="small-text">Launch deal ended</div>
        <p>Plans are back at their normal price.</p>
      </div>
    );
  }
  return (
    <div className="pr-deal" role="timer" aria-label="Time left on the launch price">
      <div className="pr-deal-head">
        <span className="pr-deal-pill">Launch price · 40% off</span>
        <span className="small-text">Ends Sun 22 Nov, 11:59 PM PT</span>
      </div>
      <div className="pr-deal-clock">
        {[['d', 'Days'], ['h', 'Hours'], ['m', 'Mins'], ['s', 'Secs']].map(([k, label]) => (
          <div key={k}><b>{c[k]}</b><span>{label}</span></div>
        ))}
      </div>
    </div>
  );
}

function PlanCard({ plan, dealOn }) {
  const price = dealOn ? plan.launch : plan.normal;
  return (
    <article className={`pr-card${plan.badge ? ' featured' : ''}`}>
      <div className="pr-card-top">
        <h2 className="pr-name">{plan.name}</h2>
        {plan.badge && <span className="pr-badge">{plan.badge}</span>}
      </div>
      <p className="pr-who">{plan.who}</p>
      <div className="pr-price">
        {dealOn && <s className="pr-was" aria-label={`Normal price $${plan.normal}`}>${plan.normal}</s>}
        <span className="pr-now">${price}</span>
        <span className="pr-once">one-time</span>
      </div>
      <ul className="pr-features">
        {plan.features.map((f) => <li key={f}><Check />{f}</li>)}
      </ul>
      <a href="#waitlist" className={`button js-to-waitlist pr-cta${plan.badge ? '' : ' secondary'}`}>
        <div className="button-text-holder">
          <div className="button-text">{dealOn ? 'Lock launch price' : 'Join the waitlist'}</div>
          <div className="button-text">{dealOn ? 'Lock launch price' : 'Join the waitlist'}</div>
        </div>
        <Arrow />
      </a>
    </article>
  );
}

export default function Pricing() {
  useSmoothAnchors();
  const dealOn = !useCountdown(DEAL_ENDS).over;

  return (
    <div className="pricing-page">
      <Navbar base="/" solid />

      <main id="top">
        <section className="section pr-hero">
          <div className="container">
            <DealTimer />
            <div className="pr-heading">
              <div className="paragraph-title">Pricing</div>
              <h1>Pay once. Get your clips.</h1>
              <p className="pr-lead">No subscription. Pick how many clips you want, and keep posting all launch season.</p>
            </div>

            <div className="pr-grid">
              {PLANS.map((p) => <PlanCard key={p.name} plan={p} dealOn={dealOn} />)}
            </div>

            <div className="pr-trial">
              <div>
                <div className="small-text">Free trial</div>
                <p>3 clips from one stream, with a small watermark. See your own moments before you pay.</p>
              </div>
              <a href="#waitlist" className="button secondary js-to-waitlist">
                <div className="button-text-holder"><div className="button-text">Try it free</div><div className="button-text">Try it free</div></div>
              </a>
            </div>

            <ul className="pr-all">
              <li><Check />No watermark on paid clips</li>
              <li><Check />One-time payment</li>
              <li><Check />48-hour refund</li>
              <li><Check />Works with Twitch, Kick and YouTube</li>
            </ul>
          </div>
        </section>

        <section className="section pr-faq">
          <div className="container">
            <div className="line"></div>
            <h2 className="h2-style pr-faq-title">Questions about pricing</h2>
            <div className="pr-faq-grid">
              {FAQ.map(([q, a]) => (
                <div className="testimonial-item" key={q}><div><h3>{q}</h3><p>{a}</p></div></div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer base="/" />
    </div>
  );
}
