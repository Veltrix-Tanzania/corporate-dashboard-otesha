type BadgeKind = "active" | "new" | "warn" | "mut";

const styles: Record<BadgeKind, string> = {
  active: "bg-ok-bg text-ok-ink",
  new: "bg-new-bg text-new-ink",
  warn: "bg-warn-bg text-warn-ink",
  mut: "bg-tile text-muted",
};

export function Badge({ kind = "active", children }: { kind?: BadgeKind; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ${styles[kind]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
