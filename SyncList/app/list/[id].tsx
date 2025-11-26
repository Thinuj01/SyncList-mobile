import HeaderSection from "@/components/HeaderSection";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useEffect, useFocusEffect } from "react";
import io from "socket.io-client";
import Entypo from "@expo/vector-icons/Entypo";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
} from "react-native";
import axios from "axios";
import { API_URL } from "@/constants/api";
import { useAuth } from "@/context/AuthContext";
import ItemList from "@/components/ItemList";
import Feather from "@expo/vector-icons/Feather";
import SyncListButton from "@/components/SynListButton";
import AddItemModel from "@/components/AddItemModel";
import DeleteModel from "@/components/DeleteModel";
import ShareQRModal from "@/components/ShareQRModal";
import { Ionicons } from "@expo/vector-icons";
import MembersModal from "@/components/MembersModel";
import { jwtDecode } from "jwt-decode";


type itemProp = {
  _id: string;
  itemName: string;
  isClaimed: boolean;
  claimedBy: {
    _id: string;
    username: string;
    profilePictureUrl: string;
  };
};

type memberProps = {
  _id: string;
  username: string;
  profilePictureUrl: string;
}

type ShoppingList = {
  _id: string;
  listName: string;
  owner: string;
  items: itemProp[];
  members: memberProps[];
};

type DecodedToken = {
  userId: string;
};

