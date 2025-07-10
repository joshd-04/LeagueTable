'use client';
import InfoSVG from '@/assets/svg components/Info';
import CreateLeagueForm from '@/components/forms/CreateLeagueForm';
import Heading1 from '@/components/text/Heading1';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import Subtitle from '@/components/text/Subtitle';

export default function ClientPage() {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className=" w-auto flex flex-col justify-center items-center p-[30px] transition-colors duration-250">
        <Heading1>Create A League</Heading1>
        <Subtitle style={{ marginTop: '-10px', color: 'var(--text-muted)' }}>
          League Setup - Part 1 of 3
        </Subtitle>
        <div className="grid grid-cols-3 grid-rows-1 w-[96vw] gap-[40px] pt-[40px]">
          <div></div>
          <CreateLeagueForm />
          <div className="p-[20px] max-w-[80%] h-min w-fit bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
            <span>
              <InfoSVG className="w-[32px] h-[32px] fill-[var(--info)] inline align-middle  " />{' '}
              <Paragraph
                style={{
                  color: 'var(--info)',
                  verticalAlign: 'middle',
                  display: 'inline',
                }}
              >
                League type
              </Paragraph>
            </span>
            <Label style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}>
              Basic leagues are simplified for a more streamlined experience.
              Advanced leagues contain more features & stats. <br /> Currently
              advanced leagues feature:
            </Label>
            <ul className="list-disc pl-[20px] text-[var(--text-muted)]">
              <li className="">
                <Label
                  style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}
                >
                  Goal scorers
                </Label>
              </li>
              <li className="">
                <Label
                  style={{ fontWeight: 'normal', color: 'var(--text-muted)' }}
                >
                  Assist makers
                </Label>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
