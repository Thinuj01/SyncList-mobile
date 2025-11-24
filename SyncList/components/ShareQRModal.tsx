import React from 'react'
import { StyleSheet, View, Modal, Pressable, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import logo from '@/assets/images/SyncList Logo.png'

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
<View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close-circle" size={30} color="gray" />
          </Pressable>
          
          <Text style={styles.modalTitle}>Share {listName}</Text>
          <Text style={styles.modalSubtitle}>Scan this code to join the list.</Text>

          <View style={styles.qrContainer}>
            <QRCode
              value={qrValue}
              size={200}
              color="#000000"
              backgroundColor="#FFFFFF"
              logo={logo}
              // You can embed the app logo in the center here if you like!
            />
          </View>
          
          <Text style={styles.idText}>Scan Me</Text>

        </View>
      </View>

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
      backgroundColor: 'white',
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
      right: 10,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#2A7886',
    },
    modalSubtitle: {
      fontSize: 14,
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
