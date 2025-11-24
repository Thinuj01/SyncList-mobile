import React from "react";
import { useRouter, usePathname } from "expo-router";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import logo from "@/assets/images/SyncList Logo Header.png";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";

const HeaderSection = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isDetailPage = pathname.includes("/list/");
  return (
    <View style={styles.headerSection}>
      <Image source={logo} alt="SyncList Logo" style={styles.imageLogo} />
      {isDetailPage && (
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.replace("/(tabs)")}
        >
          <Ionicons name="arrow-back-outline" size={25} color="#2A7886" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 10,
    backgroundColor: "#2A7886",
  },
  imageLogo: {
    width: 100,
    height: 40,
    marginBottom: 10,
  },
  homeButton: {
    zIndex: 10,
    position: "absolute",
    left: 30,
    top: 63,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 30,
  },
});

export default HeaderSection;
