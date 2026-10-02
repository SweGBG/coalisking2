import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import InfoBar from "@/components/InfoBar";
import Marquee from "@/components/Marquee";
import Menu from "@/components/Menu";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Gallery from "@/components/Gallery";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollFadeIn from "@/components/ScrollFadeIn";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      <ScrollFadeIn />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <InfoBar />
        <Marquee />
        <Menu />
        <About />
        <Testimonials />
        <Gallery />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
