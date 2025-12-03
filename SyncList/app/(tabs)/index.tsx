import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Alert,
  Text,
  ActivityIndicator,
  ScrollView,
  Pressable,
  useColorScheme
} from "react-native";
import axios from "axios";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { jwtDecode } from "jwt-decode";

import { useAuth } from "@/context/AuthContext";
import { API_URL } from "@/constants/api";
import ListList from "@/components/ListList";
import HeaderSection from "@/components/HeaderSection";
import SyncListButton from "@/components/SynListButton";
import AddListModel from "@/components/AddListModel";
import DeleteModel from "@/components/DeleteModel";
import ThemedView from "@/components/ThemedView";

type ShoppingList = {
  _id: string;
  listName: string;
  owner: string;
};

type DecodedToken = {
  userId: string;
};

export default function HomeScreen() {
  const { token, isLoading: isAuthLoading, name,logOut } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);

  const [myLists, setMyLists] = useState<ShoppingList[]>([]);
  const [joinedLists, setJoinedLists] = useState<ShoppingList[]>([]);
  const [activeTab, setActiveTab] = useState<"my" | "joined">("my");

  const [isListLoading, setIsListLoading] = useState(true);
  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
  const [newList, setNewList] = useState("");
  const [deleteModelVisibility, setDeleteModelVisibility] = useState(false);
  const [selectedDeleteItemId, setSelectedDeleteItemId] = useState("");
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    } else {
      setUserId(null);
    }
  }, [token]);

  const fetchLists = async () => {
    if (!userId) return;

    setIsListLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/list/`);
      const allLists: ShoppingList[] = response.data.lists;

      const ownedLists = allLists.filter((list) => list.owner === userId);
      const sharedLists = allLists.filter((list) => list.owner !== userId);

      setMyLists(ownedLists);
      setJoinedLists(sharedLists);
    } catch (error: any) {
      if(error.response?.status === 403){
        logOut();
      }
      console.error(error);
      Alert.alert("Error", error.response?.data?.message || "Could not fetch your lists.");
    } finally {
      setIsListLoading(false);
    }
  };

  const addList = async () => {
    if (newList === "") {
      Alert.alert("Error", "Enter a Title for the List");
      return;
    }

    if (!isAuthLoading && token) {
      try {
        const response = await axios.post(`${API_URL}/api/list/`, {
          listName: newList,
        });
        if (response.status === 201) {
          Alert.alert("New List Added");
          setNewList("");
          setIsAddListModalOpen(false);
          fetchLists();
          setActiveTab("my");
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          logOut();
        } else {
          Alert.alert("Error", "Could not add the list.");
        }
      }
    }
  };

  const deleteList = async () => {
    try {
      const response = await axios.delete(
        `${API_URL}/api/list/${selectedDeleteItemId}`
      );

      if (response.status === 200) {
        Alert.alert("Item deleted successfull");
        setSelectedDeleteItemId("");
        fetchLists();
        setDeleteModelVisibility(false);
      }
    } catch (err: any) {
      if (err.response?.status === 403) {
        logOut();
      } else {
        Alert.alert("Error", "Could not add the list.");
      }
    }
  };

  useEffect(() => {
    if (!isAuthLoading && token && userId) {
      fetchLists();
    } else if (!isAuthLoading && !token) {
      setIsListLoading(false);
      setMyLists([]);
      setJoinedLists([]);
    }
  }, [isAuthLoading, token, userId]);

  const showLoading = isAuthLoading || isListLoading;

  const renderContent = () => {
    if (showLoading) {
      return <ActivityIndicator size="small" color="#2A7886" style={styles.loader} />;
    }

    if (activeTab === "my") {
      if (myLists.length === 0) {
        return (
          <Text style={styles.noListsText}>
            You haven&apos;t created any lists yet.
          </Text>
        );
      }
      return (
        <ListList
          joined = {false}
          lists={myLists}
          fetchLists={fetchLists}
          isListLoading={isListLoading}
          setDeleteModelVisibility={setDeleteModelVisibility}
          setSelectedDeleteItemId={setSelectedDeleteItemId}
        />
      );
    } else {
      if (joinedLists.length === 0) {
        return (
          <Text style={styles.noListsText}>
            You haven&apos;t joined any lists yet.
          </Text>
        );
      }
      return (
        <ListList
          joined = {true}
          lists={joinedLists}
          fetchLists={fetchLists}
          isListLoading={isListLoading}
          setDeleteModelVisibility={setDeleteModelVisibility}
          setSelectedDeleteItemId={setSelectedDeleteItemId}
        />
      );
    }
  };

  return (
    <ThemedView style={styles.mainContainer}> 
      <ScrollView style={styles.scrollContainer}>
        <HeaderSection />

        <Text style={styles.welcomeText}>Welcome {name}</Text>

        <ThemedView style={ colorScheme==='dark'? {...styles.tabContainer,borderBottomColor: 'rgb(36, 36, 36)'}: {...styles.tabContainer, borderBottomColor: '#eee'}}>
          <ThemedView style={styles.tabsWrapper}>
            <Pressable
              onPress={() => setActiveTab("my")}
              style={[
                styles.tabButton,
                activeTab === "my" && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "my" && styles.activeTabText,
                ]}
              >
                My Lists
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("joined")}
              style={[
                styles.tabButton,
                activeTab === "joined" && styles.activeTabButton,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "joined" && styles.activeTabText,
                ]}
              >
                Joined Lists
              </Text>
            </Pressable>
          </ThemedView>

          <FontAwesome
            name="refresh"
            size={20}
            color="#2A7886"
            onPress={() => fetchLists()}
            style={styles.refreshIcon}
          />
        </ThemedView>

        <ThemedView style={styles.listContainer}>
          {renderContent()}
        </ThemedView>
      </ScrollView>

      <ThemedView style={ colorScheme==='dark'? {...styles.footerContainer,borderTopColor: 'rgb(36, 36, 36)'}: {...styles.footerContainer, borderTopColor: '#eee'}}>
        <SyncListButton
          onClick={() => setIsAddListModalOpen(true)}
          type="primary"
          disabled={false}
          style={styles.addListButton}
        >
          Add a List
        </SyncListButton>
      </ThemedView>

      {isAddListModalOpen && (
        <AddListModel
          modalVisible={isAddListModalOpen}
          setModalVisible={setIsAddListModalOpen}
          newList={newList}
          setNewList={setNewList}
          addList={addList}
        />
      )}

      {deleteModelVisibility && (
        <DeleteModel
          deleteText="Are you really want delete this list?"
          modalVisible={deleteModelVisibility}
          setModalVisible={setDeleteModelVisibility}
          deleteMethod={deleteList}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
  },
  scrollContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 18,
    color: "#2A7886",
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
  },
  tabsWrapper: {
    flexDirection: "row",
    gap: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  activeTabButton: {
    borderBottomWidth: 3,
    borderBottomColor: "#2A7886",
  },
  tabText: {
    fontSize: 16,
    color: "gray",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#2A7886",
    fontWeight: "bold",
  },
  refreshIcon: {
    padding: 5,
  },
  listContainer: {
    minHeight: 200,
    paddingBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  noListsText: {
    textAlign: "center",
    color: "gray",
    fontSize: 16,
    marginVertical: 40,
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  addListButton: {
    width: "100%",
  },
});