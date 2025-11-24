import React, { useState } from "react";
import { StyleSheet, TextInput, View, Text, Alert } from "react-native";
import SyncListButton from "./SynListButton";
import axios from 'axios';
import { useRouter } from "expo-router";
import { API_URL } from "@/constants/api";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const onRegister = async () => {
    if (!email || !password || !rePassword || !username ) {
        Alert.alert('Please fill all required feilds');
        return;
    }

    if(password !== rePassword){
        Alert.alert('Passwords mismatched');
        return;
    }
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            email: email,
            password: password,
            username: username
        });
        if(response.status === 201){
            Alert.alert('Successfully Registered');      
            router.push('/');
        }
    } catch (err : unknown) {
        if (axios.isAxiosError(err)) {
            alert(err.response?.data?.message || "Something went wrong");
          } else if (err instanceof Error) {
            alert(err.message);
          } else {
            alert("An unexpected error occurred");
          }
    }
};

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setUsername}
        value={username}
        style={[styles.emailField, isFocused && styles.emailFieldFocused]}
        placeholder="Enter your Username"
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <TextInput
        onChangeText={setEmail}
        value={email}
        style={[styles.emailField, isFocused && styles.emailFieldFocused]}
        placeholder="Enter your Email"
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        style={[styles.emailField, isFocused && styles.emailFieldFocused]}
        placeholder="Enter your Password"
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={true} 
      />
      <TextInput
        onChangeText={setRePassword}
        value={rePassword}
        style={[styles.emailField, isFocused && styles.emailFieldFocused]}
        placeholder="Re-Enter Password"
        placeholderTextColor="rgba(0, 0, 0, 0.4)"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        secureTextEntry={true} 
      />
      <SyncListButton
        type="primary"
        style = {styles.LoginButton}
        onClick= {onRegister}
      >
        Register
      </SyncListButton>

      <Text style={styles.RegisterText}>Already Registered? <Text style={styles.RegisterLink} onPress={()=>router.push('/')}>Login</Text></Text>
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
    marginTop:20,
    fontSize:16
  },
  emailFieldFocused: {
    borderColor: "#59A6D9",
  },
  LoginButton:{
    width: '90%',
    marginTop:20,
  },
  RegisterText:{
    marginTop:20,
    fontSize:13,
    color: '#59A6D9'
  },
  RegisterLink:{
    marginTop:20,
    fontSize:13,
    color: '#2A7886'
  },
});

export default RegisterForm;
