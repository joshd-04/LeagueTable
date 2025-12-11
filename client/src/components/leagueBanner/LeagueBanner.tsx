'use client';
import Image from 'next/image';
import Particles from '@/assets/reactbits/backgrounds/Particles';

export default function LeagueBanner({
  leagueLevel,
  displayNothing,
  children,
}: {
  leagueLevel: 'free' | 'pro' | 'pro+';
  displayNothing?: boolean;
  children: React.ReactNode;
}) {
  if (displayNothing) {
    return <LeagueBannerEmpty>{children}</LeagueBannerEmpty>;
  }
  if (leagueLevel === 'free')
    return <LeagueBannerFree>{children}</LeagueBannerFree>;
  else if (leagueLevel === 'pro')
    return <LeagueBannerStandard>{children}</LeagueBannerStandard>;
  else if (leagueLevel === 'pro+')
    return <LeagueBannerStandard>{children}</LeagueBannerStandard>;
  else {
    return <div>Invalid leagueLevel</div>;
  }
}

function LeagueBannerFree({ children }: { children: React.ReactNode }) {
  // const { colorTheme } = useContext(GlobalContext).colorTheme;
  // return (
  //   <div className="relative">
  //     <div
  //       className="bg-[var(--bg-dark)] w-full max-w-full aspect-[2560/338] border-b-2 border-[var(--border)]"
  //       style={{
  //         backgroundImage: `radial-gradient(${
  //           colorTheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.4)'
  //         } 2px, transparent 2px)`,
  //         backgroundSize: '32px 32px',
  //         backgroundRepeat: 'repeat',
  //         maskImage:
  //           'radial-gradient(circle at 50% 100%, white 0%, transparent 100%)',
  //       }}
  //     ></div>
  //     {children}
  //   </div>
  // );

  // return (
  //   <div className="relative">
  //     <div className="bg-[var(--bg-dark)] w-full max-w-full aspect-[2560/338] border-b-2 border-[var(--border)]">
  //       <DotGrid
  //         dotSize={6}
  //         gap={24}
  //         baseColor="var(--text)"
  //         activeColor="var(--text)"
  //         proximity={120}
  //         shockRadius={0}
  //         shockStrength={5}
  //         resistance={750}
  //         returnDuration={1.5}
  //         dotOpacity={0.5}
  //       />
  //     </div>
  //     {children}
  //   </div>
  // );

  return (
    <div className="relative">
      <div className="bg-transparent w-full max-w-full aspect-[2560/338] border-b-1 border-[var(--border)]">
        <Particles
          particleColors={['#00aaff', '#808080']}
          particleCount={800}
          particleSpread={20}
          speed={0.1}
          particleBaseSize={200}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />

        {children}
      </div>
    </div>
  );
}

function LeagueBannerEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="w-full max-w-full aspect-[2560/338] border-b-1 border-[var(--border)]">
        {children}
      </div>
    </div>
  );
}

function LeagueBannerStandard({ children }: { children: React.ReactNode }) {
  // Brightness values can be adjustable in league settings
  return (
    <div className="relative">
      <Image
        src="/banners/anfield.png"
        alt={'Banner'}
        width={2560}
        height={338}
        className={' brightness-100 dark:brightness-50 transition-all'}
      />
      {children}
    </div>
  );
}
