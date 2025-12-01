import Benefits from '@/components/landingPage/benefits/Benefits';
import LandingPage from './(landingPage)/landingPage';
import PricingComponent from '@/components/landingPage/pricing/PricingComponent';

export default function Home() {
  return (
    <div>
      <div className="flex flex-col justify-end items-center">
        <LandingPage />
        <Benefits />
        <PricingComponent />
      </div>
    </div>
  );
}
