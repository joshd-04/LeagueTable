import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { League } from '@/util/definitions';
import {
  addToast,
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
} from '@heroui/react';
import {
  QueryObserverResult,
  RefetchOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';

interface IAnnouncement {
  text: string;
  date: Date;
}

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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    data,
    isLoading,
    isSuccess,
    refetch: refetchAnnouncement,
  } = useQuery({
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

  return (
    <>
      <Card className="h-full w-full px-[10px] pb-[6px]">
        <CardBody className="flex flex-col gap-2">
          <div className="flex flex-row justify-between items-center">
            <p className="align-middle inline text-base/[40px]">
              Latest Announcement
            </p>
            {userOwnsThisLeague && (
              <Button variant="flat" onPress={onOpen} isIconOnly>
                <FaRegEdit className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="h-full">
            {league.announcement && league.announcement.text.length > 0 ? (
              <div className="flex flex-col justify-between grow-1 h-full">
                <p className="text-sm">{announcement.text}</p>
                <div className="flex flex-row">
                  <p className="text-sm text-muted">
                    {new Date(announcement.date).toLocaleTimeString(undefined, {
                      timeStyle: 'short',
                    })}{' '}
                    • {new Date(announcement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm italic text-muted">No announcements yet</p>
            )}
          </div>
        </CardBody>
      </Card>
      <EditAnnouncementModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        initialAnnouncement={announcement}
        league={league}
        fetchAnnouncement={refetchAnnouncement}
      />
    </>
  );
}

function EditAnnouncementModal({
  isOpen,
  onOpenChange,
  initialAnnouncement,
  league,
  fetchAnnouncement,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  initialAnnouncement: IAnnouncement;
  league: League;
  fetchAnnouncement: (
    options?: RefetchOptions | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => Promise<QueryObserverResult<any, Error>>;
}) {
  const [announcementText, setAnnouncementText] = useState(
    initialAnnouncement.text
  );

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
        body: JSON.stringify({ text: announcementText }),
        credentials: 'include',
      });
    },
    onSuccess: (response) => {
      if (response.status === 'success') {
        fetchAnnouncement();
        addToast({
          title: 'Announcement set!',
          color: 'success',
          shouldShowTimeoutProgress: true,
        });
      } else if (response.status === 'fail') {
        addToast({
          title: 'Unable to set announcement',
          description: 'Something went wrong',
          color: 'warning',
          shouldShowTimeoutProgress: true,
        });
      } else {
        addToast({
          title: 'Could not update announcement',
          description: 'Something went wrong on our end',
          color: 'danger',
          shouldShowTimeoutProgress: true,
        });
      }
    },
    onError: () => {
      addToast({
        title: 'Could not update announcement',
        description: 'Something went wrong on our end',
        color: 'danger',
        shouldShowTimeoutProgress: true,
      });
    },
  });

  async function handleSubmit(closeModal: () => void) {
    await handleEditAnnouncement();
    closeModal();
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Edit Announcement
            </ModalHeader>
            <ModalBody>
              <Textarea
                // className="max-w-xs"
                label="Announcement"
                placeholder="Enter your new announcement"
                labelPlacement="inside"
                isClearable
                variant="flat"
                value={announcementText}
                onValueChange={setAnnouncementText}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                className="font-semibold text-sm"
                color="primary"
                onPress={() => {
                  handleSubmit(onClose);
                }}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
