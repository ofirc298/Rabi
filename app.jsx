const { useState, useEffect, useRef } = React;

// ====== Tweakable defaults ======
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primaryHue": 250,
  "goldHue": 75,
  "fontDisplay": "Frank Ruhl Libre",
  "fontBody": "Heebo",
  "logoFrame": "filigree",
  "heroVariant": "imagery"
} /*EDITMODE-END*/;

// ====== Iconography (simple, line-based) ======
const Icon = {
  basket: (props) =>
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 11h22l-2.5 14a2 2 0 0 1-2 1.7H9.5a2 2 0 0 1-2-1.7L5 11Z" />
      <path d="M11 11l3-6M21 11l-3-6" />
      <path d="M5 11h22" />
      <path d="M12 16v6M16 16v6M20 16v6" />
    </svg>,

  basketLg: (props) =>
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 11h24l-3 16a2 2 0 0 1-2 1.7H9a2 2 0 0 1-2-1.7L4 11Z" />
      <path d="M9 11l4-7M23 11l-4-7" />
      <circle cx="16" cy="19" r="1.5" />
    </svg>,

  basketHeart: (props) =>
  <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 11h22l-2.5 14a2 2 0 0 1-2 1.7H9.5a2 2 0 0 1-2-1.7L5 11Z" />
      <path d="M11 11l3-6M21 11l-3-6" />
      <path d="M16 23.5c-2-1.4-4-2.6-4-4.6a2 2 0 0 1 4-.7 2 2 0 0 1 4 .7c0 2-2 3.2-4 4.6Z" fill="currentColor" stroke="none" />
    </svg>,

  arrow: (props) =>
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 8H1M5 4 1 8l4 4" />
    </svg>,

  calendar: (props) =>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>,

  pin: (props) =>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>,

  clock: (props) =>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>,

  ornament: (props) =>
  <svg viewBox="0 0 24 8" fill="none" {...props}>
      <path d="M0 4h7M17 4h7" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="12" cy="4" r="1.5" stroke="currentColor" strokeWidth="0.8" fill="none" />
      <path d="M9 4l1.5-1.2M14 4l1.5-1.2M9 4l1.5 1.2M14 4l1.5 1.2" stroke="currentColor" strokeWidth="0.8" />
    </svg>,

  heart: (props) =>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20s-7-4.5-7-10a4.5 4.5 0 0 1 8.5-2A4.5 4.5 0 0 1 19 10c0 5.5-7 10-7 10Z" />
    </svg>,

  users: (props) =>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="9" r="3.2" />
      <path d="M3 19c0-3 2.7-5 6-5s6 2 6 5" />
      <circle cx="17" cy="8" r="2.6" />
      <path d="M15.5 13.2c2.6.3 4.5 2 4.5 4.8" />
    </svg>

};

const TENT_SVG =
<svg viewBox="0 0 320 110" fill="none" stroke="oklch(0.74 0.13 80)" strokeWidth="1" strokeLinecap="round">
    <path d="M20 100 L160 12 L300 100" />
    <path d="M50 100 L160 30 L270 100" opacity="0.55" />
    <path d="M160 12 V100" strokeDasharray="2 4" />
    <path d="M120 100 Q160 70 200 100" />
    <circle cx="160" cy="12" r="2.5" fill="oklch(0.82 0.16 85)" stroke="none" />
    <path d="M0 100 H320" />
  </svg>;


// ====== Nav ======
function Nav({ onDonate }) {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="#top" className="nav-brand">
          <img src="assets/logo.png" alt="אהל ישעיה" />
          <span>אהל ישעיה</span>
        </a>
        <nav className="nav-links">
          <a href="#about">מי אנחנו</a>
          <a href="#logistics">חלוקה</a>
          <a href="#volunteer">להתנדב</a>
          <a href="#contact">צור קשר</a>
        </nav>
        <button className="nav-cta" onClick={onDonate}>תרומה מהירה</button>
      </div>
    </header>);

}

