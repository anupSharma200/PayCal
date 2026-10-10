import React, { useState } from 'react';

const fmt = (n) => '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt0 = (n) => '$' + Math.round(n).toLocaleString('en-AU');

const P = [
  ['Year', 1],
  ['Month', 12],
  ['Fortnight', 26],
  ['Week', 52],
  ['Day', null],
  ['Hour', null]
];

function tax(t, yr, res) {
  if (res === 'n') return t <= 135000 ? t * 0.30 : t <= 190000 ? 40500 + (t - 135000) * 0.37 : 60850 + (t - 190000) * 0.45;
  if (res === 'w') return t <= 45000 ? t * 0.15 : t <= 135000 ? 6750 + (t - 45000) * 0.30 : t <= 190000 ? 33750 + (t - 135000) * 0.37 : 54100 + (t - 190000) * 0.45;
  const b = 26800 * (yr === '27' ? 0.15 : 0.16);
  if (t <= 18200) return 0;
  if (t <= 45000) return (t - 18200) * (yr === '27' ? 0.15 : 0.16);
  if (t <= 135000) return b + (t - 45000) * 0.30;
  if (t <= 190000) return b + 27000 + (t - 135000) * 0.37;
  return b + 47350 + (t - 190000) * 0.45;
}

function helpRep(r, yr) {
  const a = yr === '27' ? [69528, 129717, 186050, 9028] : [67000, 125000, 179285, 8700];
  if (r <= a[0]) return 0;
  if (r <= a[1]) return (r - a[0]) * 0.15;
  if (r <= a[2]) return a[3] + (r - a[1]) * 0.17;
  return r * 0.10;
}

