"use client";

import Image from "next/image";
import Link from "next/link";

const partners = [
	{
		name: "Trelleborg",
		src: "/partners/trelleborg-logo.webp",
		href: "/hazmat",
	},
	{
		name: "Res-Q-Jack",
		src: "/partners/resqjay-logo.webp",
		href: "/rescate",
		containerClass: "relative w-56 h-24",
	},
	{
		name: "PGI",
		src: "/partners/PGI-new-logo.webp",
		href: "/proteccion-personal",
	},
	{
		name: "HexArmor",
		src: "/partners/HexArmor_navy.webp",
		href: "/proteccion-personal",
	},
];


export default function Partners() {
	return (
		<section className="py-12 px-4 bg-[#FAF9F6] text-[#172E6E]">
			<h2 className="text-3xl font-semibold text-center mb-8">
				Nuestros Socios
			</h2>
			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 items-center justify-items-center">
				{partners.map((partner, index) => (
					<Link key={index} href={partner.href} passHref>
						<div key={index} className={partner.containerClass ?? "relative w-32 h-16"}>
							<Image
								src={partner.src}
								alt={partner.name}
								fill
								unoptimized
								className="object-contain"
								sizes="(max-width: 768px) 50vw, 150px"
							/>
						</div>
					</Link>
				))}
			</div>
		</section>
	);
}
