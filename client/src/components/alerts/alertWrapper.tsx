import { ReactNode } from 'react';

export default function AlertWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="fixed bottom-10 left-1/2 z-10 -translate-x-1/2 w-max ">
      {children}
    </div>
  );
}