export default function App() {
  // Input States
  const [amt, setAmt] = useState(85000);
  const [freq, setFreq] = useState('1');
  const [hrs, setHrs] = useState(38);
  const [wks, setWks] = useState(52);
  const [days, setDays] = useState(5);
  const [yr, setYr] = useState('27');
  const [res, setRes] = useState('r');
  const [ss, setSs] = useState(0);
  const [help, setHelp] = useState(false);
  const [inc, setInc] = useState(false);
  const [med, setMed] = useState(true);

  // Tab & Collapsible States
  const [per, setPer] = useState('Fortnight');
  const [open, setOpen] = useState({ pay: true, inc: false, sup: false, tax: false });
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactMsg, setContactMsg] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactHelp, setContactHelp] = useState('');

  // Reset form
  const handleReset = () => {
    setAmt(85000);
    setFreq('1');
    setHrs(38);
    setWks(52);
    setDays(5);
    setInc(false);
    setMed(true);
    setHelp(false);
    setSs(0);
    setYr('27');
    setRes('r');
    setPer('Fortnight');
  };

  // Calculations
  const a = parseFloat(amt) || 0;
  const f = freq;
  const h = parseFloat(hrs) || 38;
  const w = parseFloat(wks) || 52;
  const d = parseFloat(days) || 5;

  const annual = f === 'h' ? a * h * w : f === '52' ? a * w : f === '26' ? (a * w) / 2 : a * (+f);
  const SG = 0.12;
  const gross = inc ? annual / (1 + SG) : annual;
  const super_ = gross * SG + (parseFloat(ss) || 0);
  const salarySacrifice = parseFloat(ss) || 0;
  const taxable = Math.max(0, gross - salarySacrifice);
  const mOn = med && res === 'r';
  const hOn = help;

  const tot = (t) => tax(t, yr, res) + (mOn ? t * 0.02 : 0) + (hOn ? helpRep(t + salarySacrifice, yr) : 0);
  const incTax = tax(taxable, yr, res);
  const medLevy = mOn ? taxable * 0.02 : 0;
  const helpDebt = hOn ? helpRep(taxable + salarySacrifice, yr) : 0;
  const net = gross - salarySacrifice - incTax - medLevy - helpDebt;

  const hours = h * w;
  const daysY = d * w;
  const div = { Year: 1, Month: 12, Fortnight: (26 * w) / 52, Week: w, Day: daysY, Hour: hours };
  const D = (v) => v / (div[per] || 1);

  const pct = (x) => (gross > 0 ? `${Math.max(0, (x / gross) * 100)}%` : '0%');
  const avgRate = gross > 0 ? `${(((incTax + medLevy + helpDebt) / gross) * 100).toFixed(1)}%` : '0%';
  const marRate = `${(tot(taxable + 100) - tot(taxable)).toFixed(0)}%`;

  // Summary Accordion Groups
  const pf = super_ * 0.85;
  const r2 = (r) => Math.round(r * 1000) / 10;
  const br =
    res === 'n'
      ? [
          [0, 135000, 0.3],
          [135000, 190000, 0.37],
          [190000, 1e12, 0.45]
        ]
      : res === 'w'
      ? [
          [0, 45000, 0.15],
          [45000, 135000, 0.3],
          [135000, 190000, 0.37],
          [190000, 1e12, 0.45]
        ]
      : [
          [18200, 45000, yr === '27' ? 0.15 : 0.16],
          [45000, 135000, 0.3],
          [135000, 190000, 0.37],
          [190000, 1e12, 0.45]
        ];

  const brRows = br
    .map(([lo, hi, r]) => [
      `Income tax at ${r2(r)}%`,
      Math.max(0, Math.min(taxable, hi) - lo) * r,
      hi > 1e11 ? 'Income over ' + fmt0(lo) : fmt0(lo) + ' to ' + fmt0(hi)
    ])
    .filter((x) => x[1] > 0);

  const G = [
    [
      'pay',
      'var(--green)',
      'Take-home pay',
      net,
      [
        ['Gross salary', gross],
        ['Salary sacrifice', -salarySacrifice],
        ['Income tax', -incTax],
        ['Medicare levy', -medLevy],
        ['HELP repayment', -helpDebt],
        ['Super, after 15% tax', pf, 'Goes to your super fund, not your bank']
      ]
    ],
    [
      'inc',
      'var(--navy)',
      'Taxable income',
      taxable,
      [
        ['Base salary', gross],
        ['Less salary sacrifice', -salarySacrifice]
      ]
    ],
    [
      'sup',
      '#3E9BD6',
      'Superannuation',
      super_,
      [
        ['Super guarantee (' + Math.round(SG * 100) + '%)', gross * SG, 'Paid by your employer on top'],
        ['Salary sacrifice', salarySacrifice, 'Concessional contribution'],
        ['Contributions tax (15%)', -super_ * 0.15, 'Taken from your super fund'],
        ['Added to your balance', pf]
      ]
    ],
    [
      'tax',
      'var(--orange)',
      'Tax and levies',
      incTax + medLevy + helpDebt,
      [
        ...brRows,
        ['Medicare levy', medLevy, '2% of taxable income'],
        ['HELP repayment', helpDebt, 'Estimated compulsory repayment']
      ]
    ]
  ];

  const rowsList = [
    ['Gross pay', gross],
    ['Salary sacrifice', -salarySacrifice],
    ['Income tax', -incTax],
    ['Medicare levy', -medLevy],
    ['HELP repayment', -helpDebt]
  ].filter(([n, v], i) => i === 0 || i === 2 || v !== 0);

  const toggleGroup = (key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactMsg(`Thanks, ${contactName}. We will be in touch within one business day.`);
    setContactName('');
    setContactEmail('');
    setContactHelp('');
  };

  return (
    <>
      <header>
        <div className="wrap">
          <a className="logo" href="#">
            <i>P</i>paylane
          </a>
          <nav className={menuOpen ? 'open' : ''}>
            <a className="l" href="#calc" onClick={() => setMenuOpen(false)}>Calculator</a>
            <a className="l" href="#tools" onClick={() => setMenuOpen(false)}>Tools</a>
            <a className="l" href="#services" onClick={() => setMenuOpen(false)}>Services</a>
            <a className="l" href="#reviews" onClick={() => setMenuOpen(false)}>Reviews</a>
            <a className="l" href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <a className="l" href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
            <button className="menu" id="mb" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
              ☰
            </button>
            <a className="btn navy" href="#talk" onClick={() => setMenuOpen(false)} style={{ padding: '9px 16px', fontSize: '14px' }}>
              Talk to an expert
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero" id="calc">
          <div className="wrap">
            <h1>Know what lands in your account</h1>
            <p>Updated for 2026–27. Covers residents, working holiday makers and foreign residents, with Medicare, HELP debt and super.</p>
          </div>
        </section>

        <div className="wrap">
          <div className="grid">
            {/* Input Card */}
            <section className="card" aria-labelledby="in">
              <h2 id="in">Your pay details</h2>
              
              <label htmlFor="amt">Pay amount</label>
              <div className="field">
                <span>$</span>
                <input
                  id="amt"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={amt}
                  onChange={(e) => setAmt(e.target.value)}
                />
              </div>

              <div className="two">
                <div>
                  <label htmlFor="freq">Paid</label>
                  <div className="field">
                    <select id="freq" value={freq} onChange={(e) => setFreq(e.target.value)}>
                      <option value="1">Per year</option>
                      <option value="12">Per month</option>
                      <option value="26">Per fortnight</option>
                      <option value="52">Per week</option>
                      <option value="h">Per hour</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="hrs">Hours per week</label>
                  <div className="field">
                    <input
                      id="hrs"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      max="80"
                      value={hrs}
                      onChange={(e) => setHrs(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="two">
                <div>
                  <label htmlFor="wks">Weeks worked a year</label>
                  <div className="field">
                    <input
                      id="wks"
                      type="number"
                      min="1"
                      max="52"
                      value={wks}
                      onChange={(e) => setWks(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="days">Days per week</label>
                  <div className="field">
                    <input
                      id="days"
                      type="number"
                      min="1"
                      max="7"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="two">
                <div>
                  <label htmlFor="yr">Tax year</label>
                  <div className="field">
                    <select id="yr" value={yr} onChange={(e) => setYr(e.target.value)}>
                      <option value="27">2026–27</option>
                      <option value="26">2025–26</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="res">Residency</label>
                  <div className="field">
                    <select id="res" value={res} onChange={(e) => setRes(e.target.value)}>
                      <option value="r">Resident</option>
                      <option value="w">Working holiday</option>
                      <option value="n">Foreign resident</option>
                    </select>
                  </div>
                </div>
              </div>

              <label htmlFor="ss">Salary sacrifice to super (per year)</label>
              <div className="field">
                <span>$</span>
                <input
                  id="ss"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={ss}
                  onChange={(e) => setSs(e.target.value)}
                />
              </div>

              <div className="sw">
                <div>
                  I have a HELP / HECS debt
                  <small>Estimated compulsory repayment</small>
                </div>
                <input
                  className="tog"
                  id="help"
                  type="checkbox"
                  checked={help}
                  onChange={(e) => setHelp(e.target.checked)}
                  aria-label="HELP debt"
                />
              </div>

              <div className="sw">
                <div>
                  Amount includes super
                  <small>Package figure, super comes out of it</small>
                </div>
                <input
                  className="tog"
                  id="inc"
                  type="checkbox"
                  checked={inc}
                  onChange={(e) => setInc(e.target.checked)}
                  aria-label="Amount includes super"
                />
              </div>

              <div className="sw">
                <div>
                  Pay Medicare levy
                  <small>2% of taxable income</small>
                </div>
                <input
                  className="tog"
                  id="med"
                  type="checkbox"
                  checked={med}
                  onChange={(e) => setMed(e.target.checked)}
                  aria-label="Pay Medicare levy"
                />
              </div>

              <div className="actions">
                <button className="btn" id="go" type="button">
                  Calculate pay
                </button>
                <button className="btn navy" id="reset" type="button" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </section>

            {/* Output Card */}
            <section className="card" aria-live="polite" aria-labelledby="out">
              <h2 id="out">Your estimated pay</h2>
              
              <div className="hero-num">
                <small>Take-home pay each <span id="pl">{per.toLowerCase()}</span></small>
                <b id="big">{fmt(D(net))}</b>
                <em id="sub">{gross > 0 ? `${((net / gross) * 100).toFixed(1)}% of gross pay kept` : ''}</em>
              </div>

              <div className="bar" role="img" aria-label="Share of gross pay going to take-home, tax, Medicare">
                <div id="b1" style={{ background: 'var(--green)', width: pct(net) }}></div>
                <div id="b2" style={{ background: 'var(--navy)', width: pct(incTax) }}></div>
                <div id="b3" style={{ background: 'var(--orange)', width: pct(medLevy) }}></div>
                <div id="b4" style={{ background: '#8A94D6', width: pct(helpDebt) }}></div>
              </div>

              <div className="legend">
                <span><i style={{ background: 'var(--green)' }}></i>Take-home</span>
                <span><i style={{ background: 'var(--navy)' }}></i>Income tax</span>
                <span><i style={{ background: 'var(--orange)' }}></i>Medicare</span>
                <span><i style={{ background: '#8A94D6' }}></i>HELP</span>
              </div>

              <div className="chips">
                <div>
                  <small>Average tax rate</small>
                  <b id="avg">{avgRate}</b>
                </div>
                <div>
                  <small>Marginal rate</small>
                  <b id="mar">{marRate}</b>
                </div>
                <div>
                  <small>Yearly super</small>
                  <b id="sup">{fmt0(super_)}</b>
                </div>
              </div>

              <div className="tabs" id="tabs">
                {P.map(([n]) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={n === per}
                    onClick={() => setPer(n)}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <table className="rows">
                <tbody id="rows">
                  {rowsList.map(([n, v]) => (
                    <tr key={n}>
                      <td>{n}</td>
                      <td>{v < 0 ? '−' : ''}{fmt(Math.abs(D(v)))}</td>
                    </tr>
                  ))}
                  <tr className="net">
                    <td>Take-home pay</td>
                    <td>{fmt(D(net))}</td>
                  </tr>
                  <tr>
                    <td>Super (12%), paid on top</td>
                    <td>{fmt(D(super_))}</td>
                  </tr>
                  <tr>
                    <td>Yearly package</td>
                    <td>{fmt0(gross + super_)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="ptw">
                <table className="ptab" id="ptab">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Gross</th>
                      <th>Tax and levies</th>
                      <th>Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {P.map(([n]) => (
                      <tr key={n}>
                        <th>{n}</th>
                        <td>{fmt(gross / div[n])}</td>
                        <td>{fmt((incTax + medLevy + helpDebt) / div[n])}</td>
                        <td>{fmt(net / div[n])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="note">
                Estimate only. Excludes tax offsets, the Medicare low-income reduction and other deductions. Not tax advice.
              </p>
            </section>
          </div>

          {/* Expandable Summary Section */}
          <section id="summary" style={{ marginBottom: '56px' }}>
            <div className="sumhead">
              <div>
                <h2 className="sec">Summary</h2>
                <p style={{ color: 'var(--mute)', margin: 0 }}>Tap a group to see what is inside it.</p>
              </div>
              <span className="pill" id="sumyr">
                {(yr === '27' ? '2026–27' : '2025–26') + ', ' + ({ r: 'Resident', w: 'Working holiday', n: 'Foreign resident' })[res]}
              </span>
            </div>
            
            <div className="card sumcard">
              <div className="ptw" style={{ margin: 0 }}>
                <table className="sum" id="sum">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Weekly</th>
                      <th>Fortnightly</th>
                      <th>Monthly</th>
                      <th>Annually</th>
                    </tr>
                  </thead>
                  <tbody>
                    {G.map(([k, c, n, v, kids]) => {
                      const isOpened = !!open[k];
                      return (
                        <React.Fragment key={k}>
                          <tr className={`gh${k === 'pay' ? ' net' : ''}`}>
                            <th style={{ boxShadow: `inset 4px 0 0 ${c}` }}>
                              <button
                                type="button"
                                data-k={k}
                                aria-expanded={isOpened}
                                onClick={() => toggleGroup(k)}
                              >
                                <i style={{ background: c }}></i>
                                {n}
                              </button>
                            </th>
                            {[52, 26, 12, 1].map((divisor) => (
                              <td key={divisor}>
                                {v < 0 ? '−' : ''}{fmt(Math.abs(v) / divisor)}
                              </td>
                            ))}
                          </tr>

                          {isOpened &&
                            kids
                              .filter((x) => Math.abs(x[1]) > 0.004)
                              .map(([childLabel, childVal, childSub], idx) => (
                                <tr className="gk" key={idx}>
                                  <th>
                                    {childLabel}
                                    {childSub && <small>{childSub}</small>}
                                  </th>
                                  {[52, 26, 12, 1].map((divisor) => (
                                    <td key={divisor}>
                                      {childVal < 0 ? '−' : ''}{fmt(Math.abs(childVal) / divisor)}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Stats Bar */}
          <div className="stats">
            <div>
              <b>10,000+</b>
              <span>Australians use it each month</span>
            </div>
            <div>
              <b>2026–27</b>
              <span>Current tax rates</span>
            </div>
            <div>
              <b>695</b>
              <span>Five-star client reviews</span>
            </div>
            <div>
              <b>Free</b>
              <span>No sign-up needed</span>
            </div>
          </div>

          {/* Tools Section */}
          <section id="tools">
            <h2 className="sec">More free tools</h2>
            <p style={{ color: 'var(--mute)', margin: '0 0 20px' }}>
              Plan your pay, tax and super in one place.
            </p>
            <div className="steps">
              <a className="card on" href="#calc">
                <div className="ico">💵</div>
                <h3>Salary calculator</h3>
                <p>Take-home pay by year, month, week or hour.</p>
              </a>
              <a className="card" href="#talk">
                <div className="ico">🧾</div>
                <h3>Tax return estimator</h3>
                <p>Estimate your refund or bill before you lodge.</p>
              </a>
              <a className="card" href="#talk">
                <div className="ico">🏦</div>
                <h3>Super calculator</h3>
                <p>See what your balance could grow to by retirement.</p>
              </a>
              <a className="card" href="#talk">
                <div className="ico">🏠</div>
                <h3>Rental property tax</h3>
                <p>Work out deductions and negative gearing.</p>
              </a>
              <a className="card" href="#talk">
                <div className="ico">📈</div>
                <h3>Capital gains tax</h3>
                <p>Estimate tax on shares or property sales.</p>
              </a>
              <a className="card" href="#talk">
                <div className="ico">🏢</div>
                <h3>Business tax</h3>
                <p>Company and sole trader tax at a glance.</p>
              </a>
            </div>
          </section>

          {/* How It Works */}
          <section id="how">
            <h2 className="sec">How it works</h2>
            <p style={{ color: 'var(--mute)', margin: '0 0 20px' }}>
              Three quick steps, no sign-up.
            </p>
            <div className="steps">
              <div className="card">
                <h3>1. Enter your pay</h3>
                <p>Type a salary or hourly rate and pick how often you're paid.</p>
              </div>
              <div className="card">
                <h3>2. Adjust the details</h3>
                <p>Set your hours, weeks worked, and whether your figure includes super.</p>
              </div>
              <div className="card">
                <h3>3. Compare periods</h3>
                <p>Switch between yearly, monthly, fortnightly, weekly, daily and hourly.</p>
              </div>
            </div>
          </section>

          {/* Resident Tax Rates Table */}
          <section id="rates" style={{ marginBottom: '56px' }}>
            <h2 className="sec">Resident tax rates, 2026–27</h2>
            <p style={{ color: 'var(--mute)', margin: '0 0 16px' }}>
              The 16% rate fell to 15% on 1 July 2026.
            </p>
            <div className="card" style={{ overflowX: 'auto', padding: '8px 14px' }}>
              <table className="bt">
                <thead>
                  <tr>
                    <th>Taxable income</th>
                    <th>Tax on this income</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>$0 – $18,200</td>
                    <td>Nil</td>
                  </tr>
                  <tr>
                    <td>$18,201 – $45,000</td>
                    <td>15c for each $1 over $18,200</td>
                  </tr>
                  <tr>
                    <td>$45,001 – $135,000</td>
                    <td>$4,020 plus 30c for each $1 over $45,000</td>
                  </tr>
                  <tr>
                    <td>$135,001 – $190,000</td>
                    <td>$31,020 plus 37c for each $1 over $135,000</td>
                  </tr>
                  <tr>
                    <td>$190,001 and over</td>
                    <td>$51,370 plus 45c for each $1 over $190,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* FAQ Accordion */}
          <section id="faq">
            <h2 className="sec">Common questions</h2>
            <details>
              <summary>What tax rates does this use?</summary>
              <p>
                Resident rates for 2026–27 (see the table above). 2025–26 is also available and uses 16% in the second bracket. Working holiday makers pay 15% up to $45,000, and foreign residents pay 30% up to $135,000.
              </p>
            </details>
            <details>
              <summary>How is my HELP repayment worked out?</summary>
              <p>
                Since 2025–26 it is marginal. For 2026–27 nothing is repaid up to $69,528, then 15c per $1 to $129,717, then 17c per $1, and 10% of total income from $186,051.
              </p>
            </details>
            <details>
              <summary>Is super part of my take-home pay?</summary>
              <p>
                No. Super is paid to your fund on top of your wages (12% from 1 July 2025). We show it separately so you can see your full package.
              </p>
            </details>
            <details>
              <summary>Why does my payslip differ?</summary>
              <p>
                Payslips can include salary sacrifice, HELP repayments, tax offsets and the Medicare low-income reduction. This tool keeps things simple.
              </p>
            </details>
          </section>
        </div>

        {/* Services Band */}
        <section className="band" id="services">
          <div className="wrap">
            <h2 className="sec">Help beyond the numbers</h2>
            <p style={{ color: 'var(--mute)', margin: '0 0 20px' }}>
              Our accountants step in when your tax gets complicated.
            </p>
            <div className="steps" style={{ margin: 0 }}>
              <div className="card">
                <div className="ico">👤</div>
                <h3>Individuals</h3>
                <p>Tax returns, deductions and super, handled and lodged for you.</p>
              </div>
              <div className="card">
                <div className="ico">🏘️</div>
                <h3>Property investors</h3>
                <p>Depreciation, loan structures and capital gains planning.</p>
              </div>
              <div className="card">
                <div className="ico">💼</div>
                <h3>Businesses</h3>
                <p>Bookkeeping, BAS, payroll and year-end tax strategy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section id="reviews" style={{ paddingTop: '56px' }}>
          <div className="wrap">
            <h2 className="sec">What clients say</h2>
            <p style={{ color: 'var(--mute)', margin: '0 0 20px' }}>
              <span className="stars">★★★★★</span> 5.00 from 695 reviews
            </p>
            <div className="steps" style={{ margin: 0 }}>
              <div className="card quote">
                <p>Friendly, approachable and always quick to reply. Our return was sorted without any stress.</p>
                <small>Simranjit's client, Oct 2026</small>
              </div>
              <div className="card quote">
                <p>They found deductions on our rental that we had missed for years. Worth every dollar.</p>
                <small>Property investor, Sep 2026</small>
              </div>
              <div className="card quote">
                <p>Clear advice in plain English. I finally understand my business tax.</p>
                <small>Sole trader, Aug 2026</small>
              </div>
            </div>
          </div>
        </section>

        {/* About Band */}
        <section className="band" id="about">
          <div className="wrap about">
            <div>
              <h2 className="sec">Tax made clear</h2>
              <p style={{ color: 'var(--mute)', margin: '8px 0 0' }}>
                Paylane pairs free calculators with registered tax agents, so you can start on your own and get help when you need it.
              </p>
              <ul>
                <li>Registered tax agents</li>
                <li>Fixed, upfront pricing</li>
                <li>Replies within one business day</li>
              </ul>
            </div>
            <div className="card">
              <h3 style={{ margin: '0 0 6px' }}>Award-winning service</h3>
              <p style={{ color: 'var(--mute)', margin: 0 }}>
                Local business award winner and Australian Accounting Awards 2026 finalist.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact" style={{ paddingTop: '56px' }}>
          <div className="wrap contact">
            <div>
              <h2 className="sec">Book a call</h2>
              <p style={{ color: 'var(--mute)' }}>
                Tell us what you need and an accountant will get back to you.
              </p>
              <p style={{ fontSize: '14px' }}>
                hello@paylane.example
                <br />
                Mon–Fri, 9am–5pm AEST
              </p>
            </div>
            <form className="card" id="cf" onSubmit={handleContactSubmit}>
              <label htmlFor="cn" style={{ marginTop: 0 }}>
                Name
              </label>
              <div className="field">
                <input
                  id="cn"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="ce">Email</label>
              <div className="field">
                <input
                  id="ce"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                />
              </div>

              <label htmlFor="cm">How can we help?</label>
              <div className="field">
                <textarea
                  id="cm"
                  rows={3}
                  value={contactHelp}
                  onChange={(e) => setContactHelp(e.target.value)}
                ></textarea>
              </div>

              <div className="actions">
                <button className="btn" type="submit">
                  Book a call
                </button>
              </div>
              {contactMsg && (
                <p className="note" id="cok" role="status" style={{ color: 'var(--green)', fontWeight: 600 }}>
                  {contactMsg}
                </p>
              )}
            </form>
          </div>
        </section>

        {/* Call to Action */}
        <section className="cta" id="talk">
          <div className="wrap">
            <h2>Want to keep more of what you earn?</h2>
            <p>A registered tax agent can review your deductions, super and investments.</p>
            <a className="btn" href="#">Speak to a tax expert</a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div className="foot">
            <div>
              <a className="logo" href="#">
                <i>P</i>paylane
              </a>
              <p style={{ margin: '10px 0 0' }}>Free pay calculators and tax help for Australians.</p>
            </div>
            <div>
              <h4>Tools</h4>
              <a href="#calc">Salary</a>
              <a href="#tools">Tax return</a>
              <a href="#tools">Super</a>
            </div>
            <div>
              <h4>Company</h4>
              <a href="#about">About</a>
              <a href="#reviews">Reviews</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <h4>Services</h4>
              <a href="#services">Individuals</a>
              <a href="#services">Investors</a>
              <a href="#services">Businesses</a>
            </div>
          </div>
          © 2026 Paylane. General information only, not tax advice.
        </div>
      </footer>

      {/* WhatsApp Floating Action Button */}
      <a className="fab" href="https://wa.me/" aria-label="Chat on WhatsApp" target="_blank" rel="noreferrer">
        <svg viewBox="0 0 24 24">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.300 1.200-1.800 1.200-.5.1-1 .2-3.200-.7-2.700-1.100-4.400-3.900-4.500-4.100-.1-.2-1.100-1.400-1.100-2.700s.7-1.900.9-2.200c.2-.3.500-.3.700-.3h.5c.2 0 .4 0 .6.500l.9 2.100c.1.200.1.400 0 .5l-.4.600-.4.400c-.1.200-.3.300-.1.600.2.300.8 1.300 1.700 2.100 1.100 1 2.100 1.300 2.400 1.500.3.100.5.100.6-.1l.9-1.100c.2-.3.400-.2.700-.1l2 1c.3.100.5.200.5.300.1.200.1.800-.2 1.400z" />
        </svg>
      </a>
    </>
  );
}
