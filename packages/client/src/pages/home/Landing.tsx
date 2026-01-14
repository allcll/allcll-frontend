import MainBanner from '@/widgets/home/ui/MainBanner.tsx';
import TimetableSection from '@/widgets/home/ui/TimetableSection.tsx';
import SimulationSection from '@/widgets/home/ui/SimulationSection.tsx';
import WishesSection from '@/widgets/home/ui/WishesSection.tsx';
import LiveSection from '@/widgets/home/ui/LiveSection.tsx';
import PainPointSection from '@/widgets/home/ui/PainPointSection.tsx';
import FeedbacksSection from '@/widgets/home/ui/FeedbacksSection.tsx';

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
