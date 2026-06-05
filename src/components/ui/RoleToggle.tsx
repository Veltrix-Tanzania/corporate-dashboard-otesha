import { Briefcase, HardHat } from "lucide-react";
import type { Role } from "@/lib/types";

export function RoleToggle({ role, setRole }: { role: Role; setRole: (r: Role) => void }) {
  return (
    <div
      className="inline-flex rounded-full border border-line bg-card p-1 shadow-[var(--shadow)]"
      role="tablist"
      aria-label="View as"
    >
      <button
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
          role === "manager" ? "bg-ink text-[#eaf3ec] shadow-[0_2px_8px_-2px_rgba(20,50,40,.4)]" : "text-muted"
        }`}
        onClick={() => setRole("manager")}
      >
        <HardHat size={16} strokeWidth={1.9} />
        Sustainability Manager
      </button>
      <button
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
          role === "exec" ? "bg-ink text-[#eaf3ec] shadow-[0_2px_8px_-2px_rgba(20,50,40,.4)]" : "text-muted"
        }`}
        onClick={() => setRole("exec")}
      >
        <Briefcase size={15} strokeWidth={1.9} />
        Decision Maker
      </button>
    </div>
  );
}
