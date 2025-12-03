import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import SyncListButton from "./SynListButton";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_URL } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import Icon from "react-native-vector-icons/Feather";
import { useColorScheme } from "react-native";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { logIn } = useAuth();
  const colorScheme = useColorScheme();

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
        await logIn(
          response.data.token,
          response.data.name,
          response.data.profilePic
        );
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
        placeholderTextColor={colorScheme==="dark"?"rgba(255, 255, 255, 0.41)":"rgba(0, 0, 0, 0.4)"}
        onFocus={() => setIsEmailFocused(true)}
        onBlur={() => setIsEmailFocused(false)}
        editable={!isLoading}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          onChangeText={setPassword}
          value={password}
          style={[
            styles.passwordField,
            isPasswordFocused && styles.emailFieldFocused,
          ]}
          placeholder="Enter your Password"
          placeholderTextColor={colorScheme==="dark"?"rgba(255, 255, 255, 0.41)":"rgba(0, 0, 0, 0.4)"}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
          secureTextEntry={!showPassword}
          editable={!isLoading}
          textContentType="oneTimeCode"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          onPress={() => {
            setShowPassword(!showPassword);
          }}
          style={styles.eyeIcon}
        >
          <Icon
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <SyncListButton
        type="primary"
        style={styles.LoginButton}
        onClick={onLogin}
        disabled={isLoading}
      >
        {isLoading ? <ActivityIndicator color="#FFFFFF" /> : "Login"}
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
    height: 55,
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  passwordField: {
    width: "90%",
    height: 55,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "#2A7886",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    color: "#2A7886",
    marginTop: 20,
    fontSize: 16,
  },
  eyeIcon: {
    height: 55,
    backgroundColor: "#2A7886",
    paddingVertical: 13.2,
    paddingHorizontal: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderColor: "#2A7886",
    marginTop: 20,
  },
});

export default LoginForm;
