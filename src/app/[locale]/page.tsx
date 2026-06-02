import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import { MarqueeTicker } from '@/components/MarqueeTicker';
import JuiceMenu from '@/components/JuiceMenu';
import { Testimonials } from '@/components/Testimonials';
import PicassoPalette from '@/components/PicassoPalette';
import { AboutSection } from '@/components/AboutSection';
import { Footer } from '@/components/Footer';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { PageWrapper } from '@/components/PageWrapper';

export default function HomePage() {
  return (
    <PageWrapper>
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeTicker />
        <JuiceMenu />
        <PicassoPalette />
        <Testimonials />
        <AboutSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </PageWrapper>
  );
}
