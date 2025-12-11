import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import { useRouter } from "expo-router";

const InsideHeader = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  return (
    <View style={styles.headerSection}>
      <TouchableOpacity
        style={
          colorScheme === "dark"
            ? { ...styles.homeButton, backgroundColor: "rgb(19, 25, 39)" }
            : { ...styles.homeButton, backgroundColor: "rgb(240,240,240)" }
        }
        onPress={() => router.replace("/(tabs)")}
      >
        <Ionicons name="arrow-back-outline" size={25} color="#2A7886" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 35,
  },
  homeButton: {
    marginLeft: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 30,
  },
});

export default InsideHeader;
