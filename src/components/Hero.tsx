"use client";

export default function Hero() {
  return (
    <section className="w-full bg-black">
      <video
        src="/showcase/nosotros.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="w-full block"
      />
    </section>
  );
}
