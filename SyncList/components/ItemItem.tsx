import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import ThemedView from "./ThemedView";
import { useColorScheme } from "react-native";

type ItemItemProps = {
  id: string;
  owner: string;
  item: {
    _id: string;
    itemName: string;
    isClaimed: boolean;
    claimedBy: {
      _id: string;
      username: string;
      profilePictureUrl: string;
    };
  };

  setDeleteModelVisibility: (visible: boolean) => void;
  setSelectedDeleteItemId: (visible: string) => void;
  itemClaiming: (visible: string) => void;
};

type DecodedToken = {
  userId: string;
};

const ItemItem: React.FC<ItemItemProps> = ({
  id,
  item,
  setDeleteModelVisibility,
  setSelectedDeleteItemId,
  itemClaiming,
  owner,
}) => {
  const [isClaimLoading, setIsClaimLoading] = useState(false);
  const { token } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    } else {
      setUserId(null);
    }
  }, [token]);

  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.deleteSwipeAction}
        onPress={() => {
          // This calls the confirmation modal logic
          setDeleteModelVisibility(true);
          setSelectedDeleteItemId(id);
        }}
      >
        <MaterialIcons name="delete-forever" size={30} color="white" />
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
      <ThemedView style={colorScheme==='dark'?{...styles.listItemContainer}:{...styles.listItemContainer, backgroundColor: 'rgb(240,240,240)'}}>
        <ThemedView style={colorScheme==='dark'?{...styles.listItem}:{...styles.listItem, backgroundColor: 'rgb(240,240,240)'}}>
          <Text style={colorScheme=='dark'?{...styles.listText, color: '#FAFAFA'}:{...styles.listText}}>{item.itemName}</Text>
          {item.isClaimed ? (
            userId === item.claimedBy._id ? (
              <TouchableOpacity
                disabled={isClaimLoading}
                style={[styles.claimButton, styles.unclaimButton, isClaimLoading && { opacity: 0.6 }]}
                onPress={async () => {
                  try {
                    setIsClaimLoading(true);
                    await itemClaiming(id);
                  } finally {
                    setIsClaimLoading(false);
                  }
                }}
              >
                {isClaimLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.claimButtonText}>unclaim</Text>
                )}
              </TouchableOpacity>
            ) : (
              // Display Claimed status by another user
              <Text style={colorScheme==='dark'?{...styles.claimedText,color:'#2A7886'}:styles.claimedText}>Claimed</Text>
            )
          ) : (
            // Item is NOT claimed
            <TouchableOpacity
              disabled={isClaimLoading}
              style={[styles.claimButton, styles.claimActiveButton, isClaimLoading && { opacity: 0.6 }]}
              onPress={async () => {
                try {
                  setIsClaimLoading(true);
                  await itemClaiming(id);
                } finally {
                  setIsClaimLoading(false);
                }
              }}
            >
              {isClaimLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.claimButtonText}>claim</Text>
              )}
            </TouchableOpacity>
          )}

        </ThemedView>
        {item.isClaimed &&
          (userId === item.claimedBy._id ? (
            <Text style={colorScheme==='dark'?{...styles.claimedByMeText,color:'#2A7886'}:styles.claimedByMeText}>Claimed by me</Text>
          ) : (
            <ThemedView style={ colorScheme==='dark'? {...styles.listClaimedByContainer}: {...styles.listClaimedByContainer,backgroundColor: "rgb(240,240,240)"}}>
              <ThemedView style={styles.avatarContainer}>
                {item.claimedBy.profilePictureUrl ? (
                  <Image
                    source={{ uri: item.claimedBy.profilePictureUrl }}
                    style={styles.avatar}
                  />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={20}
                    color="#2A7886"
                  />
                )}
              </ThemedView>
              <Text style={styles.claimedByUsername}>
                {item.claimedBy.username}
              </Text>
            </ThemedView>
          ))}
      </ThemedView>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: "#2A7886",
    marginBottom: 10,
    borderRadius: 8,
    minHeight: 60,
  },
  listItem: {
    width: "100%", 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listText: {
    fontSize: 15,
    color: "#2A7886",
    maxWidth: '55%', // Constraint text size for better layout
  },
  claimButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  claimActiveButton: {
    backgroundColor: "#2A7886",
  },
  unclaimButton: {
    backgroundColor: '#D9534F', // Red for unclaiming
  },
  claimButtonText: {
    color: "white",
    fontSize: 13,
    // fontWeight: 'bold',
  },
  claimedText: {
    fontSize: 13,
    color: 'darkgreen',
    // fontWeight: 'bold',
    marginLeft: 'auto',
  },
  claimedByMeText: {
    fontSize: 13,
    color: 'darkgreen',
    // fontWeight: 'bold',
    marginTop: 5,
  },
  avatarContainer: {
    width: 25,
    height: 25,
    borderRadius: 20,
    marginRight: 5,
    overflow: "hidden",
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  listClaimedByContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 5,
    width: '100%',
  },
  claimedByUsername: {
    fontSize: 13,
    color: 'gray',
  },
  deleteSwipeAction: {
    backgroundColor: "rgb(166, 2, 2)",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "90%",
    borderRadius: 8,
    marginLeft: 10,
  },
  deleteActionText: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
});

export default ItemItem;