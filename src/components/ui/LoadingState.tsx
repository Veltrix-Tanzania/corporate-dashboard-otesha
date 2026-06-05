export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-green-deep" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
