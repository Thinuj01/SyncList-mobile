import React from "react";
import { Modal, StyleSheet, View, Text, TouchableOpacity } from "react-native";

type DeleteModelProps = {
  deleteText: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  deleteMethod: () => void;
};

const DeleteModel: React.FC<DeleteModelProps> = ({
  deleteText,
  modalVisible,
  setModalVisible,
  deleteMethod,
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
          <Text style={styles.modalTitle}>{deleteText}</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                deleteMethod();
                setModalVisible(false);
              }}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
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
  modalTitle: {
    fontSize: 20,
    textAlign: "center",
    color: "#2A7886",
    marginBottom: 20,
  },
  listTitleText: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#2A7886",
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 18,
    color: "#2A7886",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "white",
  },
  deleteButton: {
    backgroundColor: "rgb(166, 2, 2)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default DeleteModel;
