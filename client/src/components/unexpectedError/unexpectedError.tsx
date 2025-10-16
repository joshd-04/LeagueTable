import LinkButton from '../text/LinkButton';
import Paragraph from '../text/Paragraph';
import Subtitle from '../text/Subtitle';

export default function UnexpectedError() {
  return (
    <div className="flex flex-col justify-center items-center w-full pt-[100px]">
      <div
        className={`w-[440px] bg-[var(--bg)]  rounded-[10px] border-1 border-solid border-[var(--border)] py-[20px] px-[20px]`}
      >
        <div className="flex flex-col justify-center">
          <Subtitle
            style={{
              color: 'var(--danger)',
            }}
          >
            Oops! W&apos;ve run into a problem
          </Subtitle>
          <Paragraph
            style={{
              fontSize: '1rem',
              color: 'var(--text-muted)',
            }}
          >
            Something unexpected happened.
          </Paragraph>
          <hr className="text-[var(--text-muted)] my-[0.75rem]" />
          <div className="flex flex-col w-full gap-1">
            <Paragraph
              style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
              }}
            >
              Returning home should fix this
            </Paragraph>
            <LinkButton
              href="/"
              color="var(--text-muted)"
              bgHoverColor="var(--bg-light)"
              style={{ width: '100%', fontSize: '1rem' }}
            >
              Return Home
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
