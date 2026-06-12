export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3.5 mt-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <span className="h-4 w-0.75 flex-none rounded-full bg-[oklch(0.55_0.13_150)]" />
        <h2 className="m-0 font-serif text-[17px] font-semibold text-ink">{children}</h2>
      </div>
      {action}
    </div>
  );
}
