import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
          {/* Decorative Glow */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)'
            }}
          />

          <div className="relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Ready to Begin Your <span className="text-gradient">Journey?</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Let's talk about your vision. Book a consultation and discover how we can bring your ideas to life 
              with artistry, precision, and care.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 shadow-gold group">
                Schedule Consultation
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 glass-card hover:bg-card/60">
                View Our Work
              </Button>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              Walk-ins welcome based on availability • Call us: <span className="text-primary">(317) 286-7092</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
