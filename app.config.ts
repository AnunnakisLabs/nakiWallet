import type { ExpoConfig } from "expo/config";

export default {
	expo: {
		owner: "espaciofuturo",
		name: "Naki",
		slug: "naki",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		scheme: "naki",
		userInterfaceStyle: "automatic",
		splash: {
			image: "./assets/images/splash.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},
		ios: {
			name:
				process.env.APP_ENV === "production"
					? "Naki Wallet"
					: "Naki Wallet (DEV)",
			usesAppleSignIn: true,
			supportsTablet: true,
			bundleIdentifier:
				process.env.APP_ENV === "production"
					? "com.espaciofuturo.nakiwallet"
					: "com.espaciofuturo.nakiwallet-dev",
			associatedDomains: ["webcredentials:<your-associated-domain>"],
			infoPlist: {
				NSAppTransportSecurity: {
					NSAllowsArbitraryLoads: true,
					ITSAppUsesNonExemptEncryption: false,
				},
			},
			appleTeamId: "U7K8WDQ7LT",
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/images/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			package: "com.espaciofuturo.nakiwallet",
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./assets/images/favicon.png",
		},
		extra: {
			privyAppId: "cm6zsggpg00ua6u2xo59pgkdr",
			privyClientId: "client-WY5gK6eKuf4rCFXuTRLQEEv5miEkfTLhoqiMJrt55UUYg",
			passkeyAssociatedDomain: "https://<your-associated-domain>",
			eas: {
				projectId: "8075b53b-fc35-4a73-ad60-e3fa7379f4c0",
			},
		},
		plugins: [
			"expo-router",
			"expo-secure-store",
			"expo-apple-authentication",
			[
				"expo-build-properties",
				{
					ios: {
						deploymentTarget: "17.5",
					},
					android: {
						compileSdkVersion: 35,
					},
				},
			],
			"expo-font",
		],
		experiments: {
			typedRoutes: true,
			newArchEnabled: true,
		},
	} as ExpoConfig,
};
