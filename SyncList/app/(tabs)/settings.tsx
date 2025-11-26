import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { API_URL } from "@/constants/api";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import HeaderSection from "@/components/HeaderSection";
import axios from "axios";

type userProps = {
  _id: string;
  username: string;
  email: string;
};

export default function SettingsScreen() {
  const { logOut, isLoading: isAuthLoading, token, profilePic } = useAuth();
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(profilePic);
  const [user, setUser] = useState<userProps | null>(null);

  const checkServerStatus = async () => {
    setIsChecking(true);
    try {
      await axios.get(API_URL);
      setIsServerOnline(true);
    } catch (e) {
      setIsServerOnline(false);
    } finally {
      setIsChecking(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission required",
        "You need to grant access to your photos to set a profile picture."
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const formData = new FormData();

      formData.append('profilePicture', {
        uri: imageUri,
        name: `profile-${user?._id || Date.now()}.jpg`,
        type: 'image/jpeg',
    } as any);
      try{
        const response = await axios.put(`${API_URL}/api/auth/profile`, formData, {
          headers: {
              'Authorization': `Bearer ${token}`, 
          },
      });
        if (response.status === 200) {
          setProfileImage(result.assets[0].uri);
          Alert.alert("Success", "Profile picture updated successfully!");
        }
      }
      catch(err : any) {
        if (err.response?.status === 403) {
          logOut();
          return;
        }
        console.error(err);
        Alert.alert("Error", err.response?.data?.message || "Could not update profile picture.");
      }
      setProfileImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    checkServerStatus();
    if (!isAuthLoading && token) {
      getUserDetails();
    }
  }, [isAuthLoading, token]);

  const getUserDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/`);
      setUser(response.data.user);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 403) {
        logOut();
        return;
      }
      console.error(err);
      Alert.alert("Error", "Could not fetch your details.");
    }
  };

  const renderStatusIcon = () => {
    if (isChecking) {
      return <ActivityIndicator size="small" color="#2A7886" />;
    }
    if (isServerOnline) {
      return (
        <MaterialCommunityIcons name="check-circle" size={24} color="green" />
      );
    }
    return <MaterialCommunityIcons name="close-circle" size={24} color="red" />;
  };

  return (
    <View style={styles.container}>
      <HeaderSection />
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <View style={styles.profileRow}>
            <TouchableOpacity
              onPress={pickImage}
              style={styles.profileImageContainer}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profilePlaceholder}>
                  <Ionicons name="camera-outline" size={30} color="gray" />
                </View>
              )}
            </TouchableOpacity>
            <View>
              <Text style={styles.sectionText}>{user?.username}</Text>
              <Text style={styles.sectionEmailText}>{user?.email}</Text>
              <TouchableOpacity onPress={pickImage}>
                <Text style={styles.editPhotoText}>Edit Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connectivity</Text>
          <View style={styles.settingRow}>
            <Text>API Status ({API_URL.split("//")[1]})</Text>
            {renderStatusIcon()}
          </View>
          <Text style={styles.versionText}>App Version: 1.0.0</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Actions</Text>

          <View style={styles.settingRow}>
            <Text>Change Password</Text>
            <Ionicons name="chevron-forward" size={24} color="gray" />
          </View>

          <Button title="Logout" onPress={logOut} color="red" />
        </View>

        <Text style={styles.footerText}>
          © {new Date().getFullYear()} SyncList - All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profilePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  sectionEmailText: {
    fontSize: 14,
    fontWeight: "300",
    color: "#333",
    marginTop: 3,
  },
  editPhotoText: {
    color: "#2A7886",
    marginTop: 5,
    fontSize: 14,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  versionText: {
    fontSize: 12,
    color: "gray",
    textAlign: "left",
    marginTop: 5,
  },
  footerText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 12,
    color: "gray",
  },
});
