import Image from "next/image";
import { BRAND_LOGO_ALT, BRAND_LOGO_PATH } from "@/lib/brand";
import { cn } from "@/lib/cn";

export function BrandLogo({
  size = 40,
  className,
  priority = false,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={BRAND_LOGO_PATH}
      alt={BRAND_LOGO_ALT}
      width={size}
      height={size}
      priority={priority}
      className={cn("rounded-xl object-cover", className)}
    />
  );
}
