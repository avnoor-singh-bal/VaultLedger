import HeroSection from "@/components/landingpage/HeroSection";
import FeaturesSecton from "@/components/landingpage/FeaturesSecton";
import CallToAction from "@/components/landingpage/CallToAction";

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection/> 
      <FeaturesSecton/>
      <CallToAction/>
    </div>
  );
}