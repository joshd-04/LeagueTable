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
  }
}
