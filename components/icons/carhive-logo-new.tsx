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
      alt="CarHive"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
