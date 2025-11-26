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
      <View style={styles.listItemContainer}>
        <View style={styles.listItem}>
          <Text style={styles.listText}>{item.itemName}</Text>
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
                  <Text style={styles.claimButtonText}>Unclaim</Text>
                )}
              </TouchableOpacity>
            ) : (
              // Display Claimed status by another user
              <Text style={styles.claimedText}>Claimed</Text>
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
                <Text style={styles.claimButtonText}>Claim</Text>
              )}
            </TouchableOpacity>
          )}

        </View>
        {item.isClaimed &&
          (userId === item.claimedBy._id ? (
            <Text style={styles.claimedByMeText}>Claimed by me</Text>
          ) : (
            <View style={styles.listClaimedByContainer}>
              <View style={styles.avatarContainer}>
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
              </View>
              <Text style={styles.claimedByUsername}>
                {item.claimedBy.username}
              </Text>
            </View>
          ))}
      </View>
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
    backgroundColor: 'white',
    minHeight: 60,
  },
  listItem: {
    width: "100%", 
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listText: {
    fontSize: 18,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  claimedText: {
    fontSize: 16,
    color: 'darkgreen',
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  claimedByMeText: {
    fontSize: 14,
    color: 'darkgreen',
    fontWeight: 'bold',
    marginTop: 5,
  },
  avatarContainer: {
    width: 30,
    height: 30,
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
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    width: '100%',
  },
  claimedByUsername: {
    fontSize: 15,
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