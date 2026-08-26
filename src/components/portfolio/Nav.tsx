'use client';

import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { label: 'About',                 href: '#about' },
  { label: 'Selected Work',        href: '#work' },
  { label: 'Upcoming Work',        href: '#upcoming' },
  { label: 'How I Build',          href: '#process' },
  { label: 'Tools & Technologies', href: '#tools' },
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close drawer when user navigates to a section
  useEffect(() => {
    const handleHashChange = () => setMenuOpen(false);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Prevent body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <header>
      <nav className="pf-nav" role="navigation" aria-label="Main navigation">
        <div className="pf-nav-inner">
          {/* Logo / wordmark */}
          <a href="#" className="pf-nav-logo" aria-label="Back to top">
            PORTFOLIO
          </a>

          {/* Desktop navigation */}
          <div className="pf-nav-links" role="menubar">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="pf-nav-link"
                role="menuitem"
              >
                {link.label}
              </a>
            ))}
            <a href="#contact" className="pf-nav-cta" id="nav-contact-btn">
              CONTACT
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`pf-nav-hamburger${menuOpen ? ' is-open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-drawer"
            id="nav-hamburger-btn"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile drawer */}
        <div
          id="mobile-nav-drawer"
          className={`pf-nav-drawer${menuOpen ? ' is-open' : ''}`}
          aria-hidden={!menuOpen}
        >
          <nav className="pf-nav-drawer-links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="pf-nav-drawer-link"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="pf-nav-drawer-link"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>
          </nav>
        </div>
      </nav>
    </header>
  );
}
