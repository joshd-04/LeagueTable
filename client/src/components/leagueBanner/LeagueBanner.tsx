'use client';
import Image from 'next/image';
import { League } from '@/util/definitions';
import { useContext } from 'react';
import { GlobalContext } from '@/context/GlobalContextProvider';
import Particles from '@/assets/reactbits/backgrounds/Particles';

export default function LeagueBanner({
  league,
  children,
}: {
  league: League;
  children: React.ReactNode;
}) {
  if (league.leagueLevel === 'free')
    return <LeagueBannerFree>{children}</LeagueBannerFree>;
  if (league.leagueLevel === 'standard')
    return <LeagueBannerStandard>{children}</LeagueBannerStandard>;
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
      <div className="bg-[var(--bg-dark)] w-full max-w-full aspect-[2560/338] border-b-1 border-[var(--border)]">
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

function LeagueBannerStandard({ children }: { children: React.ReactNode }) {
  const { colorTheme } = useContext(GlobalContext).colorTheme;
  return (
    <div className="relative">
      <Image
        src="/banners/anfield.png"
        alt={'Banner'}
        width={2560}
        height={338}
        className={`${
          colorTheme === 'dark' ? 'brightness-[50%]' : 'brightness-[100%]'
        } transition-all`}
      />
      {children}
    </div>
  );
}
