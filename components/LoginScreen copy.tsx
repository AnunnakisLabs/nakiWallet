import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLoginWithEmail } from "@privy-io/expo";

export default function LoginScreen() {
	const [email, setEmail] = useState("");
	const [code, setCode] = useState("");
	const { state, sendCode, loginWithCode } = useLoginWithEmail({
		onSendCodeSuccess({ email }) {
			console.log(`OTP sent to ${email}`);
		},
		onLoginSuccess(user, isNewUser) {
			console.log(
				`User logged in: ${user.linked_accounts.find((account) => account.type === "email")?.address}, New User: ${isNewUser}`,
			);
		},
		onError(error) {
			console.error("Error during login flow:", error);
		},
	});

	return (
		<View style={styles.container}>
			<View>
				<Text style={styles.title}>Naki</Text>
			</View>

			{state.status === "initial" || state.status === "sending-code" ? (
				<>
					<TextInput
						value={email}
						onChangeText={setEmail}
						placeholder="Email"
						placeholderTextColor="#ccc"
						style={styles.input}
						inputMode="email"
					/>
					<TouchableOpacity
						style={styles.button}
						disabled={state.status === "sending-code"}
						onPress={() => sendCode({ email })}
					>
						<FontAwesome name="envelope" size={24} color="black" />
						<Text style={styles.buttonText}>Send Code</Text>
					</TouchableOpacity>
					{state.status === "sending-code" && (
						<Text style={styles.infoText}>Sending Code...</Text>
					)}
				</>
			) : (
				<>
					<TextInput
						value={code}
						onChangeText={setCode}
						placeholder="Code"
						placeholderTextColor="#ccc"
						style={styles.input}
						inputMode="numeric"
					/>
					<TouchableOpacity
						style={styles.button}
						disabled={state.status !== "awaiting-code-input"}
						onPress={() => loginWithCode({ code, email })}
					>
						<FontAwesome name="key" size={24} color="black" />
						<Text style={styles.buttonText}>Login</Text>
					</TouchableOpacity>
					{state.status === "submitting-code" && (
						<Text style={styles.infoText}>Logging in...</Text>
					)}
				</>
			)}

			{state.status === "error" && (
				<>
					<Text style={{ color: "red" }}>There was an error</Text>
					<Text style={{ color: "lightred" }}>{state.error.message}</Text>
				</>
			)}

			<Text style={styles.orText}>Or</Text>

			<TouchableOpacity style={styles.button}>
				<FontAwesome name="apple" size={24} color="black" />
				<Text style={styles.buttonText}>Continue with Apple</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.button}>
				<FontAwesome name="google" size={24} color="black" />
				<Text style={styles.buttonText}>Continue with Google</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#1a1a1a",
		alignItems: "center",
		justifyContent: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
		padding: 80,
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#32CD32",
		padding: 15,
		borderRadius: 10,
		marginTop: 10,
		width: "100%",
		justifyContent: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		marginLeft: 10,
	},
	orText: {
		color: "#fff",
		marginVertical: 10,
		marginTop: 20,
	},
	input: {
		width: "100%",
		padding: 10,
		marginVertical: 10,
		backgroundColor: "#333",
		color: "#fff",
		borderRadius: 5,
	},
	infoText: {
		color: "#fff",
		marginVertical: 5,
	},
});
