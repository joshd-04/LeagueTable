import PricingComparison from '@/components/landingPage/pricing/PricingComparison';

export default function PricingClient() {
  return (
    <div
      id="hero"
      className="bg-background relative flex h-full w-full flex-col items-center"
    >
      <main className="container  flex flex-1 flex-col items-center justify-center mt-15 ">
        <section className="z-20 flex flex-col items-center justify-center gap-[18px] sm:gap-6  mx-8 md:mx-16 xl:mx-72">
          <div>
            <div className=" text-[clamp(40px,10vw,44px)] leading-[1.2] font-bold tracking-tighter sm:text-[64px]">
              <div className="bg-gradient-title-light dark:bg-gradient-title bg-clip-text text-transparent">
                Pricing
              </div>
            </div>
          </div>
        </section>
      </main>
      <PricingComparison />
    </div>
  );
}
