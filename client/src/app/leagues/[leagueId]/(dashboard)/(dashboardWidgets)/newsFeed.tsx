import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';

export default function NewsFeed() {
  return (
    <div className="p-[20px] h- w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <Paragraph
        style={{
          color: 'var(--text)',
          verticalAlign: 'middle',
          display: 'inline',
        }}
      >
        News feed
      </Paragraph>
      <div className="overflow-y-auto max-h-[12rem] flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[10px]">
          <Label style={{ color: 'var(--text)' }}>MD27</Label>
          <Label
            style={{
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            🔥 Rare goes top of the table after beating itzsuper 1-0 again
          </Label>
          <Label
            style={{
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            🧤 Back-to-back cleansheets for Rare (2 games)
          </Label>
          <Label
            style={{
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            📉 Itzsuper&apos;s title hopes are fading away (gap: 7 pts)
          </Label>
        </div>
        <div className="flex flex-col gap-[10px]">
          <Label style={{ color: 'var(--text)', fontWeight: 'normal' }}>
            MD26
          </Label>
          <Label
            style={{
              color: 'var(--text)',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            🔥 Rare goes top of the table after beating itzsuper 1-0 again
          </Label>
          <Label
            style={{
              fontWeight: 'normal',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            🧤 Back-to-back cleansheets for Rare (2 games)
          </Label>
          <Label
            style={{
              color: 'var(--text)',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            📉 Itzsuper&apos;s title hopes are fading away (gap: 7 pts)
          </Label>
        </div>
        <div className="flex flex-col gap-[10px]">
          <Label style={{ color: 'var(--text)' }}>MD25</Label>
          <Label
            style={{
              color: 'var(--text)',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            🔥 Rare goes top of the table after beating itzsuper 1-0 again
          </Label>
          <Label
            style={{
              color: 'var(--text)',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            🧤 Back-to-back cleansheets for Rare (2 games)
          </Label>
          <Label
            style={{
              color: 'var(--text)',
              textWrap: 'nowrap',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
          >
            📉 Itzsuper&apos;s title hopes are fading away (gap: 7 pts)
          </Label>
        </div>
      </div>
    </div>
  );
}
