import { AccountTypeInterface } from './definitions';

export function handleColorThemeToggle(newColorTheme: 'light' | 'dark') {
  if (newColorTheme === 'light') {
    document.documentElement.style.setProperty('--bg-dark', 'hsl(0, 0%, 90%)');
    document.documentElement.style.setProperty('--bg', 'hsl(0, 0%, 95%)');
    document.documentElement.style.setProperty(
      '--bg-light',
      'hsl(0, 0%, 100%)'
    );
    document.documentElement.style.setProperty('--text', 'hsl(0, 0%, 5%)');
    document.documentElement.style.setProperty(
      '--text-muted',
      'hsl(0, 0%, 30%)'
    );
    document.documentElement.style.setProperty('--border', 'hsl(0, 0%, 70%)');
    document.documentElement.style.setProperty(
      '--shadow',
      '0px 2px 2px hsla(0, 0%, 0%, 0.07), 0px 4px 4px hsla(0, 0%, 0%, 0.15)'
    );
    document.documentElement.style.setProperty(
      '--accent',
      'hsl(200, 95%, 80%)'
    );
    document.documentElement.style.setProperty('--danger', 'hsl(0, 70%, 50%)');
    document.documentElement.style.setProperty(
      '--warning',
      'hsl(30, 70%, 50%)'
    );
    //
  } else {
    document.documentElement.style.setProperty('--bg-dark', 'hsl(0, 0%, 0%)');
    document.documentElement.style.setProperty('--bg', 'hsl(0, 0%, 5%)');
    document.documentElement.style.setProperty('--bg-light', 'hsl(0, 0%, 10%)');
    document.documentElement.style.setProperty('--text', 'hsl(0, 0%, 95%)');
    document.documentElement.style.setProperty(
      '--text-muted',
      'hsl(0, 0%, 70%)'
    );
    document.documentElement.style.setProperty('--border', 'hsl(0, 0%, 30%)');
    document.documentElement.style.setProperty(
      '--shadow',
      '0px 2px 2px hsla(0, 0%, 0%, 0.07), 0px 4px 4px hsla(0, 0%, 0%, 0.15)'
    );
    document.documentElement.style.setProperty(
      '--accent',
      'hsl(200, 95%, 10%)'
    );
    document.documentElement.style.setProperty('--danger', 'hsl(0, 60%, 60%)');
    document.documentElement.style.setProperty(
      '--warning',
      'hsl(60, 60%, 60%)'
    );
  }
}
export function smoothScroll(event: React.MouseEvent, id: string) {
  event.preventDefault(); // stop the instant jump
  const el = document.getElementById(id);
  if (!el) return;

  // do smooth scroll manually
  el.scrollIntoView({ behavior: 'smooth' });

  // STILL update the hash in the URL
  history.pushState(null, '', `#${id}`);
}

export const yearlyDiscount = 30;

export function calculatePrice(
  monthlyPrice: number,
  view: 'monthly' | 'yearly'
) {
  const price =
    view === 'monthly'
      ? monthlyPrice
      : Math.round(monthlyPrice * (1 - yearlyDiscount / 100) * 12);
  return price;
}

export function meetsMinimumTierLevel(
  requiredLevel: AccountTypeInterface,
  level: AccountTypeInterface
) {
  if (requiredLevel === 'free') return true;
  if (requiredLevel === 'pro') {
    if (level === 'pro' || level === 'pro+') return true;
    return false;
  }
  if (requiredLevel === 'pro+') {
    if (level === 'pro+') return true;
    return false;
  }
  return false;
}

export function shouldGrantAccessToFeature(
  featureLevel: AccountTypeInterface,
  leagueLevel: AccountTypeInterface,
  accountType: AccountTypeInterface
) {
  return (
    meetsMinimumTierLevel(featureLevel, accountType) &&
    meetsMinimumTierLevel(featureLevel, leagueLevel)
  );
}
