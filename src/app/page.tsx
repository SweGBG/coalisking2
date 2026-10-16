import CrintroLoader from "@/components/CrintroLoader";
import Navbar from "@/components/Navbar";
import FilmHero from "@/components/FilmHero";
import Philosophy from "@/components/Philosophy";
import Signature from "@/components/Signature";
import SmoothScroll from "@/components/SmoothScroll";
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
      <CrintroLoader />
      <SmoothScroll />
      <ScrollFadeIn />
      <ScrollProgress />
      <Navbar />
      <main>
        <FilmHero />
        <InfoBar />
        <Philosophy />
        <Signature />
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
