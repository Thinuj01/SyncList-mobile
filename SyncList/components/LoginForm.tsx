import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import SyncListButton from "./SynListButton";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_URL } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { logIn } = useAuth();

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email: email,
        password: password,
      });

      if (response.data.token) {
        await logIn(response.data.token, response.data.name, response.data.profilePic);
        console.log("Logged: " + response.data.profilePic);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Something went wrong");
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setEmail}
        value={email}
        style={[styles.emailField, isEmailFocused && styles.emailFieldFocused]}
        placeholder="Enter your Email"
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
        editable={!isLoading}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        style={[
          styles.emailField,
          isPasswordFocused && styles.emailFieldFocused,
        ]}
        placeholder="Enter your Password"
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        onFocus={() => setIsPasswordFocused(true)}
        onBlur={() => setIsPasswordFocused(false)}
        secureTextEntry={true}
        editable={!isLoading}
      />
      <SyncListButton
        type="primary"
        style={styles.LoginButton}
        onClick={onLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          "Login"
        )}
      </SyncListButton>

      <Text style={styles.RegisterText}>
        Not Registred yet?{" "}
        <Text
          style={styles.RegisterLink}
          onPress={isLoading ? undefined : () => router.push("/register")} 
        >
          Register
        </Text>
      </Text>
      <Text style={styles.RegisterText}>
        Forget Password?{" "}
        <Text
          style={styles.RegisterLink}
          onPress={isLoading ? undefined : () => router.push("/forget")} 
        >
          Change
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 350,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  emailField: {
    width: "90%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "#2A7886",
    borderRadius: 10,
    color: "#2A7886",
    marginTop: 20,
    fontSize: 16,
  },
  emailFieldFocused: {
    borderColor: "#59A6D9",
  },
  LoginButton: {
    width: "90%",
    marginTop: 20,
  },
  RegisterText: {
    marginTop: 20,
    fontSize: 13,
    color: "#59A6D9",
  },
  RegisterLink: {
    marginTop: 20,
    fontSize: 13,
    color: "#2A7886",
  },
});

export default LoginForm;