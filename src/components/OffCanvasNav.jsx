import { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import Icon from './Icon.jsx';

function safeStorage(key, value = null) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    if (value === null) {
      return window.localStorage.getItem(key);
    }
    window.localStorage.setItem(key, value);
    return value;
  } catch (error) {
    console.warn('Storage unavailable', error);
    return null;
  }
}

export default function OffCanvasNav() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Initialize theme: localStorage -> system preference -> light
  useEffect(() => {
    const saved = safeStorage('theme');
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
      return;
    }
    const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = prefersDark ? 'dark' : 'light';
    setTheme(initial);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', initial);
    }
  }, []);

  const navItems = [
    { href: "/", title: "Home", iconSrc: "/icons/Homepage_Icon.svg", description: "Main page" },
    { href: "/artists", title: "Meet the Artists", iconSrc: "/icons/MeetTheArtists_Icon.svg", description: "Chris & Austin" },
    { href: "/gallery", title: "Gallery", iconSrc: "/icons/Gallery_Icon.svg", description: "Selected works" },
    { href: "/events", title: "Events", iconSrc: "/icons/events.svg", description: "This month & partners" },
    { href: "/faq", title: "FAQ", iconSrc: "/icons/faq.svg", description: "Common questions" },
    { href: "/our-studio", title: "Our Studio", iconSrc: "/icons/OurStudio_Icon.svg", description: "Visit us" },
    { href: "/aftercare", title: "Aftercare", iconSrc: "/icons/Aftercare_Icon.svg", description: "Healing guide" },
    { href: "/contact", title: "Contact", iconSrc: "/icons/Contact_Icon.svg", description: "Book & questions" },
    { href: "/blog", title: "Blog", iconSrc: "/icons/nav_blog.svg", description: "Stories & updates" }
  ];

  return (
    <>
      <button
        className="game-menu-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
      >
        <div className="menu-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span className="menu-label">Menu</span>
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog onClose={setOpen} className="game-menu-dialog">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity duration-300 ease-out"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-200 ease-in"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="game-menu-backdrop" data-theme-light={theme === 'light' ? '' : undefined} />
          </Transition.Child>

          {/* Menu Panel */}
          <div className="game-menu-container">
            <Transition.Child
              as={Fragment}
              enter="transition-all duration-300 ease-out"
              enterFrom="opacity-0 scale-95 translate-y-4"
              enterTo="opacity-100 scale-100 translate-y-0"
              leave="transition-all duration-200 ease-in"
              leaveFrom="opacity-100 scale-100 translate-y-0"
              leaveTo="opacity-0 scale-95 translate-y-4"
            >
              <Dialog.Panel className="game-menu-panel">
                {/* Header */}
                <div className="game-menu-header">
                  <Dialog.Title className="game-menu-title">Where do you want to go?</Dialog.Title>
                  <button
                    className="game-menu-close"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                  >
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Theme Toggle */}
                <div className="game-menu-theme">
                  <label className="theme-switch" aria-label="Toggle appearance">
                    <input
                      type="checkbox"
                      checked={theme === 'dark'}
                      onChange={(e) => {
                        const next = e.target.checked ? 'dark' : 'light';
                        setTheme(next);
                        safeStorage('theme', next);
                        if (typeof document !== 'undefined') {
                          document.documentElement.setAttribute('data-theme', next);
                        }
                      }}
                    />
                    <span className="slider" />
                  </label>
                  <span className="theme-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                </div>

                {/* Navigation Grid */}
                <nav className="game-menu-grid" role="navigation" aria-label="Primary navigation">
                  {navItems.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="game-menu-card"
                      onClick={() => setOpen(false)}
                    >
                      <div className="game-menu-card-icon">
                        <Icon src={item.iconSrc} className="w-6 h-6" title={item.title} />
                      </div>
                      <div className="game-menu-card-content">
                        <h3 className="game-menu-card-title">{item.title}</h3>
                        <p className="game-menu-card-desc">{item.description}</p>
                      </div>
                    </a>
                  ))}
                </nav>

                {/* Footer */}
                <div className="game-menu-footer">
                  <a
                    href="tel:+13172867092"
                    className="game-menu-call-btn"
                  >
                    📞
                    Call Now
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
