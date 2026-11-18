import { cn, getAvatarTone, getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  seed?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-16 w-16 text-lg",
};

export function Avatar({ name, seed, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
        getAvatarTone(seed ?? name),
        sizeClasses[size],
        className
      )}
    >
      <span className="font-[family-name:var(--font-display)] font-semibold">
        {getInitials(name)}
      </span>
    </div>
  );
}
