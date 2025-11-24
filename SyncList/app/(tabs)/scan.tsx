import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Button, Alert,View, Text } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import axios from 'axios';
import { API_URL } from '@/constants/api';
import { router } from 'expo-router';

export default function ScanScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scanned = useRef(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
    return () => {
      scanned.current = false;
    };
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string, data: string }) => {

    if(scanned.current){
      return;
    }
    scanned.current = true;
    const listId = data;
    console.log("List Id :"+listId);
    try {
      const response = await axios.post(`${API_URL}/api/list/${listId}/join`);
      console.log("List Id :"+listId);
      Alert.alert(
        'Success!',
        response.data.message || 'Successfully joined the list.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              scanned.current = false;
              router.replace('/(tabs)');
            }
          }
        ]
      );

    } catch (error: any) {
      // 6. Handle errors
      console.error(error);
      const message = error.response?.data?.message || 'Could not join list.';
      Alert.alert('Error', message, [
        { text: 'Scan Again', onPress: () => (scanned.current = false) }
      ]);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera.</Text>
        <Button title="Allow Camera" onPress={() => Camera.requestCameraPermissionsAsync()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan List QR Code</Text>
      <CameraView
        onBarcodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    position: 'absolute',
    top: 50,
    color: 'white',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  }
});