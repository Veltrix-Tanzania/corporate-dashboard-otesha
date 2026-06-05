export function Segmented({
  options,
  value,
  onChange,
  fullWidth = false,
  tileBg = false,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  fullWidth?: boolean;
  tileBg?: boolean;
}) {
  return (
    <div
      className={`inline-flex rounded-full border border-line p-1 ${
        tileBg ? "w-full bg-tile shadow-none" : "bg-card shadow-[var(--shadow)]"
      }`}
    >
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors ${
            fullWidth ? "flex flex-1 justify-center" : ""
          } ${value === o ? "bg-ink text-[#eaf3ec] shadow-[0_2px_8px_-2px_rgba(20,50,40,.4)]" : "text-muted"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
