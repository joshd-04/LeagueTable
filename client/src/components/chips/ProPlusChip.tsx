import { Chip } from '@heroui/react';

export default function ProPlusChip() {
  return (
    <Chip
      classNames={{
        base: 'bg-linear-to-br from-purple-600 via-pink-500 to-blue-600 outline-small outline-white/50 shadow-pink-500/50',
        content: 'drop-shadow-xs shadow-black text-black px-1',
      }}
      variant="shadow"
      size="sm"
    >
      <p className="text-xs font-instrument font-semibold">
        Pro<span className="font-extrabold">+</span>
      </p>
    </Chip>
  );
}