// ====== Rabbi Portrait (animated) ======
function RabbiPortrait() {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {if (e.isIntersecting) setRevealed(true);});
    }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="rabbi-portrait" ref={ref} aria-label="דמותו של רבי ישעיה מקרסטיר">
      <div className={`rp-stage ${revealed ? 'is-revealed' : ''}`}>
        {/* Ornamental gold rays */}
        {/* Sun rays behind the portrait */}
        <svg className="rp-rays" viewBox="-100 -100 200 200" aria-hidden="true">
          <defs>
            <radialGradient id="rp-sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.94 0.13 85)" stopOpacity="0.55"/>
              <stop offset="35%" stopColor="oklch(0.85 0.14 82)" stopOpacity="0.28"/>
              <stop offset="70%" stopColor="oklch(0.74 0.13 80)" stopOpacity="0.06"/>
              <stop offset="100%" stopColor="oklch(0.74 0.13 80)" stopOpacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="0" cy="0" r="92" fill="url(#rp-sun-glow)"/>
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = i / 36 * 360;
            const tier = i % 3;
            const inner = tier === 0 ? 44 : 46;
            const outer = tier === 0 ? 96 : tier === 1 ? 84 : 76;
            const w = tier === 0 ? 1.6 : tier === 1 ? 0.9 : 0.5;
            return (
              <line
                key={i}
                x1="0" y1={-inner}
                x2="0" y2={-outer}
                stroke="oklch(0.78 0.14 82)"
                strokeWidth={w}
                strokeLinecap="round"
                transform={`rotate(${angle})`}
                opacity={tier === 0 ? 0.85 : tier === 1 ? 0.55 : 0.4}
              />
            );
          })}
          <circle cx="0" cy="0" r="44" fill="none" stroke="oklch(0.74 0.13 80)" strokeWidth="0.6" opacity="0.5"/>
          <circle cx="0" cy="0" r="40" fill="none" stroke="oklch(0.74 0.13 80)" strokeWidth="0.4" opacity="0.35" strokeDasharray="2 3"/>
        </svg>

        {/* Soft candlelit halo */}
        <div className="rp-halo" aria-hidden="true"></div>
        <div className="rp-halo rp-halo-2" aria-hidden="true"></div>

        {/* Drifting motes */}
        <div className="rp-motes" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) =>
          <span key={i} style={{ '--i': i, '--delay': `${i * 0.7}s` }} />
          )}
        </div>

        {/* Portrait */}
        <div className="rp-portrait">
          <img src="assets/rabi.png" alt="רבי ישעיה מקרסטיר" style={{ width: "328px" }} />
        </div>

        {/* Caption */}
        <div className="rp-caption">
          <div className="rp-script">״לְשַׂמֵּחַ לֵב נִדְכָּאִים״</div>
          <div className="rp-name">רבי ישעיה מקרסטיר</div>
          <div className="rp-years">תרל״ח – תרצ״ט · 1878–1939</div>
        </div>
      </div>
    </section>);

}

// ====== Hero ======
function Hero({ onDonate }) {
  return (
    <section className="hero" id="top">
      <div className="container hero-frame">
        <div className="hero-logo-mount">
          <span className="corner tl" /><span className="corner tr" />
          <span className="corner bl" /><span className="corner br" />
          <img src="assets/logo.png" alt="אהל ישעיה" />
        </div>
        <span className="eyebrow">עמותת חסד וסיוע</span>
        <h1 className="h-display">
          אהל ישעיה — ממשיכים את דרכו של<br />
          <span className="accent">רבי ישעיה מקרסטיר</span>
        </h1>
        <p className="subtitle">
          יחד, נוודא שאף משפחה לא תהיה רעבה. בואו להיות שותפים בשולחן הפתוח —
          בנתינה, בהתנדבות, ובהמשך מורשת של חסד ושפע.
        </p>
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
          <button className="btn btn-gold" onClick={onDonate}>
            לתרומה מהירה ומאובטחת
            <Icon.arrow className="arrow" width="14" />
          </button>
        </div>

        <RabbiPortrait />
      </div>
    </section>);

}

