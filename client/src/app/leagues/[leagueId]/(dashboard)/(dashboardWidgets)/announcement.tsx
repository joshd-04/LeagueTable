import EditSVG from '@/assets/svg components/Edit';
import Button from '@/components/text/Button';
import Label from '@/components/text/Label';
import Paragraph from '@/components/text/Paragraph';
import { GlobalContext } from '@/context/GlobalContextProvider';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League } from '@/util/definitions';
import {
  UseMutateAsyncFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export default function Announcement({
  league,
  userOwnsThisLeague,
}: {
  league: League;
  userOwnsThisLeague: boolean;
}) {
  const [announcement, setAnnouncement] = useState(
    league.announcement || { text: '', date: new Date() }
  );
  const [announcementEditingText, setAnnouncementEditingText] = useState(
    announcement.text
  );
  const [isEditingAnnouncement, setIsEditingAnnouncement] = useState(false);
  const { setError } = useContext(GlobalContext).errors;
  const queryClient = useQueryClient();

  const { data, isLoading, isSuccess } = useQuery({
    queryFn: () =>
      fetchAPI(`${API_URL}/leagues/${league._id}/announcement`, {
        method: 'GET',
      }),
    queryKey: ['announcement'],
  });

  useEffect(() => {
    if (isLoading === false && isSuccess && data !== undefined) {
      setAnnouncement(data.data.announcement);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const { mutateAsync: handleEditAnnouncement } = useMutation({
    mutationFn: () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;
      return fetchAPI(`${API_URL}/leagues/${league._id}/announcement`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: announcementEditingText }),
        credentials: 'include',
      });
    },
    onSuccess: () => {
      setIsEditingAnnouncement(false);
      queryClient.invalidateQueries({ queryKey: ['announcement'] });
    },
    onError: (error) => {
      setIsEditingAnnouncement(false);
      setError(error.message);
    },
  });

  return (
    <div className="p-[20px] h-full w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <Paragraph
          style={{
            color: 'var(--text)',
            verticalAlign: 'middle',
            display: 'inline',
          }}
        >
          Latest Announcement
        </Paragraph>
        {userOwnsThisLeague && !isEditingAnnouncement && (
          <Button
            color="transparent"
            bgHoverColor="var(--bg-light)"
            borderlessButton={true}
            underlineEffect={false}
            shadowEffect={false}
            style={{ padding: '10px' }}
            onClick={() => {
              setAnnouncementEditingText(announcement.text);
              setIsEditingAnnouncement((prev) => !prev);
            }}
          >
            <EditSVG className="w-[16px] h-[16px] fill-[var(--text)]" />
          </Button>
        )}
      </div>

      {!isEditingAnnouncement &&
        (league.announcement && league.announcement.text.length > 0 ? (
          <div className="flex flex-col justify-between grow-1">
            <Label>{announcement.text}</Label>
            <div className="flex flex-row">
              <Label>
                {new Date(announcement.date).toLocaleTimeString(undefined, {
                  timeStyle: 'short',
                })}{' '}
                • {new Date(announcement.date).toLocaleDateString()}
              </Label>
            </div>
          </div>
        ) : (
          <Label
            style={{
              fontStyle: 'italic',
            }}
          >
            No announcements yet
          </Label>
        ))}
      {isEditingAnnouncement && (
        <Label
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: '1',
            color: 'var(--text)',
          }}
        >
          <TextAreaComponent
            announcement={announcement}
            announcementEditingText={announcementEditingText}
            setAnnouncementEditingText={setAnnouncementEditingText}
            setIsEditingAnnouncement={setIsEditingAnnouncement}
            handleEditAnnouncement={handleEditAnnouncement}
          />
        </Label>
      )}
    </div>
  );
}

function TextAreaComponent({
  announcement,
  announcementEditingText,
  setAnnouncementEditingText,
  setIsEditingAnnouncement,
  handleEditAnnouncement,
}: {
  announcement: {
    text: string;
    date: Date;
  };
  announcementEditingText: string;
  setAnnouncementEditingText: Dispatch<SetStateAction<string>>;
  setIsEditingAnnouncement: Dispatch<SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleEditAnnouncement: UseMutateAsyncFunction<any, Error, void, unknown>;
}) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (textAreaRef.current !== null) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(
        announcementEditingText.length,
        announcementEditingText.length
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <textarea
      className="bg-[var(--bg-light)] w-full h-full flex-grow outline-none border-1 border-[var(--border)] rounded-[10px] p-[10px]"
      value={announcementEditingText}
      onChange={(e) => setAnnouncementEditingText(e.target.value)}
      ref={textAreaRef}
      onBlur={() => {
        if (announcement.text !== announcementEditingText)
          handleEditAnnouncement();
        else setIsEditingAnnouncement(false);
      }}
      maxLength={150}
      rows={3}
    />
  );
}
