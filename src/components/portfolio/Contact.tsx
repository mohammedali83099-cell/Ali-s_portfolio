export function Contact() {
  return (
    <>
      {/* Dark composed contact section */}
      <section
        id="contact"
        className="pf-contact"
        aria-label="Contact"
      >
        <div className="pf-contact-inner">
          <div className="pf-contact-grid">
            {/* Left Column: Eyebrow + Large Closing Statement */}
            <div className="pf-contact-statement">
              <span className="pf-contact-eyebrow">CONTACT</span>
              <h2 className="pf-contact-heading">
                Let&rsquo;s build something meaningful.
              </h2>
            </div>

            {/* Right Column: Prominent Primary Email Card + Secondary Actions */}
            <div className="pf-contact-panel">
              {/* Primary Email Card */}
              <div className="pf-contact-card pf-contact-card--primary">
                <div className="pf-contact-card-header">
                  <div className="pf-contact-card-tag">
                    <svg
                      className="pf-contact-card-icon"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <span className="pf-contact-card-label">EMAIL</span>
                  </div>
                  <span className="pf-contact-card-status" aria-hidden="true">
                    <span className="pf-contact-status-dot" />
                    DIRECT INQUIRIES
                  </span>
                </div>

                <div className="pf-contact-card-body">
                  <p className="pf-contact-card-address">mohammedali83099@gmail.com</p>
                  <p className="pf-contact-card-note">
                    Have an engineering problem, systems architecture discussion, or project to build? Reach out directly.
                  </p>
                </div>

                <a
                  href="mailto:mohammedali83099@gmail.com"
                  className="pf-contact-card-action"
                  id="contact-email-btn"
                  title="Send an email to Mohammed Ali"
                  aria-label="Send email to Mohammed Ali (opens default mail client)"
                >
                  <span className="pf-contact-action-text">EMAIL ME</span>
                  <span className="pf-contact-action-arrow" aria-hidden="true">↗</span>
                </a>
              </div>

              {/* Secondary Actions: LinkedIn & Resume */}
              <div className="pf-contact-secondary-grid">
                {/* LinkedIn Action Card */}
                <a
                  href="https://www.linkedin.com/in/mohammed-ali-contech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pf-contact-sub-card"
                  id="contact-linkedin-link"
                  title="Open Mohammed Ali's LinkedIn profile in a new tab"
                  aria-label="Mohammed Ali on LinkedIn (opens in new tab)"
                >
                  <div className="pf-contact-sub-main">
                    <svg
                      className="pf-contact-sub-icon"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                    <div className="pf-contact-sub-info">
                      <span className="pf-contact-sub-label">NETWORK</span>
                      <span className="pf-contact-sub-title">LINKEDIN</span>
                    </div>
                  </div>
                  <span className="pf-contact-sub-arrow" aria-hidden="true">↗</span>
                </a>

                {/* Resume Action Card */}
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pf-contact-sub-card"
                  id="contact-resume-link"
                  title="View Mohammed Ali's Resume (PDF)"
                  aria-label="View Mohammed Ali's Resume in a new tab"
                >
                  <div className="pf-contact-sub-main">
                    <svg
                      className="pf-contact-sub-icon"
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <div className="pf-contact-sub-info">
                      <span className="pf-contact-sub-label">DOCUMENT</span>
                      <span className="pf-contact-sub-title">RESUME</span>
                    </div>
                  </div>
                  <span className="pf-contact-sub-arrow" aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visually separated minimal footer bar */}
      <footer className="pf-footer" aria-label="Site footer">
        <div className="pf-footer-inner">
          <span className="pf-footer-copy">
            © {new Date().getFullYear()} — PORTFOLIO. ENGINEERING &amp; PRODUCT.
          </span>
          <div className="pf-footer-links">
            <a href="#about" className="pf-footer-link">ABOUT</a>
            <a href="#work" className="pf-footer-link">SELECTED WORK</a>
            <a href="#upcoming" className="pf-footer-link">UPCOMING WORK</a>
            <a href="#process" className="pf-footer-link">HOW I BUILD</a>
            <a href="#tools" className="pf-footer-link">TOOLS &amp; TECHNOLOGIES</a>
            <a href="#contact" className="pf-footer-link">CONTACT</a>
          </div>
        </div>
      </footer>
    </>
  );
}
