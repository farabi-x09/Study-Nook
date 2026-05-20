import HeroBanner from "@/components/HeroBanner";
import AvailableRoomsSection from "@/components/AvailableRoomsSection";
import WhyStudyNookSection from "@/components/WhyStudyNookSection";
import HowItWorksSection from "@/components/HowItWorksSection";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <AvailableRoomsSection />
      <WhyStudyNookSection />
      <HowItWorksSection />
    </div>
  );
}
