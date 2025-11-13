import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const approaches = [
  "Detailed consultation to understand your vision",
  "Custom design process tailored to you",
  "Transparent pricing with no hidden fees",
  "Comfortable, clean studio environment",
  "Comprehensive aftercare guidance",
  "Ongoing support throughout healing",
];

const Approach = () => {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Our <span className="text-gradient">Approach</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              We believe in creating art that lasts a lifetime. Every piece begins with understanding your story, 
              your style, and your vision. From concept to completion, we're with you every step of the way.
            </p>
            
            <div className="space-y-4 mb-8">
              {approaches.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="shadow-gold">
              Book Consultation
            </Button>
          </div>

          <div className="relative">
            <div className="glass-card rounded-3xl p-12 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl">Experience</span>
                  <span className="text-primary font-bold text-2xl">15+ Years</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[95%] bg-gradient-to-r from-primary to-accent rounded-full" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl">Client Satisfaction</span>
                  <span className="text-primary font-bold text-2xl">99%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-[99%] bg-gradient-to-r from-primary to-accent rounded-full" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl">Safety Standards</span>
                  <span className="text-primary font-bold text-2xl">100%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-primary to-accent rounded-full" />
                </div>
              </div>

              <div className="pt-6 border-t border-border/50">
                <p className="text-center text-muted-foreground italic">
                  "Where art meets precision, and vision becomes reality"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;
