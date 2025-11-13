export default function ReadyToBegin() {
  return (
    <section className="ready-section section-block fly-in">
      <div className="ready-container">
        <div className="ready-card scale-in">
          <div className="ready-content">
            <h2 className="split-heading">
              Ready to Begin Your <span className="highlight">Journey?</span>
            </h2>
            <p className="section-subhead" style={{ marginTop: '1.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
              Let's talk about your vision. Book a consultation and discover how we can bring your ideas to life
              with artistry, precision, and care.
            </p>

            <div className="ready-actions">
              <a href="/contact" className="btn-cta">
                Schedule Consultation
                <svg style={{ width: '20px', height: '20px', marginLeft: '0.5rem', display: 'inline-block', verticalAlign: 'middle' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="/gallery" className="btn-outline">
                View Our Work
              </a>
            </div>

            <p className="ready-footer-text">
              Walk-ins welcome based on availability • Call us: <a href="tel:+13172867092" className="phone-link">(317) 286-7092</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

