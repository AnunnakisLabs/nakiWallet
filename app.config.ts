import type { ExpoConfig } from "expo/config";

export default {
	expo: {
		name: "Naki Wallet",
		slug: "naki-wallet",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/images/icon.png",
		scheme: "naki-wallet",
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
						compileSdkVersion: 34,
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
