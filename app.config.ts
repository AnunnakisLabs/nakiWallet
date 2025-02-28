import type { ExpoConfig } from "expo/config";

export default {
	expo: {
		owner: "AnunnakisLabs",
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
					? "com.AnunnakisLabs.nakiwallet"
					: "com.AnunnakisLabs.nakiwallet-dev",
		//	associatedDomains: ["webcredentials:<your-associated-domain>"],
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
			package: "com.AnunnakisLabs.nakiwallet",
		},
		web: {
			bundler: "metro",
			output: "static",
			favicon: "./assets/images/favicon.png",
		},
		extra: {
			privyAppId: "cm6sgz17600cb18huow3yic6b",
			privyClientId: "client-WY5gHgkYG4YMwg5Stuao8ZQWdhVkhWwRbJSdeE9UVQhU2",
			//passkeyAssociatedDomain: "https://<your-associated-domain>",
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
			[
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera to scan QR codes."
        }
      ],
      [
        "expo-barcode-scanner",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera to scan QR codes."
        }
      ]
		],
		
		experiments: {
			typedRoutes: true,
			newArchEnabled: true,
		},
	} as ExpoConfig,
};
