import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import TattooChair3D from './TattooChair3D';
import StudioEnvironment3D from './StudioEnvironment3D';

const Hero3D = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / (scrollHeight * 0.3), 1); // First 30% of page
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas shadows>
          <PerspectiveCamera
            makeDefault
            position={[
              Math.sin(scrollProgress * Math.PI * 2) * 5,
              2 + scrollProgress * 2,
              Math.cos(scrollProgress * Math.PI * 2) * 5
            ]}
            fov={50}
          />
          
          <OrbitControls
            ref={controlsRef}
            enableZoom={false}
            enablePan={false}
            enableRotate={false}
            target={[0, 1, 0]}
          />

          <StudioEnvironment3D />
          <TattooChair3D />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#0a0a0a', 8, 20]} />
        </Canvas>
      </div>

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/90 pointer-events-none" />

      {/* Content overlay */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
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

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="text-muted-foreground text-sm mb-2">Scroll to explore</div>
            <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20 pointer-events-none" />
    </section>
  );
};

export default Hero3D;
