import { Tooltip } from '@heroui/react';
import ProChip from '../chips/ProChip';
import TeamForm from './TeamForm';
import { FaLock } from 'react-icons/fa';

export default function TeamFormLocked({
  userOwnsThisLeague,
}: {
  userOwnsThisLeague: boolean;
}) {
  if (userOwnsThisLeague) {
    return (
      <Tooltip
        className="bg-content2 max-w-[240px]"
        content={
          <div className="p-[6px] py-[10px] flex flex-col gap-2">
            <div className="flex flex-row items-center gap-1">
              <ProChip />
              <h4>Pro feature</h4>
            </div>
            <p className="text-muted text-xs">
              Upgrade your account to Pro to unlock team form
            </p>
          </div>
        }
      >
        <div className="relative w-max">
          <span className="blur-xs  text-muted">
            <TeamForm form="WDLWW" />
          </span>
          <div className="absolute left-[50%] top-[50%] translate-[-50%]">
            <div className=" flex flex-row gap-1 items-center">
              <FaLock className="w-4 h-4" />
              <p>Locked</p>
            </div>
          </div>
        </div>
      </Tooltip>
    );
  }
  return (
    <div className="relative w-max">
      <span className="blur-xs text-muted">
        <TeamForm form="WDLWW" />
      </span>
      <div className="absolute left-[50%] top-[50%] translate-[-50%]">
        <div className=" flex flex-row gap-1 items-center">
          <FaLock className="w-4 h-4" />
          <p>Locked</p>
        </div>
      </div>
    </div>
  );
}
