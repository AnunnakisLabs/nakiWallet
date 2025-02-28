import { SafeAreaView, Text, View, ActivityIndicator } from "react-native";
import Constants from "expo-constants";
import { LoginScreen } from "@/components/LoginScreen";
import { usePrivy } from "@privy-io/expo";
import { Redirect } from 'expo-router';

export default function Index() {
    const { user, isReady } = usePrivy();
    
    // Validar configuración de Privy
    if ((Constants.expoConfig?.extra?.privyAppId as string).length !== 25) {
        return (
            <SafeAreaView>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text>You have not set a valid `privyAppId` in app.json</Text>
                </View>
            </SafeAreaView>
        );
    }
    
    if (!(Constants.expoConfig?.extra?.privyClientId as string).startsWith("client-")) {
        return (
            <SafeAreaView>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text>You have not set a valid `privyClientId` in app.json</Text>
                </View>
            </SafeAreaView>
        );
    }
    
    // Mostrar indicador de carga mientras Privy inicializa
    if (!isReady) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#8134AF" />
            </SafeAreaView>
        );
    }
    
    // Si el usuario está autenticado, ir a la aplicación
    // Si no, mostrar la pantalla de login
    return user ? <Redirect href="/(tabs)" /> : <LoginScreen />;
}
