import React from 'react'
import { StyleSheet, View, Modal, Pressable, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import logo from '@/assets/images/SyncList Logo.png'
import ThemedView from './ThemedView';

type QRModelProps = {
    listId: string,
    listName: string,
    isVisible: boolean,
    onClose: ()=>void,
};

const ShareQRModal: React.FC<QRModelProps> = ({ listId, listName, isVisible, onClose }) => {
    const qrValue = listId;
  return (
    <Modal
    animationType='fade'
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
    >
<ThemedView style={styles.centeredView}>
        <ThemedView style={styles.modalView}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={30} color="gray" />
          </Pressable>
          
          <Text style={styles.modalTitle}>{listName}</Text>
          <Text style={styles.modalSubtitle}>Scan this code to join the list.</Text>

          <ThemedView style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={200}
              color="#000000"
              backgroundColor="#FFFFFF"
              logo={logo}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>

    </Modal>
  )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalView: {
      margin: 20,
      borderColor: '#2A7886',
      borderWidth: 2,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
      color: '#2A7886',
    },
    modalSubtitle: {
      fontSize: 15,
      marginBottom: 20,
      color: 'gray',
    },
    qrContainer: {
      padding: 10,
      backgroundColor: '#fff',
      borderRadius: 5,
      marginBottom: 20,
    },
    idText: {
      marginTop: 10,
      fontSize: 12,
      color: '#333',
    },
});

export default ShareQRModal
