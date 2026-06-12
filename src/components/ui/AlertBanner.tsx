import { ChevronRight, Satellite } from "lucide-react";
import type { Alert } from "@/lib/types";
import { Badge } from "./Badge";
import { Button } from "./Button";

export function AlertBanner({ alert, onView }: { alert: Alert; onView: () => void }) {
  return (
    <div className="fade-in flex overflow-hidden rounded-[var(--r-lg)] border border-[rgba(20,50,40,.07)] bg-card shadow-[var(--shadow)]">
      <div className="w-[5px] flex-none bg-gold" />
      <div className="flex min-w-0 flex-1 items-center gap-4 p-4">
        <div className="grid h-10 w-10 flex-none place-items-center rounded-[var(--r-sm)] bg-warn-bg text-warn-ink">
          <Satellite size={20} strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <b className="text-sm">{alert.title}</b>
          <p className="mt-0.5 text-[13px] text-muted">{alert.body}</p>
        </div>
        <div className="ml-auto flex flex-none items-center gap-2.5">
          <Badge kind="new">{alert.time}</Badge>
          <Button variant="primary" size="sm" onClick={onView}>
            View report <ChevronRight size={15} strokeWidth={2.2} />
          </Button>
        </div>
      </div>
    </div>
  );
}
