'use client';

import { League } from '@/util/definitions';
import { useParams, useRouter } from 'next/navigation';
import { Dispatch, MouseEvent, SetStateAction, useState } from 'react';
import { motion } from 'motion/react';
import { useQuery } from '@tanstack/react-query';
import { fetchAPI } from '@/util/api';
import { API_URL } from '@/util/config';
import { Card, CardBody, useDisclosure } from '@heroui/react';
import { FaRegEdit } from 'react-icons/fa';
import FixtureToResult from '@/components/fixtureToResult/FixtureToResult';
import TruncatedText from '@/components/formattedText/truncatedText';
import { FixturesListDTO, SingleFixtureDTO } from '@/util/dto/fixtures';

export default function NextFixtures({
  league,
  seasonViewing = league.currentSeason,
  userOwnsThisLeague,
  invalidateDashboardQueries,
}: {
  league: League;
  seasonViewing?: number;
  userOwnsThisLeague: boolean;
  invalidateDashboardQueries: () => void;
}) {
  const [selectedFixture, setSelectedFixture] =
    useState<SingleFixtureDTO | null>(null);

  const {
    isOpen: isFixtureToResultOpen,
    onOpen: onFixtureToResultOpen,
    onClose: onFixtureToResultClose,
  } = useDisclosure();

  const { data, isLoading } = useQuery({
    queryFn: () =>
      fetchAPI(
        `${API_URL}/leagues/${league._id}/fixtures?limit=3&season=${seasonViewing}`,
        {
          method: 'GET',
        },
      ),
    queryKey: ['fixtures', league._id, seasonViewing],
  });

  const fixtures: FixturesListDTO | undefined = data?.data;

  const nextFixtures = fixtures?.fixtures.slice(0, 3);

  const [isHoveringOuterPanel, setIsHoveringOuterPanel] = useState(false);
  const router = useRouter();

  const isFixturesDisabled = seasonViewing !== league.currentSeason;

  return (
    <>
      <Card
        className={`px-[10px] py-[6px] h-full w-full ${
          !isHoveringOuterPanel ? 'data-[pressed=true]:scale-100' : ''
        }`}
        onMouseEnter={() => setIsHoveringOuterPanel(true)}
        onMouseLeave={() => setIsHoveringOuterPanel(false)}
        isPressable
        isDisabled={isFixturesDisabled}
        onClick={(e) => {
          e.stopPropagation();
          if (isFixturesDisabled) return;
          router.push(`/leagues/${league._id}/fixtures`);
        }}
        disableRipple={isFixturesDisabled}
        style={{
          background:
            isHoveringOuterPanel && !isFixturesDisabled
              ? 'hsl(var(--heroui-content3)/1)'
              : 'hsl(var(--heroui-content1)/1)',
          borderColor:
            isHoveringOuterPanel && !isFixturesDisabled
              ? 'transparent'
              : 'var(--border)',
        }}
      >
        <CardBody className="flex flex-col gap-2">
          <div className="flex flex-row items-baseline gap-[4px]">
            <p className="align-middle inline text-base">Fixtures </p>
            {fixtures !== undefined &&
              nextFixtures !== undefined &&
              nextFixtures.length >= 3 &&
              !isLoading && (
                <p className="text-sm inline text-muted">
                  - showing {nextFixtures.length} of {fixtures.totalFixtures}
                </p>
              )}
          </div>
          {isLoading || nextFixtures === undefined || fixtures === undefined ? (
            <div className="animate-pulse">
              <FixtureRowSkeleton />
              <FixtureRowSkeleton />
              <FixtureRowSkeleton />
            </div>
          ) : nextFixtures.length > 0 ? (
            <div className="flex flex-col gap-1">
              {nextFixtures.map((f, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setIsHoveringOuterPanel(false)}
                  onMouseLeave={() => setIsHoveringOuterPanel(true)}
                >
                  <FixtureRow
                    userOwnsThisLeague={userOwnsThisLeague}
                    fixtureObj={f}
                    setSelectedFixture={setSelectedFixture}
                    onFixtureToResultOpen={onFixtureToResultOpen}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col justify-center">
              <p className="italic place-self-center text-sm text-muted align-middle pb-6">
                No outstanding fixtures
              </p>
            </div>
          )}
        </CardBody>
      </Card>
      <FixtureToResult
        league={league}
        fixtureObj={selectedFixture}
        isModalOpen={isFixtureToResultOpen}
        onModalClose={onFixtureToResultClose}
        setSelectedFixture={setSelectedFixture}
        invalidateDashboardQueries={invalidateDashboardQueries}
      />
    </>
  );
}

function FixtureRow({
  userOwnsThisLeague,
  fixtureObj,
  setSelectedFixture,
  onFixtureToResultOpen,
}: {
  userOwnsThisLeague: boolean;
  fixtureObj: SingleFixtureDTO;
  setSelectedFixture: Dispatch<SetStateAction<SingleFixtureDTO | null>>;
  onFixtureToResultOpen: () => void;
}) {
  const router = useRouter();
  const { leagueId } = useParams();
  const [rowHover, setRowHover] = useState(false);
  const [editHover, setEditHover] = useState(false);

  function handleFixtureClick(e: MouseEvent) {
    e.stopPropagation();
    router.push(`/leagues/${leagueId}/fixture/${fixtureObj.fixture._id}`);
  }

  return (
    <motion.div
      className={`bg-content2  rounded-[10px] h-[36px] transition-colors duration-250 hover:cursor-pointer flex flex-row justify-baseline items-center`}
      onClick={(e) => handleFixtureClick(e)}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setRowHover(true)}
      onMouseLeave={() => setRowHover(false)}
      style={{
        backgroundColor:
          rowHover && editHover
            ? 'hsl(var(--heroui-content2)/1)'
            : rowHover
              ? 'hsl(var(--heroui-content3)/1)'
              : 'hsl(var(--heroui-content2)/1)',
      }}
    >
      <p className="px-[10px] w-max h-min flex-none text-sm">
        MD {fixtureObj.fixture.matchweek}
      </p>
      <div className="grid grid-rows-1 grid-cols-[1fr_40px_1fr] flex-grow place-items-end">
        {/* <p className="w-full text-right text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {fixtureObj.homeTeamDetails.name}
        </p> */}
        <TruncatedText
          content={fixtureObj.homeDetails.name}
          placement="top-end"
          textClassName="w-full text-right text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden"
        >
          {fixtureObj.homeDetails.name}
        </TruncatedText>

        <p className="w-full text-center text-sm text-muted">vs</p>

        {/* <p className="w-full text-left text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
          {fixtureObj.awayTeamDetails.name}
        </p> */}
        <TruncatedText
          content={fixtureObj.awayDetails.name}
          placement="top-start"
          textClassName="w-full text-left text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden"
        >
          {fixtureObj.awayDetails.name}
        </TruncatedText>
      </div>
      {userOwnsThisLeague && (
        <div
          onMouseEnter={() => setEditHover(true)}
          onMouseLeave={() => setEditHover(false)}
          className="px-[10px] hover:bg-content3 h-full flex flex-col justify-center items-center rounded-[10px] ml-1 transition-colors duration-250"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedFixture(fixtureObj);
            // Open the form modal
            onFixtureToResultOpen();
          }}
        >
          <FaRegEdit className="w-4 h-4 " />
        </div>
      )}
    </motion.div>
  );
}
function FixtureRowSkeleton() {
  return (
    <div className="bg-content2 h-[36px] border-0 border-divider rounded-[10px]"></div>
  );
}
