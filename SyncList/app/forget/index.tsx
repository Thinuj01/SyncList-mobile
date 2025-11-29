import React from "react";
import logo from "@/assets/images/SyncList Logo.png";
import { StyleSheet, View, Text, Image } from "react-native";
import ForgetPasswordForm from "@/components/ForgetPasswordForm";
import ThemedView from "@/components/ThemedView";

const ForgetPasswordScreen = () => {
  return (
    <ThemedView style={styles.container}>
      <Image source={logo} alt="SyncList Logo" style={styles.imageLogo} />
      <Text style={styles.title}>Password change</Text>
      <ForgetPasswordForm />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageLogo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2A7886",
    marginBottom: 10,
  },
});

export default ForgetPasswordScreen;
