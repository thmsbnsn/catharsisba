export default function Approach() {
  const benefits = [
    "Detailed consultation to understand your vision",
    "Custom design process tailored to you",
    "Transparent pricing with no hidden fees",
    "Comfortable, clean studio environment",
    "Comprehensive aftercare guidance",
    "Ongoing support throughout healing"
  ];

  const stats = [
    { label: "Experience", value: "15+ Years", percentage: 95 },
    { label: "Client Satisfaction", value: "99%", percentage: 99 },
    { label: "Safety Standards", value: "100%", percentage: 100 }
  ];

  return (
    <section className="approach-section section-block fly-in">
      <div className="approach-container">
        <div className="approach-content fly-in-left">
          <h2 className="split-heading">
            Our <span className="highlight">Approach</span>
          </h2>
          <p className="section-subhead" style={{ marginTop: '1.5rem', maxWidth: 'none' }}>
            We believe in creating art that lasts a lifetime. Every piece begins with understanding your story,
            your style, and your vision. From concept to completion, we're with you every step of the way.
          </p>

          <div className="approach-benefits">
            {benefits.map((benefit, index) => (
              <div key={index} className="approach-benefit fly-in" style={{ transitionDelay: `${index * 0.1}s` }}>
                <svg className="approach-benefit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="approach-benefit-text">{benefit}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <a href="/contact" className="btn-cta">
              Book Consultation
            </a>
          </div>
        </div>

        <div className="fly-in-right">
          <div className="approach-stats-card scale-in">
            {stats.map((stat, index) => (
              <div key={index} className="approach-stat">
                <div className="approach-stat-header">
                  <span className="approach-stat-label">{stat.label}</span>
                  <span className="approach-stat-value">{stat.value}</span>
                </div>
                <div className="approach-stat-bar">
                  <div
                    className="approach-stat-bar-fill"
                    style={{ width: `${stat.percentage}%` }}
                  />
                </div>
              </div>
            ))}

            <div className="approach-quote">
              "Where art meets precision, and vision becomes reality"
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

