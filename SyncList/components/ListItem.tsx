import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

type ListItemProps = {
  id: string;
  name: string;
  setDeleteModelVisibility: (visible: boolean) => void;
  setSelectedDeleteItemId: (visible: string) => void;
  joined: boolean;
};

const ListItem: React.FC<ListItemProps> = ({
  id,
  name,
  setDeleteModelVisibility,
  setSelectedDeleteItemId,
  joined
}) => {
  return (
    <View style={styles.listItem}>
      <Text style={styles.listText}>{name}</Text>
      {joined !== true &&
        <TouchableOpacity
        onPress={() => {
          setDeleteModelVisibility(true);
          setSelectedDeleteItemId(id);
        }}
      >
        <MaterialIcons name="delete-forever" size={24} color="rgb(166, 2, 2)" />
      </TouchableOpacity>
      }
      
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: "#2A7886",
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  listText: {
    fontSize: 18,
    color: "#2A7886",
  },
});

export default ListItem;
