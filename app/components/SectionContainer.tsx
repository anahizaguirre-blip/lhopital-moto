// app/components/SectionContainer.tsx
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  bg?: string;            // ej: "bg-moto-black" o "bg-hedon-brown"
  className?: string;     // override puntual si lo necesitas
  isLast?: boolean;       // true en la última sección antes de un cierre diferente
};

export default function SectionContainer({
  children,
  bg = "bg-moto-black",
  className = "",
  isLast = false,
}: Props) {
  const padding = isLast
    ? "pt-16 md:pt-20 pb-24 md:pb-32"
    : "pt-16 md:pt-20 pb-0";

  return (
    <section className={`${bg} ${padding} ${className}`}>
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {children}
      </div>
    </section>
  );
}