import Navigation from "@/components/Navigation";
import Hero3D from "@/components/Hero3D";
import Services from "@/components/Services";
import Approach from "@/components/Approach";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero3D />
        <Services />
        <Approach />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
