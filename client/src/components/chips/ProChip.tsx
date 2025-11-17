import { Chip } from '@heroui/react';

export default function ProChip() {
  return (
    <Chip
      classNames={{
        base: 'bg-linear-to-br from-yellow-200 via-amber-600 to-orange-800 outline-small outline-white/50 shadow-amber-500/30',
        content: 'drop-shadow-xs shadow-black text-black px-1',
      }}
      variant="shadow"
      size="sm"
    >
      <p className="text-xs font-instrument font-semibold">Pro</p>
    </Chip>
  );
}
