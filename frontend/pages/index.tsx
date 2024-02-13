import React from "react";
import Head from "next/head";
import ReCAPTCHA from "react-google-recaptcha";

import type { NextPage } from "next";

const Home: NextPage = () => {
	const [formData, setFormData] = React.useState({
		name: "Sheldon Cooper",
		password: "ILovePhysics",
		confirmPassword: "ILovePhysics",
		email: "sheldoncopper@bigbangthoery.com",
	});

	const reCaptchaRef = React.useRef<ReCAPTCHA>(null);

	const [isLoading, setIsLoading] = React.useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);

		if (formData.password !== formData.confirmPassword) {
			window.alert("Passwords do not match");
			setIsLoading(false);
			return;
		}

		if (!reCaptchaRef.current) {
			window.alert("An error occurred, try refreshing the page");
			setIsLoading(false);
			return;
		}

		const googleReCaptchaToken = await reCaptchaRef.current.executeAsync();
		reCaptchaRef.current.reset(); // reset for use in future requests

		fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ ...formData, googleReCaptchaToken }),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				window.alert(data.message);

				setIsLoading(false);
				setFormData({ name: "", email: "", password: "", confirmPassword: "" });
			})
			.catch((err) => {
				console.error(err);
				window.alert("An error occurred, check console for more details");

				setIsLoading(false);
			});
	}

	return (
		<>
			<Head>
				<title>Google Re-Captcha Demo</title>
				<meta name="description" content="Google Re-Captcha Demo" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="font-Montserrat my-12">
				<h1 className="text-3xl text-center font-bold tracking-wide mb-3 text-primary">Google Re-Captcha Demo</h1>
				<h3 className="text-2xl text-center font-bold">Sign-up</h3>

				<form className="flex flex-col items-center mt-8" onSubmit={handleSubmit}>
					<div className="flex flex-col w-96 mb-4">
						<label htmlFor="name" className="text-sm font-semibold mb-1">Name</label>
						<input
							type="text"
							name="name"
							id="name"
							className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary"
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						/>
					</div>

					<div className="flex flex-col w-96 mb-4">
						<label htmlFor="email" className="text-sm font-semibold mb-1">Email</label>
						<input
							type="email"
							name="email"
							id="email"
							className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary"
							value={formData.email}
							onChange={(e) => setFormData({ ...formData, email: e.target.value })}
						/>
					</div>

					<div className="flex flex-col w-96 mb-4">
						<label htmlFor="password" className="text-sm font-semibold mb-1">Password</label>
						<input
							type="password"
							name="password"
							id="password"
							className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary"
							value={formData.password}
							onChange={(e) => setFormData({ ...formData, password: e.target.value })}
						/>
					</div>

					<div className="flex flex-col w-96 mb-4">
						<label htmlFor="confirmPassword" className="text-sm font-semibold mb-1">Confirm Password</label>
						<input
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							className="border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-primary"
							value={formData.confirmPassword}
							onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
						/>
					</div>

					<ReCAPTCHA 
						size="invisible"
						ref={reCaptchaRef}
						sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
					/>

					<div className="w-96">
						<button
							type="submit"
							disabled={isLoading}
							className="bg-primary text-white py-2 rounded-md w-full focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-300"
						>
							{isLoading ? "Loading..." : "Sign-up"}
						</button>
					</div>
				</form>
			</div>
		</>
	);
};

export default Home;
