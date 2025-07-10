import ArrowBackSVG from '@/assets/svg components/ArrowBack';
import ArrowForwardSVG from '@/assets/svg components/ArrowForward';
import Button from '@/components/text/Button';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';

export default function SeasonRewind() {
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
          Season rewind
        </Paragraph>
        <Label style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>
          View results, tables & stats from previous seasons
        </Label>
        <div className="mt-[20px] bg-[var(--bg-light)] w-fit rounded-[10px] grid grid-cols-[repeat(3,max-content)] grid-rows-1 place-items-center">
          <Button
            color="transparent"
            bgHoverColor="var(--accent)"
            borderlessButton={true}
            underlineEffect={false}
          >
            <ArrowBackSVG className="w-[24px] h-[24px] fill-[var(--primary)]" />
          </Button>
          <Paragraph style={{ margin: '0 20px' }}>Season 2</Paragraph>
          <Button
            color="transparent"
            bgHoverColor="var(--accent)"
            borderlessButton={true}
            underlineEffect={false}
            disabled
          >
            <ArrowForwardSVG className="w-[24px] h-[24px] fill-[var(--primary)]" />
          </Button>
        </div>
      </span>
    </div>
  );
}
