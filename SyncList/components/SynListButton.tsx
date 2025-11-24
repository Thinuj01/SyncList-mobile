import React from "react";
import { StyleSheet, TouchableOpacity, Text, ViewStyle, StyleProp } from "react-native";

type SyncListButtonProps = {
  type: "primary" | "outline";
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onClick: () => void;
  disabled: boolean;
};

const SyncListButton: React.FC<SyncListButtonProps> = ({ type, children, style,onClick, disabled }) => {
  return (
    <TouchableOpacity
      style={[
        type === "primary" ? styles.primaryBtn : styles.outlineBtn,
        style,
      ]}
      onPress={onClick}
      disabled={disabled}
    >
      <Text style={type === "primary" ? styles.primaryText : styles.outlineText}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: "#2A7886",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  outlineBtn: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#2A7886",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  primaryText: {
    color: "#fff",
    fontWeight: "bold",
  },
  outlineText: {
    color: "#2A7886",
    fontWeight: "bold",
  },
});

export default SyncListButton;
