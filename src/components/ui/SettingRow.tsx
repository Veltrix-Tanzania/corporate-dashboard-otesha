export function SettingRow({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-line px-6 py-4 last:border-b-0">
      <div className="flex-1">
        <b className="text-sm">{title}</b>
        <p className="mt-0.5 text-[12.5px] text-muted">{desc}</p>
      </div>
      <div className="flex-none">{children}</div>
    </div>
  );
}
