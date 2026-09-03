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

            {/* Right Column: Prominent Interactive Destination Blocks */}
            <div className="pf-contact-destinations">
              {/* Email Destination */}
              <div className="pf-contact-dest-group">
                <span className="pf-contact-dest-label">EMAIL</span>
                <a
                  href="mailto:mohammedali83099@gmail.com"
                  className="pf-contact-dest-link"
                  id="contact-email-link"
                  title="Send an email to Mohammed Ali"
                  aria-label="Send email to Mohammed Ali"
                >
                  <span className="pf-contact-dest-action">
                    <svg
                      className="pf-contact-dest-icon"
                      width="18"
                      height="18"
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
                    <span className="pf-contact-dest-text">EMAIL ME</span>
                  </span>
                  <span className="pf-contact-dest-arrow" aria-hidden="true">↗</span>
                </a>
              </div>

              {/* LinkedIn Destination */}
              <div className="pf-contact-dest-group">
                <span className="pf-contact-dest-label">LINKEDIN</span>
                <a
                  href="https://www.linkedin.com/in/mohammed-ali-contech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pf-contact-dest-link"
                  id="contact-linkedin-link"
                  title="Open Mohammed Ali's LinkedIn profile in a new tab"
                  aria-label="Mohammed Ali on LinkedIn (opens in new tab)"
                >
                  <span className="pf-contact-dest-action">
                    <svg
                      className="pf-contact-dest-icon"
                      width="18"
                      height="18"
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
                    <span className="pf-contact-dest-text">LINKEDIN</span>
                  </span>
                  <span className="pf-contact-dest-arrow" aria-hidden="true">↗</span>
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
