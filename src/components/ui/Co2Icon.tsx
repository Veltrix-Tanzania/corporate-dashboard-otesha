export function Co2Icon({ size = 18, strokeWidth = 2 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5A2.5 2.5 0 1 0 9 14M15.5 9.5h-1.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-1.5" />
    </svg>
  );
}
