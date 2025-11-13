import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-background/95 via-background/85 to-background/95" />
      
      {/* Radial Glow Effects */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-40">
        <div 
          className="absolute top-[20%] left-[10%] w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, hsl(var(--accent) / 0.2) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-30 max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          More Than Ink Therapy—
          <br />
          <span className="text-gradient">This is Release.</span>
        </h1>
        
        <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
          Precision tattoos and curated piercings in a studio where detail, safety, and artistry are everything. 
          Bring your vision, leave transformed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="group text-lg px-8 py-6 shadow-gold">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6 glass-card hover:bg-card/60">
            View Gallery
          </Button>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
};

export default Hero;
