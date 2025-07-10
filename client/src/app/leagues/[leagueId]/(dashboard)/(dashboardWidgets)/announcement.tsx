import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';

export default function Announcement() {
  return (
    <div className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <span>
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Latest Announcement
        </Paragraph>
        <Label style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>
          Hey guys make sure to join my discord server to take part next season:
          discord.gg
        </Label>
      </span>
    </div>
  );
}
