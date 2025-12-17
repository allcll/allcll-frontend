import MainBanner from '@/components/Landing/MainBanner.tsx';
import TimetableSection from '@/components/Landing/TimetableSection.tsx';
import SimulationSection from '@/components/Landing/SimulationSection.tsx';
import WishesSection from '@/components/Landing/WishesSection.tsx';
import LiveSection from '@/components/Landing/LiveSection.tsx';
import PainPointSection from '@/components/Landing/PainPointSection.tsx';
import FeedbacksSection from '@/components/Landing/FeedbacksSection.tsx';

function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <MainBanner />

      {/* 서비스 소개 */}
      <TimetableSection />
      <WishesSection />
      <SimulationSection />
      <LiveSection />

      <PainPointSection />
      <FeedbacksSection />
    </div>
  );
}

export default Landing;
