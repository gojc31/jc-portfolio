import MouseSpotlight from "./components/MouseSpotlight";
import ParticleCanvas from "./components/ParticleCanvas";
import { SectionDivider } from "./components/TechFrame";
import { SoundProvider } from "./components/SoundManager";
import EasterEgg from "./components/EasterEgg";
import ParallaxSection from "./components/ParallaxLayer";
import ScrollReveal from "./components/ScrollReveal";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import ClientMarquee from "./components/ClientMarquee";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AmbientOrbs from "./components/AmbientOrbs";

function App() {
  return (
    <SoundProvider>
      <EasterEgg />
      <MouseSpotlight />
      <ParticleCanvas />
      <Navbar />

      <main>
        <AmbientOrbs count={4} className="fixed inset-0 z-0" />
        <Hero />
        <SectionDivider />
        <ParallaxSection variant="dots" intensity={0.3}>
          <ScrollReveal variant="fade-up">
            <About />
          </ScrollReveal>
        </ParallaxSection>
        <SectionDivider />
        <ParallaxSection variant="diamonds" intensity={0.3}>
          <ScrollReveal variant="fade-slide" delay={0.1}>
            <Services />
          </ScrollReveal>
        </ParallaxSection>
        <SectionDivider />
        <ParallaxSection variant="grid" intensity={0.3}>
          <ScrollReveal variant="fade-up" delay={0.1}>
            <Portfolio />
          </ScrollReveal>
        </ParallaxSection>
        <SectionDivider />
        <ClientMarquee />
        <SectionDivider />
        <ScrollReveal variant="fade-slide">
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal variant="fade-up">
          <Contact />
        </ScrollReveal>
      </main>

      <Footer />
    </SoundProvider>
  );
}

export default App;
