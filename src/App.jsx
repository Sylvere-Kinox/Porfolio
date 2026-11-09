import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import SearchLab from './components/SearchLab';
import Timeline from './components/Timeline';
import Certifications from './components/Certifications';
import { Journal, Community, Testimonial, Contact, ReviewBar } from './components/Sections';
import { Marquee, WaxBand, ScrollProgress, CursorRing } from './components/ui';
import { MARQUEE } from './data/content';

export default function App() {
  return (
    <>
      <ScrollProgress />
      <CursorRing />
      <Hero />
      <Marquee items={MARQUEE} tone="sun" />
      <main>
        <About />
        <WaxBand variant="a" />
        <Projects />
        <SearchLab />
        <WaxBand variant="b" />
        <Timeline />
        <Certifications />
        <Journal />
        <Community />
        <Testimonial />
        <Contact />
      </main>
      <ReviewBar />   {/* à retirer avant la mise en ligne */}
    </>
  );
}
