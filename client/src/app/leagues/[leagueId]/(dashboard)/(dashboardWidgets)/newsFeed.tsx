export default function NewsFeed() {
  return (
    <div className="p-[20px] h- w-full bg-[var(--bg)] rounded-[10px] border-1 border-[var(--border)] flex flex-col gap-2">
      <p className="text-middle align-middle inline">News feed</p>
      <div className="overflow-y-auto max-h-[12rem] flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[10px] text-sm">
          <p className="text-sm font-semibold">MD27</p>
          <p className="text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            🔥 Rare goes top of the table after beating itzsuper 1-0 again
          </p>
          <p className="text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            🧤 Back-to-back cleansheets for Rare (2 games)
          </p>
          <p className="text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            📉 Itzsuper&apos;s title hopes are fading away (gap: 7 pts)
          </p>
        </div>
        <div className="flex flex-col gap-[10px] text-sm">
          <p className="text-sm font-semibold">MD26</p>
          <p className="text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            🔥 Rare goes top of the table after beating itzsuper 1-0 again
          </p>
          <p className="text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            🧤 Back-to-back cleansheets for Rare (2 games)
          </p>
          <p className="text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            📉 Itzsuper&apos;s title hopes are fading away (gap: 7 pts)
          </p>
        </div>
        <div className="flex flex-col gap-[10px] text-sm">
          <p className="text-sm font-semibold">MD25</p>
          <p className="text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            🔥 Rare goes top of the table after beating itzsuper 1-0 again
          </p>
          <p className="text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            🧤 Back-to-back cleansheets for Rare (2 games)
          </p>
          <p className="text-nowrap overflow-ellipsis whitespace-nowrap overflow-hidden">
            📉 Itzsuper&apos;s title hopes are fading away (gap: 7 pts)
          </p>
        </div>
      </div>
    </div>
  );
}
