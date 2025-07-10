'use client';
import { useContext } from 'react';
import Paragraph from '../text/Paragraph';
import { GlobalContext } from '@/context/GlobalContextProvider';

export default function TeamForm({ form }: { form: string }) {
  const { colorTheme } = useContext(GlobalContext).colorTheme;
  const sanitizedForm = form.slice(0, 5);

  let brightIndex = 0;
  let completeFlag = false;
  for (let i = sanitizedForm.length - 1; i >= 0; i--) {
    if (form[i] !== '-' && !completeFlag) {
      brightIndex = i;
      completeFlag = true;
    }
  }

  const brightFilter =
    colorTheme === 'dark' ? 'brightness(100%)' : 'brightness(150%)';
  const dimFilter =
    colorTheme === 'dark' ? 'brightness(60%)' : 'brightness(100%)';

  return (
    <div className="grid grid-cols-[repeat(5,3ch)] grid-rows-1 gap-[2px] text-sm">
      {sanitizedForm.split('').map((letter, i) => (
        <Paragraph
          key={i}
          style={{
            color: letter === '-' ? 'var(--text)' : 'white',
            backgroundColor:
              letter === 'W'
                ? '#148a00'
                : letter === 'D'
                ? '#545658'
                : letter === 'L'
                ? '#e51854'
                : 'transparent',
            textAlign: 'center',
            filter: i === brightIndex ? brightFilter : dimFilter,
          }}
        >
          {letter}
        </Paragraph>
      ))}
    </div>
  );
}
