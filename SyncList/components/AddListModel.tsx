import React from "react";
import { Modal, StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";

type AddListModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  newList: string,
  setNewList: (visible: string) => void;
  addList:()=>void;
};

const AddListModel: React.FC<AddListModalProps> = ({
  modalVisible,
  setModalVisible,
  newList,
  setNewList,
  addList
}) => {
  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add a New List</Text>
          <TextInput
            placeholder="Enter Title for your new list"
            placeholderTextColor= '#ccc'
            value={newList}
            onChangeText={setNewList}
            style={styles.listTitleText}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
            >
                <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.AddListButton}
                onPress={addList}
            >
                <Text style={styles.AddListButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle:{
    fontSize:20,
    fontWeight: 'bold',
    textAlign: 'center',
    color:'#2A7886',
    marginBottom:20,
  },
  listTitleText:{
    paddingVertical:12,
    paddingHorizontal:10,
    borderWidth:1,
    borderColor: '#2A7886',
    borderRadius: 10,
    marginBottom:20,
    fontSize:18,
    color: '#2A7886'
  },
  modalButtons:{
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelButton:{
    backgroundColor: '#ccc',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:10
  },
  cancelButtonText:{
    fontSize:16,
    color: 'white'
  },
  AddListButton:{
    backgroundColor: '#2A7886',
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:10
  },
  AddListButtonText:{
    fontSize:16,
    color: 'white'
  }
});

export default AddListModel;
