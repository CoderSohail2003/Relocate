import { useState } from 'react'
import { demoApplications } from './data/demoApplications.js'
import './App.css'

const recipient = 'relocate.webapp@gmail.com'
const contactPhone = '+919702966965'
const contactPhoneDisplay = '+91 97029 66965'
const demoAdminPassword = 'relocateadmin@RELOCATE2002'
const captchaCharacters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

function createCaptcha() {
  const randomValues = crypto.getRandomValues(new Uint8Array(5))
  return Array.from(randomValues, (value) => captchaCharacters[value % captchaCharacters.length]).join('')
}

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function isMobileDevice() {
  return typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)
}

function getEmailComposeUrl(subject = '', body = '') {
  if (isMobileDevice()) {
    const params = []
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`)
    if (body) params.push(`body=${encodeURIComponent(body)}`)
    return `mailto:${recipient}${params.length ? `?${params.join('&')}` : ''}`
  }

  const url = new URL('https://mail.google.com/mail/')
  url.searchParams.set('view', 'cm')
  url.searchParams.set('fs', '1')
  url.searchParams.set('to', recipient)
  if (subject) url.searchParams.set('su', subject)
  if (body) url.searchParams.set('body', body)
  return url.toString()
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3.5 10h12m-5-5 5 5-5 5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M6.2 3.5h-2a1.2 1.2 0 0 0-1.2 1.3c.4 6.7 5.5 11.8 12.2 12.2a1.2 1.2 0 0 0 1.3-1.2v-2l-3.4-1.3-1.4 1.7a12.1 12.1 0 0 1-5.9-5.9l1.7-1.4z" />
    </svg>
  )
}

function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)

  function handleLogin(event) {
    event.preventDefault()

    if (password !== demoAdminPassword) {
      setError('That password does not match. Please try again.')
      return
    }

    setError('')
    setPassword('')
    setIsAuthenticated(true)
  }

  if (isAuthenticated) {
    return (
      <main className="admin-dashboard">
        <header className="admin-dashboard-header">
          <a className="wordmark" href="/" aria-label="Relocate. home">
            Relocate<span>.</span>
          </a>
          <button className="admin-signout" type="button" onClick={() => setIsAuthenticated(false)}>
            Sign out
          </button>
        </header>
        <section className="admin-dashboard-intro">
          <p className="eyebrow"><span /> Sample data</p>
          <h1>Student enquiries</h1>
          <p>Browse the example requests below. Select one to preview the details.</p>
        </section>
        <div className="admin-records-layout">
          <section className="admin-record-list" aria-label="Sample student enquiries">
            <p className="admin-record-count">{demoApplications.length} sample enquiries</p>
            {demoApplications.map((application) => (
              <button
                className={`admin-record${selectedApplication?.id === application.id ? ' is-selected' : ''}`}
                key={application.id}
                type="button"
                onClick={() => setSelectedApplication(application)}
                aria-pressed={selectedApplication?.id === application.id}
              >
                <span className="admin-record-main">
                  <strong>{application.name}</strong>
                  <span>{application.allottedCollege}</span>
                </span>
                <span className="admin-record-meta">
                  <span>{application.collegeLocation}</span>
                  <span>{application.id}</span>
                </span>
              </button>
            ))}
          </section>

          <section className="admin-record-preview" aria-live="polite">
            {selectedApplication ? (
              <>
                <div className="admin-preview-heading">
                  <div>
                    <span className="admin-preview-id">{selectedApplication.id}</span>
                    <h2>{selectedApplication.name}</h2>
                  </div>
                  <button
                    className="admin-preview-close"
                    type="button"
                    onClick={() => setSelectedApplication(null)}
                    aria-label="Close enquiry preview"
                  >
                    ×
                  </button>
                </div>
                <dl className="admin-detail-list">
                  <div><dt>Phone / WhatsApp</dt><dd>{selectedApplication.phone}</dd></div>
                  <div><dt>Current address</dt><dd>{selectedApplication.currentAddress}</dd></div>
                  <div><dt>Course / program</dt><dd>{selectedApplication.course}</dd></div>
                  <div><dt>College selected</dt><dd>{selectedApplication.selectedCollege}</dd></div>
                  <div><dt>College allotted</dt><dd>{selectedApplication.allottedCollege}</dd></div>
                  <div><dt>College location</dt><dd>{selectedApplication.collegeLocation}</dd></div>
                  <div><dt>Accommodation</dt><dd>{selectedApplication.accommodation}</dd></div>
                  <div><dt>Expected move-in</dt><dd>{selectedApplication.moveDate}</dd></div>
                  <div><dt>Additional details</dt><dd>{selectedApplication.notes}</dd></div>
                </dl>
              </>
            ) : (
              <p className="admin-empty-preview">Choose an enquiry to preview its details.</p>
            )}
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="admin-login-page">
      <a className="wordmark admin-wordmark" href="/" aria-label="Relocate. home">
        Relocate<span>.</span>
      </a>
      <section className="admin-login-card" aria-labelledby="admin-title">
        <p className="eyebrow"><span /> Relocate. workspace</p>
        <h1 id="admin-title">Sign in</h1>
        <p className="admin-login-description">Sign in to continue to the relocation workspace.</p>
        <form className="admin-login-form" onSubmit={handleLogin}>
          <label className="field">
            <span>Email address</span>
            <input type="email" name="email" value={recipient} readOnly />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
            />
          </label>
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <button className="button button-submit" type="submit">Sign in</button>
        </form>
      </section>
    </main>
  )
}

function App() {
  const [captcha, setCaptcha] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaError, setCaptchaError] = useState('')
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [composeUrl, setComposeUrl] = useState('')

  if (window.location.pathname.replace(/\/+$/, '') === '/admin') {
    return <AdminLogin />
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (captcha) {
      if (captchaInput.trim().toUpperCase() !== captcha) {
        setCaptchaError('That code didn’t match. Please try again.')
        return
      }

      setCaptchaError('')
      setCaptchaVerified(true)
      return
    }

    const formData = new FormData(event.currentTarget)
    const details = [
      ['Name', formData.get('name')],
      ['Phone / WhatsApp', formData.get('phone')],
      ['Current address', formData.get('address')],
      ['Course / program', formData.get('course')],
      ['College selected', formData.get('selectedCollege')],
      ['College allotted', formData.get('allottedCollege')],
      ['College location', formData.get('collegeLocation')],
      ['Accommodation preference', formData.get('accommodation')],
      ['Expected move-in', formData.get('moveDate') || 'Not sure yet'],
      ['A little more about the move', formData.get('notes') || '—'],
    ]
      .map(([label, value]) => `${label}: ${value}`)
      .join('\n')

    const subject = `Mumbai relocation help — ${formData.get('name')}`
    setComposeUrl(getEmailComposeUrl(subject, details))
    setCaptcha(createCaptcha())
    setCaptchaInput('')
    setCaptchaError('')
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Relocate. home">
          Relocate<span>.</span>
        </a>
        <a className="header-link" href="#how-it-works">
          How it works <ArrowIcon />
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <p className="eyebrow"><span /> A little help finding your feet</p>
            <h1>A new city.<br />A <em>softer</em> landing.</h1>
            <p className="hero-description">
              Moving to Mumbai for college is a big enough adventure. Let’s make
              finding a place to live the easy part.
            </p>
            <a className="button button-primary" href="#your-move">
              Tell us about your move <ArrowIcon />
            </a>
            <p className="hero-note">No long forms. Just a real person who gets back to you.</p>
          </div>

          <div className="hero-art" aria-label="Illustration of a Mumbai home">
            <div className="art-sun" />
            <div className="art-note">Your next<br />chapter starts<br />here <span>↘</span></div>
            <svg className="house-illustration" viewBox="0 0 420 340" role="img" aria-label="A welcoming apartment building">
              <path className="house-shadow" d="M55 300h315" />
              <path className="house-outline" d="m76 155 134-95 134 95v143H76z" />
              <path className="house-roof" d="m59 159 151-107 151 107-17 16-134-94-134 94z" />
              <path className="house-fill" d="M95 170h230v128H95z" />
              <path className="window" d="M119 192h49v52h-49zm132 0h49v52h-49z" />
              <path className="window-cross" d="M143.5 192v52m132-52v52" />
              <path className="door" d="M187 228h47v70h-47z" />
              <circle className="door-knob" cx="224" cy="265" r="2.5" />
              <path className="balcony" d="M108 251h71m-66 0v19m20-19v19m20-19v19m-40 0h52" />
              <path className="plant" d="M337 299v-40m0 16c-17-2-20-15-19-22 12 1 19 8 19 22m0-4c1-14 10-20 21-20 0 11-7 21-21 23m-14 25h27l-4 18h-19z" />
              <path className="sparkle" d="M354 88v22m-11-11h22M61 218v16m-8-8h16" />
            </svg>
            <div className="art-caption"><span>01</span> A place to call yours</div>
          </div>
        </section>

        <section className="intro-strip" id="how-it-works">
          <div className="strip-label">A LOCAL HAND, WHEN YOU NEED ONE</div>
          <p>PGs, shared flats, rented homes — we’ll help you figure out what fits, near the college you’re headed to.</p>
          <a href="#your-move">Here’s how to get started <ArrowIcon /></a>
        </section>

        <section className="steps-section" aria-label="How it works">
          <article className="step-card">
            <span className="step-number">01</span>
            <h2>Tell us where you’re headed</h2>
            <p>Share your college, your starting point, and what kind of place feels right.</p>
          </article>
          <article className="step-card">
            <span className="step-number">02</span>
            <h2>We’ll get to know your needs</h2>
            <p>A real person will reach out to talk through your plans and answer questions.</p>
          </article>
          <article className="step-card">
            <span className="step-number">03</span>
            <h2>Make Mumbai feel like home</h2>
            <p>Get a hand finding a PG or rental that works for you and your budget.</p>
          </article>
        </section>

        <section className="form-section" id="your-move">
          <div className="form-intro">
            <p className="eyebrow"><span /> Let’s start with you</p>
            <h2>Your Mumbai<br />{' '}move, in a nutshell.</h2>
            <p>Fill in what you know so far. It’s completely okay if some plans are still up in the air.</p>
            <div className="form-aside">
              <span className="aside-doodle">✳</span>
              <p>We’ll only use these details to get back to you about your move.</p>
            </div>
          </div>

          <form className="move-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <span className="form-index">A note to your relocation guide</span>
              <span className="required-note">* required</span>
            </div>

            <div className="field-grid">
              <label className="field">
                <span>Your name <b>*</b></span>
                <input name="name" type="text" autoComplete="name" placeholder="What should we call you?" required />
              </label>
              <label className="field">
                <span>Phone / WhatsApp <b>*</b></span>
                <input name="phone" type="tel" autoComplete="tel" placeholder="+91" required />
              </label>
              <label className="field full-field">
                <span>Where are you moving from? <b>*</b></span>
                <input name="address" type="text" autoComplete="street-address" placeholder="City, state (or your current address)" required />
              </label>
              <label className="field">
                <span>Course or program</span>
                <input name="course" type="text" placeholder="e.g. B.Des, B.Com" />
              </label>
              <label className="field">
                <span>College you had in mind</span>
                <input name="selectedCollege" type="text" placeholder="College name, if different" />
              </label>
              <label className="field full-field">
                <span>College you’ve been allotted <b>*</b></span>
                <input name="allottedCollege" type="text" placeholder="Your new college" required />
              </label>
              <label className="field full-field">
                <span>Where is the college? <b>*</b></span>
                <input name="collegeLocation" type="text" placeholder="Area or neighbourhood in Mumbai" required />
              </label>
            </div>

            <fieldset className="choice-field">
              <legend>What kind of place are you looking for? <b>*</b></legend>
              <div className="choice-list">
                <label><input type="radio" name="accommodation" value="PG" required /><span>PG</span></label>
                <label><input type="radio" name="accommodation" value="Shared flat" /><span>Shared flat</span></label>
                <label><input type="radio" name="accommodation" value="A place of my own" /><span>A place of my own</span></label>
                <label><input type="radio" name="accommodation" value="Still figuring it out" /><span>Still figuring it out</span></label>
              </div>
            </fieldset>

            <div className="field-grid last-fields">
              <label className="field">
                <span>When are you hoping to move?</span>
                <input
                  className="date-input"
                  name="moveDate"
                  type="date"
                  min={getTodayDate()}
                  aria-label="When are you hoping to move?"
                />
              </label>
              <label className="field">
                <span>Anything else we should know?</span>
                <textarea name="notes" rows="2" placeholder="Budget, questions, or just say hello..." />
              </label>
            </div>

            <div className="privacy-consent">
              <p>
                We’ll use your details only to respond to your relocation enquiry. This demo opens a
                Gmail draft; the website does not send or store your information.
              </p>
              <label>
                <input name="privacyConsent" type="checkbox" required />
                <span>I agree to be contacted about my relocation enquiry.</span>
              </label>
            </div>

            {captcha && !captchaVerified && (
              <div className="captcha-panel">
                <div className="field captcha-field">
                  <label htmlFor="captcha-input">Quick check: type the letters and numbers below</label>
                  <span className="captcha-row">
                    <span className="captcha-code" aria-label={`CAPTCHA code: ${captcha}`}>{captcha}</span>
                    <input
                      id="captcha-input"
                      name="captcha"
                      type="text"
                      value={captchaInput}
                      onChange={(event) => {
                        setCaptchaInput(event.target.value)
                        setCaptchaError('')
                      }}
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck="false"
                      maxLength={5}
                      aria-describedby={captchaError ? 'captcha-error' : undefined}
                      aria-invalid={Boolean(captchaError)}
                      placeholder="Enter code"
                      required
                    />
                    <button
                      className="captcha-refresh"
                      type="button"
                      onClick={() => {
                        setCaptcha(createCaptcha())
                        setCaptchaInput('')
                        setCaptchaError('')
                      }}
                      aria-label="Get a different code"
                    >
                      ↻
                    </button>
                  </span>
                </div>
                {captchaError && <p className="captcha-error" id="captcha-error" role="alert">{captchaError}</p>}
              </div>
            )}

            {!captchaVerified ? (
              <button className="button button-submit" type="submit">
                {captcha ? 'Verify code' : 'Send my details'} <ArrowIcon />
              </button>
            ) : (
              <div className="submit-confirmation" role="status">
                <p>Thanks — your details are ready. Open the email draft to review and send them.</p>
                <a
                  className="button button-submit"
                  href={composeUrl}
                >
                  Open email draft <ArrowIcon />
                </a>
              </div>
            )}
            <p className="privacy-note">
              {captchaVerified
                ? `Your email will be addressed to ${recipient}.`
                : 'After the quick check, your details will be prepared in an email draft for you to review.'}
            </p>
          </form>
        </section>
      </main>

      <section className="contact-section" aria-labelledby="contact-title">
        <div className="contact-copy">
          <p className="eyebrow"><span /> A real person, just a message away</p>
          <h2 id="contact-title">Questions? Let’s talk.</h2>
          <p>Have a doubt or want to share something about your move? Reach out in whatever way feels easiest.</p>
        </div>
        <div className="contact-actions">
          <a
            className="button contact-email-button"
            href={getEmailComposeUrl()}
            target={isMobileDevice() ? undefined : '_blank'}
            rel="noreferrer"
          >
            Write an email <ArrowIcon />
          </a>
          <a className="button contact-email-button" href={`https://wa.me/${contactPhone.slice(1)}`}>
            WhatsApp <ArrowIcon />
          </a>
          <a className="button contact-secondary-button" href={`tel:${contactPhone}`}>
            <PhoneIcon /> Call {contactPhoneDisplay}
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <a className="wordmark footer-mark" href="#home">Relocate<span>.</span></a>
        <p>For the next chapter, and the place that comes with it.</p>
        <a className="footer-email" href={`mailto:${recipient}`}>{recipient}</a>
      </footer>
    </div>
  )
}

export default App
