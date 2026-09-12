import Image from "next/image";

interface CarhiveLogoNewProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function CarhiveLogoNew({
  width = 356,
  height = 252,
  className,
  priority = false,
}: CarhiveLogoNewProps) {
  return (
    <Image
      src="/logo.svg"
      alt="Golden Exotics"
      width={width}
      height={height}
      className={["brightness-0 dark:brightness-100", className]
        .filter(Boolean)
        .join(" ")}
      priority={priority}
    />
  );
}
