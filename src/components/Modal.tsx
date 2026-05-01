"use client";

import { useEffect } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="flex min-h-screen items-center justify-center p-4">
				{/* Backdrop */}
				<div
					className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
					onClick={onClose}
				/>

				{/* Modal content */}
				<div className="relative bg-white w-full max-w-2xl p-6 shadow-xl">
					{/* Close button */}
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
					>
						<span className="sr-only">Close</span>
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>

					{/* Subtitle */}
					<div className="mb-6">
						<h2 className="text-2xl font-bold text-gray-900">Contáctenos</h2>
						<p className="text-gray-600 mt-2 text-base leading-relaxed">
							Estamos aquí para ayudarte. Completa el siguiente formulario y uno
							de nuestros especialistas te contactará a la brevedad.
						</p>
					</div>

					{/* Modal body */}
					<div>{children}</div>
				</div>
			</div>
		</div>
	);
}