// ====== About ======
function About() {
  return (
    <section className="section" id="about">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
        <div className="about-grid">
          <div className="about-text">
            <span className="eyebrow start">המורשת</span>
            <h2 className="h-display">שולחן פתוח, יד נדיבה — מורשת של מאה שנה</h2>
            <p>
              רבי ישעיה מקרסטיר, מגדולי האדמו״רים בפולין שלפני מלחמת העולם השנייה, היה ידוע באירוחו הנדיב
              ובדאגתו לכל עני ויתום שהגיע לפתחו. ביתו לא ננעל מעולם, ושולחנו תמיד היה ערוך לאורחים.
            </p>
            <p>
              עמותת <strong>אהל ישעיה</strong> ממשיכה את מורשת זאת — מדי שבוע אנו אורזים ומחלקים
              סלי מזון למשפחות הזקוקות לתמיכה, ברגישות, בכבוד, ובאהבה.
            </p>

            <div className="about-quote">
              ״טוב לב ויָד פתוחה הם המוני־מטבעות של נשמה אחת.״
              <span className="attribution">— מסורת בית קרסטיר</span>
            </div>
          </div>

          <div className="tent-card">
            <div>
              <div className="label">מאז ייסוד העמותה</div>
              <div className="stat">10,000<span style={{ fontSize: 28, color: 'var(--gold)' }}>+</span></div>
              <div className="stat-sub">סלי מזון חולקו למשפחות</div>
            </div>
            {TENT_SVG}
            <div>
              <div className="label" style={{ marginBottom: 6 }}>השבוע</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1 }}>100+</div>
                  <div className="stat-sub">משפחות קבועות</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1 }}>164</div>
                  <div className="stat-sub">מתנדבים ומבשלות</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, lineHeight: 1 }}>100+</div>
                  <div className="stat-sub">אריזות שבועיות</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-banner" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: '340px', border: '1px solid var(--line)', boxShadow: 'var(--shadow-soft)' }}>
          <img src="assets/media__1784124309155.jpg" alt="הכנת מנות חמות וחלוקת מזון בעמותה" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>
    </section>);

}

// ====== Logistics ======
function Logistics() {
  return (
    <section className="section section-tight" id="logistics">
      <div className="container">
        <div className="logistics">
          <div style={{ textAlign: 'center', position: 'relative', marginBottom: 42 }}>
            <span className="eyebrow start" style={{ color: 'var(--gold)' }}>החלוקה השבועית</span>
            <h2 className="h-display" style={{ fontSize: 'clamp(28px, 3.4vw, 40px)', marginTop: 12, color: 'var(--cream)' }}>
              מַתָּן בַּסֵּתֶר — שלא לבייש
            </h2>
            <p style={{ color: 'rgba(253,250,244,0.78)', fontSize: 17, maxWidth: 640, margin: '14px auto 0', lineHeight: 1.7 }}>
              אנו מחלקים סלי מזון אך ורק לרשימת משפחות סגורה ומאומתת.
              הסלים מונחים בדיסקרטיות מלאה — בלי דפיקה בדלת, בלי שאלות, בלי עיניים סקרניות.
              ״גָּדוֹל הָעוֹשֶׂה צְדָקָה בַּסֵּתֶר״.
            </p>
          </div>
          <div className="logistics-grid" style={{ marginBottom: 32 }}>
            <div className="logistics-cell">
              <div className="key" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon.calendar width="14" height="14" /> מתי
              </div>
              <div className="val">ימי חמישי ולפי הצורך השבועי</div>
              <div className="meta" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon.clock width="14" height="14" /> לפנות שבת · לפי מסלול קבוע
              </div>
            </div>
            <div className="logistics-cell">
              <div className="key" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon.heart width="14" height="14" /> איך
              </div>
              <div className="val">בסתר, בכבוד</div>
              <div className="meta">הסל מונח בפתח הבית. אין מפגש פנים אל פנים, אין חשיפה.</div>
            </div>
            <div className="logistics-cell">
              <div className="key" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon.users width="14" height="14" /> למי
              </div>
              <div className="val">רשימה סגורה</div>
              <div className="meta">
                החלוקה למשפחות שאותרו על ידינו מראש. הפניות מתקבלות דרך רבני העיר ועובדים סוציאליים.
              </div>
            </div>
          </div>

          <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '280px', border: '1px solid rgba(180,150,80,0.3)', marginBottom: 12 }}>
            <img src="assets/media__1784124309059.jpg" alt="טעינת סלי המזון לרכבי החלוקה" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ marginTop: 32, padding: '20px 24px', borderTop: '1px solid rgba(180,150,80,0.25)', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', justifyContent: 'center', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>מכירים משפחה בצנעה?</span>
            <span style={{ color: 'rgba(253,250,244,0.85)', fontSize: 15 }}>
              פנייה חסויה לחלוטין — <a href="#contact" style={{ color: 'var(--gold)', borderBottom: '1px solid var(--gold)', paddingBottom: 1 }}>צרו קשר</a>
            </span>
          </div>
        </div>
      </div>
    </section>);

}

