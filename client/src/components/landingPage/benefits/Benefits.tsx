import { BiMath } from 'react-icons/bi';
import { FaCheckCircle } from 'react-icons/fa';
import { FaBackwardFast, FaLink } from 'react-icons/fa6';

export default function Benefits() {
  return (
    <div className="mb-10 w-full flex flex-row items-center justify-center ">
      <div className="grid grid-rows-3 grid-cols-1 lg:grid-cols-3 lg:grid-rows-1 gap-8  max-w-6xl lg:text-center  ">
        <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 items-center px-4">
          <div className="bg-default/40 p-3 rounded-full">
            <FaLink className="h-6 w-6 lg:h-10 lg:w-10" />
          </div>
          <div>
            <p className="text-lg sm:text-xl lg:text-2xl">
              Viewers explore your league directly
            </p>
            <p className="text-sm sm:text-base text-muted">
              No need to send screenshots or manual updates to your audience
            </p>
          </div>
        </div>
        <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 items-center px-4">
          <div className="bg-default/40 p-3 rounded-full">
            <BiMath className="h-6 w-6 lg:h-10 lg:w-10" />
          </div>
          <div>
            <p className="text-lg sm:text-xl lg:text-2xl">
              No more time wasted calculating top scorers
            </p>
            <p className="text-sm sm:text-base text-muted">
              Stats are calculated automatically as you submit match results
            </p>
          </div>
        </div>
        <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 items-center px-4">
          <div className="bg-default/40 p-4 rounded-full">
            <FaBackwardFast className="h-4 w-4 lg:h-8 lg:w-8" />
          </div>
          <div>
            <p className="text-lg sm:text-xl lg:text-2xl">Re-live the moment</p>
            <p className="text-sm sm:text-base text-muted">
              View match results as they happened. Rewind and explore data from
              previous seasons.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
