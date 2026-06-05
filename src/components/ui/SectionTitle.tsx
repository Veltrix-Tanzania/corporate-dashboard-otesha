export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3.5 mt-[30px] flex items-center justify-between">
      <h2 className="m-0 font-serif text-lg font-semibold text-ink">{children}</h2>
      {action}
    </div>
  );
}