// ====== Volunteer ======
function VolunteerForm() {
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', source: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function update(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: null }));
  }

  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'נא למלא שם פרטי';
    if (!form.lastName.trim()) next.lastName = 'נא למלא שם משפחה';
    if (!form.phone.trim()) next.phone = 'נא למלא טלפון';
    else if (!/^[\d\s\-+()]{7,}$/.test(form.phone.trim())) next.phone = 'מספר טלפון לא תקין';
    if (!form.source.trim()) next.source = 'נא לציין איך הגעת אלינו';

    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ firstName: '', lastName: '', phone: '', source: '' });
      }, 5000);
    }
  }

  return (
    <form className="volunteer-form" onSubmit={submit} noValidate style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '20px',
      background: 'rgba(255,255,255,0.7)',
      padding: '20px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--line)',
      boxShadow: 'var(--shadow-soft)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="field">
          <label htmlFor="vf-fname" style={{ fontSize: '11px', color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>שם פרטי</label>
          <input
            id="vf-fname"
            type="text"
            value={form.firstName}
            onChange={(e) => update('firstName', e.target.value)}
            placeholder="ישראל"
            style={{ padding: '10px 12px', fontSize: '14px', borderRadius: '8px', border: '1px solid var(--line)', backgroundColor: '#fff' }}
          />
          {errors.firstName && <div className="field-error" style={{ fontSize: '11px', color: 'red', marginTop: '2px' }}>{errors.firstName}</div>}
        </div>
        <div className="field">
          <label htmlFor="vf-lname" style={{ fontSize: '11px', color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>שם משפחה</label>
          <input
            id="vf-lname"
            type="text"
            value={form.lastName}
            onChange={(e) => update('lastName', e.target.value)}
            placeholder="ישראלי"
            style={{ padding: '10px 12px', fontSize: '14px', borderRadius: '8px', border: '1px solid var(--line)', backgroundColor: '#fff' }}
          />
          {errors.lastName && <div className="field-error" style={{ fontSize: '11px', color: 'red', marginTop: '2px' }}>{errors.lastName}</div>}
        </div>
      </div>
      <div className="field">
        <label htmlFor="vf-phone" style={{ fontSize: '11px', color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>מספר טלפון</label>
        <input
          id="vf-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="050-000-0000"
          style={{ padding: '10px 12px', fontSize: '14px', borderRadius: '8px', border: '1px solid var(--line)', backgroundColor: '#fff' }}
        />
        {errors.phone && <div className="field-error" style={{ fontSize: '11px', color: 'red', marginTop: '2px' }}>{errors.phone}</div>}
      </div>
      <div className="field">
        <label htmlFor="vf-source" style={{ fontSize: '11px', color: 'var(--ink-soft)', fontFamily: 'var(--font-mono)' }}>איך הגעת אלינו?</label>
        <input
          id="vf-source"
          type="text"
          value={form.source}
          onChange={(e) => update('source', e.target.value)}
          placeholder="דרך חברים, פייסבוק, חיפוש בגוגל וכו׳"
          style={{ padding: '10px 12px', fontSize: '14px', borderRadius: '8px', border: '1px solid var(--line)', backgroundColor: '#fff' }}
        />
        {errors.source && <div className="field-error" style={{ fontSize: '11px', color: 'red', marginTop: '2px' }}>{errors.source}</div>}
      </div>
      <button type="submit" className="btn btn-royal" style={{ width: '100%', justifyContent: 'center', padding: '12px 20px', fontSize: '15px' }}>
        {submitted ? 'ההרשמה נשלחה בהצלחה!' : 'שליחת טופס הרשמה'}
        {!submitted && <Icon.arrow className="arrow" width="14" />}
      </button>
      {submitted && (
        <div style={{
          marginTop: '10px',
          padding: '12px',
          borderRadius: '8px',
          background: 'rgba(180,150,80,0.12)',
          border: '1px solid var(--gold)',
          fontSize: '13px',
          color: 'var(--royal-deep)',
          textAlign: 'center'
        }}>
          תודה על הרצון לעזור! פרטי ההתנדבות נשלחו ישירות למייל של העמותה (hello@ohel-yeshaya.org). הצוות יצור איתך קשר בהקדם 🤍
        </div>
      )}
    </form>
  );
}

function Volunteer() {
  return (
    <section className="section" id="volunteer">
      <div className="container volunteer-grid">
        <div className="volunteer-image" style={{ overflow: 'hidden', borderRadius: 'var(--radius-lg)' }}>
          <img src="assets/media__1784124309052.jpg" alt="מתנדבי עמותת אהל ישעיה באריזת מזון במטבח" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div className="volunteer-text">
          <span className="eyebrow start">משפחת המתנדבים</span>
          <h2 className="h-display">זקוקים לידיים עוזרות. הצטרפו אלינו.</h2>
          <p style={{ color: 'var(--ink-soft)', fontSize: 17 }}>
            אריזה, נהיגה, או הנחה דיסקרטית של סלים בבתי המשפחות — לכל אחד יש מקום בשולחן.
            בחרו מה שמתאים לכם, וצוות הרכזים יחזור אליכם תוך 24 שעות.
          </p>
          <ul className="volunteer-list">
            <li><span className="dot" /> אריזת סלים — ימי שני, 19:00–21:00</li>
            <li><span className="dot" /> חלוקה דיסקרטית בבתים — ימי חמישי ולפי הצורך השבועי</li>
            <li><span className="dot" /> נהיגה ולוגיסטיקה — לפי תיאום</li>
          </ul>
          <VolunteerForm />
        </div>
      </div>
    </section>
  );
}

// ====== Donate ======
const DONATE_TIERS = [
{ id: 'starter', amount: 90, label: 'סל בסיס', feeds: 'משפחה אחת · ארוחה', icon: 'basket' },
{ id: 'standard', amount: 180, label: 'סל בסיסי', feeds: 'משפחה · שבוע', icon: 'basketLg', popular: true },
{ id: 'family', amount: 360, label: 'סל משפחתי', feeds: 'משפחה גדולה · שבוע', icon: 'basketHeart' },
{ id: 'patron', amount: 720, label: 'סל מורחב', feeds: '4 משפחות · שבוע', icon: 'basket' }];


function Donate({ donateRef }) {
  const [selected, setSelected] = useState('standard');
  const [custom, setCustom] = useState('');
  const [frequency, setFrequency] = useState('once');
  const [toast, setToast] = useState(false);

  const selectedTier = DONATE_TIERS.find((t) => t.id === selected);
  const amount = custom ? Number(custom) : selectedTier ? selectedTier.amount : 0;
  const monthlyMultiplier = frequency === 'monthly' ? 12 : 1;

  function selectTier(id) {
    setSelected(id);
    setCustom('');
  }

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 2800);
  }

  function submit() {
    if (!amount || amount <= 0) return;
    showToast();
  }

  return (
    <section className="section donate" id="donate" ref={donateRef}>
      <div className="container">
        <div className="donate-head">
          <span className="eyebrow">תרומה</span>
          <h2 className="h-display">בחרו סל. תוסיפו ברכה. הוסיפו אור.</h2>
          <p>כל סכום מתורגם ישירות למזון על שולחנה של משפחה נזקקת. 100% מהתרומה מגיעה ליעדה.</p>
        </div>

        <div className="donate-card">
          <div className="donate-grid">
            {DONATE_TIERS.map((tier) => {
              const active = selected === tier.id && !custom;
              const IconCmp = Icon[tier.icon];
              return (
                <button
                  key={tier.id}
                  className={`donate-tile ${active ? 'active' : ''}`}
                  onClick={() => selectTier(tier.id)}>
                  
                  {tier.popular &&
                  <span style={{
                    position: 'absolute', top: 10, insetInlineStart: 10,
                    fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '.1em',
                    color: active ? 'var(--gold)' : 'var(--gold-deep)',
                    textTransform: 'uppercase'
                  }}>★ פופולרי</span>
                  }
                  <IconCmp className="basket-icon" style={{ color: active ? 'var(--gold)' : 'var(--royal)' }} />
                  <div className="amount">
                    {tier.amount}<span className="amount-currency">₪</span>
                  </div>
                  <div className="label">{tier.label}</div>
                  <div className="feeds">{tier.feeds}</div>
                </button>);

            })}
          </div>

          <div className="donate-custom">
            <div className="input-wrap">
              <input
                type="number"
                placeholder="או הקלידו סכום אחר"
                value={custom}
                onChange={(e) => {setCustom(e.target.value);setSelected('');}}
                min="1" />
              
              <span className="currency-mark">₪</span>
            </div>
          </div>

          <div className="donate-frequency">
            <button className={frequency === 'once' ? 'active' : ''} onClick={() => setFrequency('once')}>חד-פעמי</button>
            <button className={frequency === 'monthly' ? 'active' : ''} onClick={() => setFrequency('monthly')}>הוראת קבע חודשית</button>
          </div>

          <div className="donate-summary">
            <div>
              <div className="total">
                {frequency === 'monthly' ? 'תרומה חודשית: ' : 'סך תרומה: '}
                <span>{amount.toLocaleString('he-IL')} ₪</span>
                {frequency === 'monthly' &&
                <span style={{ fontSize: 14, color: 'var(--ink-soft)', marginInlineStart: 10 }}>
                    (≈ {(amount * monthlyMultiplier).toLocaleString('he-IL')} ₪ לשנה)
                  </span>
                }
              </div>
              <div className="receipt">קבלה לפי סעיף 46 · עיבוד מאובטח SSL</div>
            </div>
            <button className="btn btn-gold" onClick={submit}>
              לתרום {amount > 0 ? `${amount.toLocaleString('he-IL')}₪` : ''}
              <Icon.arrow className="arrow" width="14" />
            </button>
          </div>
        </div>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>
        תודה רבה — מעבר לסליקה מאובטחת...
      </div>
    </section>);

}

// ====== Footer ======
function Footer() {
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <img src="assets/logo.png" alt="אהל ישעיה" className="logo-mini" />
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--cream)', margin: '8px 0' }}>
              אהל ישעיה
            </p>
            <p>ע״ש רבי ישעיה מקרסטיר — חסד, אירוח, ויד פתוחה.</p>
          </div>

          <div>
            <h4>צור קשר</h4>
            <p><a href="tel:+972500000000">050-000-0000</a></p>
            <p><a href="mailto:hello@ohel-yeshaya.org">hello@ohel-yeshaya.org</a></p>
            <p style={{ fontSize: 12, color: 'rgba(253,250,244,0.55)' }}>לתגובות, הצעות ופרטים נוספים</p>
          </div>
          <div>
            <h4>עקבו אחרינו</h4>
            <div className="social">
              <a href="#" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V5h-3a4 4 0 0 0-4 4v2H7v4h3v6h4v-6h3l1-4h-4V9a0 0 0 0 1 0 0z" /></svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" /></svg>
              </a>
              <a href="#" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20 12a8 8 0 1 1-15.3-3.3L4 20l3.5-.7A8 8 0 0 0 20 12Zm-3.5 2.7c-.2-.1-1.2-.6-1.4-.7-.2-.1-.3-.1-.5.1l-.7.8c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.8-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.4c.1-.1.2-.3.2-.4 0-.2 0-.3-.1-.4l-.7-1.6c-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2 0 1.2.8 2.3.9 2.5.1.2 1.7 2.5 4.1 3.5.6.3 1 .4 1.4.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>© 2026 עמותת אהל ישעיה (ע״ר). כל הזכויות שמורות.</div>
          <div style={{ display: 'flex', gap: 18 }}>
            <a href="#">מדיניות פרטיות</a>
            <a href="#">תקנון</a>
            <a href="#">דו״ח שנתי</a>
          </div>
        </div>
      </div>
    </footer>);

}

// ====== Tweaks ======
function TweaksUI({ tweaks, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection title="צבעים">
        <TweakSlider label="גוון כחול ראשי" value={tweaks.primaryHue} onChange={(v) => setTweak('primaryHue', v)} min={200} max={290} step={1} />
        <TweakSlider label="גוון זהב" value={tweaks.goldHue} onChange={(v) => setTweak('goldHue', v)} min={50} max={110} step={1} />
      </TweakSection>
      <TweakSection title="טיפוגרפיה">
        <TweakSelect
          label="גופן כותרת"
          value={tweaks.fontDisplay}
          onChange={(v) => setTweak('fontDisplay', v)}
          options={[
          { value: 'Frank Ruhl Libre', label: 'Frank Ruhl Libre (קלאסי)' },
          { value: 'David Libre', label: 'David Libre' },
          { value: 'Noto Serif Hebrew', label: 'Noto Serif Hebrew' },
          { value: 'Bellefair', label: 'Bellefair' }]
          } />
        
        <TweakSelect
          label="גופן גוף"
          value={tweaks.fontBody}
          onChange={(v) => setTweak('fontBody', v)}
          options={[
          { value: 'Heebo', label: 'Heebo' },
          { value: 'Assistant', label: 'Assistant' },
          { value: 'Rubik', label: 'Rubik' },
          { value: 'Noto Sans Hebrew', label: 'Noto Sans Hebrew' }]
          } />
        
      </TweakSection>
      <TweakSection title="עיצוב">
        <TweakRadio
          label="מסגרת לוגו"
          value={tweaks.logoFrame}
          onChange={(v) => setTweak('logoFrame', v)}
          options={[
          { value: 'filigree', label: 'פיליגרן זהב' },
          { value: 'minimal', label: 'מינימלי' },
          { value: 'none', label: 'ללא' }]
          } />
        
      </TweakSection>
    </TweaksPanel>);

}

// ====== Contact Form ======
function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function update(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
    if (errors[k]) setErrors(prev => ({ ...prev, [k]: null }));
  }

  function submit(e) {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'נא למלא שם';
    if (!form.phone.trim()) next.phone = 'נא למלא טלפון';
    else if (!/^[\d\s\-+()]{7,}$/.test(form.phone.trim())) next.phone = 'מספר טלפון לא תקין';
    if (!form.message.trim()) next.message = 'נא לכתוב הודעה';
    setErrors(next);
    if (Object.keys(next).length === 0) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ name: '', phone: '', message: '' });
      }, 4000);
    }
  }

  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-intro">
            <span className="eyebrow start">צור קשר</span>
            <h2 className="h-display">נשמח לשמוע מכם</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 17, marginTop: 14 }}>
              לתגובות, הצעות, בקשות לסיוע, או כל שאלה — השאירו פרטים ונחזור אליכם בהקדם.
            </p>
            <ul className="contact-info">
              <li>
                <span className="ci-key">טלפון</span>
                <a href="tel:+972500000000" className="ci-val">050-000-0000</a>
              </li>
              <li>
                <span className="ci-key">דוא״ל</span>
                <a href="mailto:hello@ohel-yeshaya.org" className="ci-val">hello@ohel-yeshaya.org</a>
              </li>
              <li>
                <span className="ci-key">פעילות</span>
                <span className="ci-val">בפריסה ארצית וגלובלית</span>
              </li>
            </ul>
          </div>

          <form className="contact-form" onSubmit={submit} noValidate>
            <div className="field">
              <label htmlFor="cf-name">שם מלא</label>
              <input
                id="cf-name"
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="ישראל ישראלי"
                aria-invalid={!!errors.name}
              />
              {errors.name && <div className="field-error">{errors.name}</div>}
            </div>
            <div className="field">
              <label htmlFor="cf-phone">טלפון</label>
              <input
                id="cf-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="050-000-0000"
                aria-invalid={!!errors.phone}
              />
              {errors.phone && <div className="field-error">{errors.phone}</div>}
            </div>
            <div className="field">
              <label htmlFor="cf-message">הודעה</label>
              <textarea
                id="cf-message"
                rows="4"
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                placeholder="כיצד נוכל לעזור?"
                aria-invalid={!!errors.message}
              />
              {errors.message && <div className="field-error">{errors.message}</div>}
            </div>
            <button type="submit" className="btn btn-royal" style={{ width: '100%', justifyContent: 'center' }}>
              {submitted ? 'תודה! חזרנו אליכם בקרוב' : 'שליחה'}
              {!submitted && <Icon.arrow className="arrow" width="14"/>}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ====== App ======
