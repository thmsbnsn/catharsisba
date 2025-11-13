import { Sparkles, Layers, Shield, Award } from "lucide-react";

const services = [
  {
    icon: Sparkles,
    title: "Custom Tattoos",
    description: "From fine-line minimalism to bold statement pieces, our artists bring your vision to life with precision and care.",
  },
  {
    icon: Layers,
    title: "Professional Piercings",
    description: "Curated piercing services using premium jewelry and sterile techniques in a calm, professional environment.",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Hospital-grade sterilization, single-use needles, and rigorous safety protocols ensure your complete peace of mind.",
  },
  {
    icon: Award,
    title: "Expert Artists",
    description: "Work with experienced, licensed artists who specialize in diverse styles and are passionate about their craft.",
  },
];

const Services = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            What We <span className="text-gradient">Offer</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Experience the perfect blend of artistry, precision, and care
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="glass-card rounded-2xl p-8 hover:shadow-gold transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="mb-6 inline-flex p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <service.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
