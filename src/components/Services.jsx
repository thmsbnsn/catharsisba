export default function Services() {
  const services = [
    {
      icon: "✨",
      title: "Custom Tattoos",
      description: "From fine-line minimalism to bold statement pieces, our artists bring your vision to life with precision and care."
    },
    {
      icon: "📋",
      title: "Professional Piercings",
      description: "Curated piercing services using premium jewelry and sterile techniques in a calm, professional environment."
    },
    {
      icon: "🛡️",
      title: "Safety First",
      description: "Hospital-grade sterilization, single-use needles, and rigorous safety protocols ensure your complete peace of mind."
    },
    {
      icon: "🏆",
      title: "Expert Artists",
      description: "Work with experienced, licensed artists who specialize in diverse styles and are passionate about their craft."
    }
  ];

  return (
    <section className="services-section section-block fly-in">
      <div className="services-header fly-in">
        <h2 className="split-heading">
          What We <span className="highlight">Offer</span>
        </h2>
        <p className="section-subhead" style={{ marginTop: '1rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
          Experience the perfect blend of artistry, precision, and care
        </p>
      </div>

      <div className="services-grid">
        {services.map((service, index) => (
          <div
            key={index}
            className="service-card fly-in"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <div className="service-card-icon">
              <span style={{ fontSize: '2rem' }}>{service.icon}</span>
            </div>
            <div className="service-card-content">
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

