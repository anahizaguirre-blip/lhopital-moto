"use client";

import React, { useState, useEffect, useRef } from "react";

export interface CatalogOption {
	label: string;
	file: string;
}

interface CTAButtonProps {
	onClick?: () => void;
	children: React.ReactNode;
	hovered?: boolean;
	catalogOptions?: CatalogOption[];
}

export default function CTAButton({
	onClick,
	children,
	hovered = false,
	catalogOptions = [],
}: CTAButtonProps) {
	const isCatalogButton = catalogOptions.length > 0;
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

const handleCatalogClick = (file: string) => {
	window.open(file, "_blank");
	setOpen(false);
};


	const handleClick = () => {
		if (isCatalogButton) {
			if (catalogOptions.length === 1) {
				handleCatalogClick(catalogOptions[0].file);
			} else {
				setOpen(!open);
			}
		} else if (onClick) {
			onClick();
		}
	};

	useEffect(() => {
		const handleOutsideClick = (e: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener("mousedown", handleOutsideClick);
		} else {
			document.removeEventListener("mousedown", handleOutsideClick);
		}

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [open]);

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				onClick={handleClick}
				className={`relative px-4 py-2 text-white font-light text-xl overflow-hidden z-0
                    before:absolute before:inset-0
                    before:bg-gradient-to-r before:from-[#172E6E] before:to-[#B2202C]
                    before:opacity-0
                    before:transition-opacity before:duration-500 before:z-[-1]
                    ${
						hovered
							? "before:opacity-100"
							: "hover:before:opacity-100"
					}
                    `}
				style={{
					background: "transparent",
					border: "1px solid transparent",
					borderImage: "linear-gradient(263deg, #B2202C 50%, #172E6E 100%)",
					borderImageSlice: 1,
				}}
			>
				<span className="relative z-10">{children}</span>
			</button>

			{catalogOptions.length > 1 && (
				<div
					className={`absolute top-full left-0 bg-white text-[#172E6E] shadow-md
                        z-50 w-52 rounded overflow-hidden transition-all duration-300 origin-top transform
                        ${
				            open
				            	? "scale-y-100 opacity-100"
				            	: "scale-y-0 opacity-0 pointer-events-none"
			            }
                    `}
				>
					{catalogOptions.map((option) => (
						<button
							key={option.file}
							onClick={() => handleCatalogClick(option.file)}
							className="w-full px-4 py-2 text-left hover:bg-[#F2F2F2] transition-colors text-sm"
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