const ListDetailScreen = () => {
  const SOCKET_URL = API_URL;
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { token, isLoading: isAuthLoading, logOut } = useAuth();
  const [items, setItems] = useState<ShoppingList>();
  const [isListLoading, setIsListLoading] = useState(true);
  const [isAddItemModelOpen, setIsAddItemModelOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [deleteModelVisibility, setDeleteModelVisibility] = useState(false);
  const [selectedDeleteItemId, setSelectedDeleteItemId] = useState("");
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [memberModelVisible, setMemberModelVisible] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchItems = async () => {
    setIsListLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/item/${id}`);
      setItems(response.data);
    } catch (err) {   
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        logOut();
        return;
      }
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Something went wrong");
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred");
      }
    } finally {
      setIsListLoading(false);
    }
  };

  const AddItem = async () => {
    if (newItem === "") {
      Alert.alert("Error", "Enter a Title for the List");
      return;
    }

    if (!isAuthLoading && token) {
      try {
        const response = await axios.post(`${API_URL}/api/item/`, {
          listId: id,
          itemName: newItem,
        });
        if (response.status === 201) {
          setNewItem("");
          setIsAddItemModelOpen(false);
        }
      } catch (err: unknown) {
        
        if (axios.isAxiosError(err) && err.response?.status === 403) {
          logOut();
          return;
        }
        if (axios.isAxiosError(err)) {
          alert(err.response?.data?.message || "Something went wrong");
        } else if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("An unexpected error occurred");
        }
      }
    }
  };

  const deleteItem = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/item/${selectedDeleteItemId}`
      );

      if (response.status === 200) {
        setSelectedDeleteItemId("");
        setDeleteModelVisibility(false);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        logOut();
        return;
      } 
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Something went wrong");
      } else if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  const itemClaiming = async (id: string) => {
    try {
      const response = await axios.put(`${API_URL}/api/item/claim/${id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        logOut();
        return;
      }
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  useEffect(() => {
    if (!isAuthLoading && token) {
      fetchItems();
      const decodedToken: DecodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, [isAuthLoading, token]);

  useEffect(() => {
    if (!isAuthLoading && token) {
      const socket = io(SOCKET_URL, {
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        socket.emit("joinList", id);
        console.log(`Socket joined room: ${id}`);
      });

      socket.on("itemAdded", (newItem: itemProp) => {
        console.log("Real-time update received for:", newItem.itemName);

        setItems((currentList) => {
          if (!currentList) return undefined;
          return {
            ...currentList,
            items: [...currentList.items, newItem],
          };
        });
      });

      socket.on("itemUpdated", (updatedItem: itemProp) => {
        console.log("Real-time update received for:", updatedItem.itemName);

        setItems((currentList) => {
          if (!currentList) return undefined;
          return {
            ...currentList,
            items: currentList.items.map((item) =>
              item._id === updatedItem._id ? updatedItem : item
            ),
          };
        });
      });

      socket.on("itemDeleted", (deletedItemId: string) => {
        console.log(`Real-time deletion for item: ${deletedItemId}`);
        setItems((currentList) => {
          if (!currentList) return undefined;
          return {
            ...currentList,
            items: currentList.items.filter(
              (item) => item._id !== deletedItemId
            ),
          };
        });
      });

      return () => {
        socket.emit("leaveList", id);
        socket.disconnect();
      };
    }
  }, [isAuthLoading, token]);

  const showLoading = isAuthLoading || isListLoading;

  return (
    <View style={styles.container}>
      <ShareQRModal
        listId={id}
        listName={"Hello"}
        isVisible={isQRModalVisible}
        onClose={() => setIsQRModalVisible(false)}
      />
      <HeaderSection />
      <View style={styles.header}>
        {!showLoading && (
          <>
            <Text style={styles.listName}>{items && items.listName}</Text>
            <View style={styles.headerIcons}>
              <Pressable onPress={() => setIsQRModalVisible(true)}>
                <Ionicons
                  name="share-social-outline"
                  size={24}
                  color="#2A7886"
                  style={{ marginRight: 15 }}
                />
              </Pressable>
              <Pressable onPress={() => fetchItems()}>
                <Ionicons
                  name="refresh-outline"
                  size={24}
                  color="#2A7886"
                  style={{ marginRight: 15 }}
                />
              </Pressable>
              <Pressable onPress={() => setMemberModelVisible(true)}>
                <Ionicons
                  name="people-outline"
                  size={24}
                  color="#2A7886"
                />
              </Pressable>
            </View>
          </>
        )}
      </View>
      {showLoading ? (
        <ActivityIndicator size="small" color="#2A7886" />
      ) : (
        <>
          <ItemList
            fetchItems={fetchItems}
            isListLoading={isListLoading}
            owner={items && items.owner}
            items={items && items.items}
            setDeleteModelVisibility={setDeleteModelVisibility}
            setSelectedDeleteItemId={setSelectedDeleteItemId}
            itemClaiming={itemClaiming}
          />
          <SyncListButton
            onClick={() => setIsAddItemModelOpen(true)}
            type="primary"
            disabled={false}
            style={styles.addItemButton}
          >
            Add a Item
          </SyncListButton>
        </>
      )}

      {isAddItemModelOpen && (
        <AddItemModel
          modalVisible={isAddItemModelOpen}
          setModalVisible={setIsAddItemModelOpen}
          newItem={newItem}
          setNewItem={setNewItem}
          addItem={AddItem}
        />
      )}
      {deleteModelVisibility && (
        <DeleteModel
          deleteText="Are you really want delete this item?"
          modalVisible={deleteModelVisibility}
          setModalVisible={setDeleteModelVisibility}
          deleteMethod={deleteItem}
        />
      )}
      {memberModelVisible && (
        <MembersModal
          members={items ? items.members : []}
          ownerId={items ? items.owner : ""}
          isVisible={memberModelVisible}
          onClose={() => setMemberModelVisible(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  headerIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
    gap: 2,
  },
  listName: {
    fontSize: 20,
    color: "#2A7886",
    fontWeight: "bold",
  },
  homeBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A7886",
    width: "25%",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 5,
  },
  homeBtnText: {
    color: "white",
  },
  itemList: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  itemListTitle: {
    fontSize: 16,
    color: "#2A7886",
    textAlign: "center",
    marginBottom: 20,
  },
  refreshIcon: {
    position: "absolute",
    right: 30,
  },
  addItemButton: {
    width: "90%",
    alignSelf: "center",
    marginBottom: 30,
  },
});

export default ListDetailScreen;
