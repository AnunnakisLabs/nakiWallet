import Constants from "expo-constants";
import "@/global.css";
import { GluestackUIProvider } from "@/components/gluestack-ui/gluestack-ui-provider";
import { Stack } from "expo-router";
import { PrivyProvider, PrivyElements } from "@privy-io/expo";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";

export default function RootLayout() {
	useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
	});
	return (
		<GluestackUIProvider mode="light">
			<PrivyProvider
				appId={Constants.expoConfig?.extra?.privyAppId}
				clientId={Constants.expoConfig?.extra?.privyClientId}
			>
				<Stack>
					<Stack.Screen name="index" options={{ headerShown: false }} />
				</Stack>
				<PrivyElements />
			</PrivyProvider>
		</GluestackUIProvider>
	);
}
