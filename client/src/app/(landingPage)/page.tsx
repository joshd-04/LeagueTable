import PricingComponent from '@/components/landingPage/pricing/PricingComponent';
import FeatureBenefits from '@/components/landingPage/benefits/FeatureBenefits';
import FAQ from '@/components/landingPage/faq/faq';
import HeroSection from './(components)/heroSection';

export default function Home() {
  return (
    <div>
      <div className="flex flex-col justify-end items-center relative">
        <HeroSection />
        <FeatureBenefits />
        <PricingComponent />
        <FAQ />
      </div>
    </div>
  );
}
