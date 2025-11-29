import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  useColorScheme
} from "react-native";
import SyncListButton from "./SynListButton";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Feather";

const ForgetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpsent, setIsOtpsent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);
  const [otpVerified, setOtpVerified] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reNewPassword, setReNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const colorScheme = useColorScheme();

  const ResetPassword = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/fwd`,
        {
          password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );
      if (response.status === 201) {
        setIsLoading(false);
        Alert.alert("Password Reset Successfully");
        router.push("/");
      }
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Something went wrong");
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  const OtpVerify = async () => {
    const enteredOtp = otp.join("");
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/otp-verify`, {
        email: email,
        otp: enteredOtp,
      });
      if (response.status === 200) {
        Alert.alert("OTP Verified Successfully");
        setOtpVerified(true);
        setTempToken(response.data.resetToken);
        setTimeLeft(15 * 60);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Something went wrong");
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred");
      }
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0].focus();
      Keyboard.emit();
    }
  };

  const SendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/auth/otp`, {
        email: email,
      });

      if (response.status === 200) {
        setIsOtpsent(true);
        setTimeLeft(300);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Something went wrong");
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred");
      }
      setEmail("");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const handleChange = (text, index) => {
    if (text.length === 6) {
      const arr = text.split("");
      setOtp(arr);
      inputs.current[5].blur();
      Keyboard.dismiss();
      return;
    }

    if (/^\d$/.test(text)) {
      let newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input
      if (index < 5) {
        inputs.current[index + 1].focus();
      } else {
        inputs.current[5].blur();
        Keyboard.dismiss();
      }
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputs.current[index - 1].focus();
      }

      let newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  return (
    <View style={styles.container}>
      {isOtpsent ? (
        otpVerified ? (
          <View style={{ width: "100%", alignItems: "center" }}>
            <Text style={styles.timerText}>
              Change password within{" "}
              <Text style={styles.timer}>
                {minutes}:{seconds}
              </Text>
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                onChangeText={setNewPassword}
                value={newPassword}
                style={[styles.passwordField]}
                placeholder="Enter your New Password"
                placeholderTextColor={colorScheme==="dark"?"rgba(255, 255, 255, 0.41)":"rgba(0, 0, 0, 0.4)"}
                secureTextEntry={!showPassword}
                editable={!isLoading}
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
            <View style={styles.passwordContainer}>
              <TextInput
                onChangeText={setReNewPassword}
                value={reNewPassword}
                style={[styles.passwordField]}
                placeholder="Re-Enter your New Password"
                secureTextEntry={!showPassword}
                placeholderTextColor={colorScheme==="dark"?"rgba(255, 255, 255, 0.41)":"rgba(0, 0, 0, 0.4)"}
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
              onClick={() => {
                ResetPassword();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size={20} />
              ) : (
                "Change Password"
              )}
            </SyncListButton>
          </View>
        ) : (
          <>
            <Text style={styles.otpSentText}>
              Please check your email({email}) for the OTP code.
            </Text>
            <View style={styles.timeContainer}>
              <Text style={styles.timerText}>
                Your OTP is vaild for{" "}
                <Text style={styles.timer}>
                  {minutes}:{seconds}
                </Text>
              </Text>
            </View>
            <View style={styles.otpCodeSection}>
              {otp.map((value, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={styles.input}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={value}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>
            <SyncListButton
              type="primary"
              style={styles.LoginButton}
              onClick={() => {
                OtpVerify();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" size={20} />
              ) : (
                "Verify OTP"
              )}
            </SyncListButton>

            {timeLeft === 0 ? (
              <Text style={styles.RegisterText}>
                Get a OTP again
                <Text style={styles.RegisterLink} onPress={() => SendOTP()}>
                  Resend OTP
                </Text>
              </Text>
            ) : (
              <Text style={styles.RegisterText}>
                Resend OTP in {minutes}:{seconds}
              </Text>
            )}
          </>
        )
      ) : (
        <>
          <TextInput
            onChangeText={setEmail}
            value={email}
            style={[styles.inputField]}
            placeholder="Enter your Email"
            placeholderTextColor={colorScheme==="dark"?"rgba(255, 255, 255, 0.41)":"rgba(0, 0, 0, 0.4)"}
            editable={!isLoading}
          />
          <SyncListButton
            type="primary"
            style={styles.LoginButton}
            onClick={() => SendOTP()}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size={20} />
            ) : (
              "Send OTP"
            )}
          </SyncListButton>
        </>
      )}

      <Text style={styles.RegisterText}>
        Password remembered?{" "}
        <Text style={styles.RegisterLink} onPress={() => router.push("/")}>
          Login
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
  inputField: {
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
  inputFieldFocused: {
    borderColor: "#59A6D9",
  },
  LoginButton: {
    marginTop: 20,
    width: "90%",
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
  timeContainer: {
    marginBottom: 10,
  },
  timer: {
    fontSize: 16,
    color: "red",
    fontWeight: "bold",
  },
  timerText: {
    fontSize: 16,
    color: "#2A7886",
  },
  otpSentText: {
    fontSize: 13,
    color: "green",
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  otpCodeSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
  },
  input: {
    width: 40,
    height: 45,
    borderWidth: 2,
    borderColor: "#2A7886",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#59A6D9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  eyeIcon: {
    backgroundColor: "#2A7886",
    paddingVertical: 13.2,
    paddingHorizontal: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 2,
    borderColor: "#2A7886",
    marginTop: 20,
  },
  passwordField: {
    width: "90%",
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
});

export default ForgetPasswordForm;
