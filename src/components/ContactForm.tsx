"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";

type FormInputs = {
	name: string;
	email: string;
	phone: string;
	subject?: string;
	message: string;
	extra_field?: string;
};

const validationRules = {
	name: {
		required: "Nombre requerido",
	},
	email: {
		required: "Por favor proporcione un correo de contacto",
		pattern: {
			value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			message: "Correo inválido",
		},
	},
	phone: {
		required: "Por favor proporcione un teléfono de contacto",
		pattern: {
			value: /^\+?\d{10,14}$/,
			message: "Teléfono inválido",
		},
	},
	message: {
		required: "Menciona tu producto de interés",
	},
};

export default function ContactoForm() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting, isValid },
		reset,
	} = useForm<FormInputs>({
		mode: "onChange",
		criteriaMode: "firstError",
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			subject: "",
			message: "",
			extra_field: "",
		},
	});

	const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
	const [error, setError] = useState<string | null>(null);

	const onSubmit = async (data: FormInputs) => {
		setStatus("idle");
		setError(null);

		const res = await fetch("/api/contact", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});

		const result = await res.json();

		if (res.ok) {
			setStatus("success");
			reset();
		} else {
			setStatus("error");
			setError(result.message || "Error al enviar el mensaje.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="max-w-2xl mx-auto space-y-6 text-black text-base"
		>
			<div className="flex flex-col">
				<label htmlFor="name" className="mb-2 font-semibold">
					Nombre*
				</label>
				<input
					{...register("name", validationRules.name)}
					type="text"
					placeholder="Chief Red Adair"
					className="px-4 py-3 border border-gray-300 bg-white"
				/>
				{errors.name && <p className="text-red-600">{errors.name.message}</p>}
			</div>

			<div className="flex flex-col">
				<label htmlFor="email" className="mb-2 font-semibold">
					Correo electrónico*
				</label>
				<input
					{...register("email", validationRules.email)}
					type="email"
					placeholder="red.adair@flamefighters.org"
					className="px-4 py-3 border border-gray-300 bg-white"
				/>
				{errors.email && <p className="text-red-600">{errors.email.message}</p>}
			</div>

			<div className="flex flex-col">
				<label htmlFor="phone" className="mb-2 font-semibold">
					Teléfono*
				</label>
				<input
					{...register("phone", validationRules.phone)}
					type="tel"
					placeholder="123 456 7890"
					className="px-4 py-3 border border-gray-300 bg-white"
				/>
				{errors.phone && <p className="text-red-600">{errors.phone.message}</p>}
			</div>

			<div className="flex flex-col">
				<label htmlFor="subject" className="mb-2 font-semibold">
					Asunto (opcional)
				</label>
				<input
					{...register("subject")}
					type="text"
					placeholder="Consulta sobre servicios"
					className="px-4 py-3 border border-gray-300 bg-white"
				/>
			</div>

			<div className="flex flex-col">
				<label htmlFor="message" className="mb-2 font-semibold">
					Mensaje*
				</label>
				<textarea
					{...register("message", validationRules.message)}
					rows={6}
					placeholder="Escribe tu mensaje aquí..."
					className="px-4 py-3 border border-gray-300 bg-white resize-none"
				/>
				{errors.message && (
					<p className="text-red-600">{errors.message.message}</p>
				)}
			</div>

			{/* Honeypot field */}
			<input
				type="text"
				{...register("extra_field")}
				className="hidden"
				tabIndex={-1}
				autoComplete="off"
			/>

			<button
				type="submit"
				disabled={!isValid || isSubmitting}
				className={`w-full font-bold py-4 tracking-wide uppercase transition
		        ${
			        !isValid || isSubmitting
			        	? "bg-gray-300 text-gray-600 cursor-not-allowed"
			        	: "bg-[#b01f29] text-white hover:bg-[#911820]"
		        }`}
			>
				{isSubmitting ? "Enviando..." : "Enviar mensaje"}
			</button>

			{status === "success" && (
				<p className="text-green-600 text-center font-medium">
					¡Mensaje enviado correctamente!
				</p>
			)}
			{status === "error" && (
				<p className="text-red-600 text-center font-medium">{error}</p>
			)}
		</form>
	);
}