function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const donateRef = useRef(null);

  // Apply tweaks via CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--royal', `oklch(0.34 0.04 ${tweaks.primaryHue})`);
    root.style.setProperty('--royal-deep', `oklch(0.26 0.04 ${tweaks.primaryHue})`);
    root.style.setProperty('--royal-soft', `oklch(0.44 0.04 ${tweaks.primaryHue})`);
    root.style.setProperty('--ink', `oklch(0.20 0.02 ${tweaks.primaryHue})`);
    root.style.setProperty('--ink-soft', `oklch(0.36 0.015 ${tweaks.primaryHue})`);
    root.style.setProperty('--gold', `oklch(0.65 0.09 ${tweaks.goldHue})`);
    root.style.setProperty('--gold-bright', `oklch(0.74 0.11 ${tweaks.goldHue + 3})`);
    root.style.setProperty('--gold-deep', `oklch(0.52 0.08 ${tweaks.goldHue - 5})`);
    root.style.setProperty('--font-display', `"${tweaks.fontDisplay}", Georgia, serif`);
    root.style.setProperty('--font-body', `"${tweaks.fontBody}", system-ui, sans-serif`);
  }, [tweaks]);

  // Apply logo frame variant
  useEffect(() => {
    const mount = document.querySelector('.hero-logo-mount');
    if (!mount) return;
    const corners = mount.querySelectorAll('.corner');
    corners.forEach((c) => {
      c.style.display = tweaks.logoFrame === 'none' ? 'none' : 'block';
      c.style.borderColor = tweaks.logoFrame === 'minimal' ? 'var(--ink-soft)' : 'var(--gold)';
      c.style.opacity = tweaks.logoFrame === 'minimal' ? '0.4' : '1';
    });
  }, [tweaks.logoFrame]);

  function scrollToDonate() {
    const el = donateRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <>
      <Nav onDonate={scrollToDonate} />
      <Hero onDonate={scrollToDonate} />
      <About />
      <Logistics />
      <Volunteer />
      <Donate donateRef={donateRef} />
      <Contact />
      <Footer />
      <TweaksUI tweaks={tweaks} setTweak={setTweak} />
    </>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);