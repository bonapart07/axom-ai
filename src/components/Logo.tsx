import Image from "next/image";

export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={`relative flex-shrink-0 overflow-hidden rounded-full ${className}`}>
      <Image
        src="/logo.jpg"
        alt="Axom AI Logo"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover scale-[1.85]"
        priority
      />
    </div>
  );
}
