import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuth } from "@/context/AuthContext";
import { jwtDecode } from "jwt-decode";

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
  const { token, isLoading: isAuthLoading } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    } else {
      setUserId(null);
    }
  }, [token]);

  return (
    <View style={styles.listItemContainer}>
      <View style={styles.listItem}>
        <Text style={styles.listText}>{item.itemName}</Text>
        {item.isClaimed ? (
          userId === item.claimedBy._id && (
            <TouchableOpacity
              disabled={isClaimLoading}
              style={[styles.claimButton, isClaimLoading && { opacity: 0.6 }]}
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
                <Text style={styles.claimButtonText}>
                  Unclaim
                </Text>
              )}
            </TouchableOpacity>
          )
        ) : (
          <TouchableOpacity
            disabled={isClaimLoading}
            style={[styles.claimButton, isClaimLoading && { opacity: 0.6 }]}
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
              <Text style={styles.claimButtonText}>
                Claim
              </Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => {
            setDeleteModelVisibility(true);
            setSelectedDeleteItemId(id);
          }}
        >
          <MaterialIcons
            name="delete-forever"
            size={24}
            color="rgb(166, 2, 2)"
          />
        </TouchableOpacity>
      </View>
      {item.isClaimed &&
        (userId === item.claimedBy._id ? (
          <Text>Claimed by me</Text>
        ) : (
          <Text>Claimed by: {item.claimedBy.username}</Text>
        ))}
    </View>
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
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listText: {
    fontSize: 18,
    color: "#2A7886",
  },
  claimButton: {
    backgroundColor: "#2A7886",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  claimButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ItemItem;
