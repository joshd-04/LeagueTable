import SmallBenefits from '@/components/landingPage/benefits/SmallBenefits';
import LandingPage from './(landingPage)/landingPage';
import PricingComponent from '@/components/landingPage/pricing/PricingComponent';
import FeatureBenefits from '@/components/landingPage/benefits/FeatureBenefits';
import FAQ from '@/components/landingPage/faq/faq';

export default function Home() {
  return (
    <div>
      <div className="flex flex-col justify-end items-center relative">
        <LandingPage />
        <FeatureBenefits />
        <SmallBenefits />
        <PricingComponent />
        <FAQ />
      </div>
    </div>
  );
}
