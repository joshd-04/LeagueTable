import { Spinner } from '@heroui/react';

export default function LoadingPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-[90vh]">
      <Spinner variant="wave" />
      <p className="text-muted">Please wait</p>
    </div>
  );
}
