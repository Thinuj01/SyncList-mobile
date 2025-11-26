import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native"; // Added Pressable
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Swipeable } from "react-native-gesture-handler"; // Import Swipeable

type ListItemProps = {
  id: string;
  name: string;
  setDeleteModelVisibility: (visible: boolean) => void;
  setSelectedDeleteItemId: (visible: string) => void;
  joined: boolean;
  onPress: () => void;
};

const ListItem: React.FC<ListItemProps> = ({
  id,
  name,
  setDeleteModelVisibility,
  setSelectedDeleteItemId,
  joined,
  onPress,
}) => {
  // 1. Function to render the swipe action button
  const renderRightActions = () => {
    // We only allow deleting lists that are NOT joined (i.e., lists the user owns).
    if (joined) {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.deleteSwipeAction}
        onPress={() => {
          // 2. Call the delete modal logic when the user taps the red area
          setDeleteModelVisibility(true);
          setSelectedDeleteItemId(id);
        }}
      >
        <MaterialIcons name="delete-forever" size={25} color="white" />
        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      rightThreshold={40}
    >
      <Pressable onPress={onPress} style={styles.listItem}>
        <Text style={styles.listText}>{name}</Text>

        {joined && <Text style={styles.joinedLabel}>Joined</Text>}
      </Pressable>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: "#2A7886",
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listText: {
    fontSize: 18,
    color: "#2A7886",
  },
  joinedLabel: {
    fontSize: 14,
    color: "gray",
    fontStyle: "italic",
  },
  deleteSwipeAction: {
    backgroundColor: "rgb(166, 2, 2)",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "80%",
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteActionText: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
});

export default ListItem;
