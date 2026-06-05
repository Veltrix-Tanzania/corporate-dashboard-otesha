export function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-6 w-[42px] rounded-full border-0 p-[3px] transition-colors ${
        on ? "justify-end bg-[oklch(0.55_0.11_150)]" : "justify-start bg-[#cdd9ce]"
      }`}
    >
      <span className="block h-[18px] w-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,.25)]" />
    </button>
  );
}
