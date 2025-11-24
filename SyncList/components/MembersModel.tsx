import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Member = {
    _id: string;
    username: string;
    profilePictureUrl: string;
};

type Props = {
    members: Member[];
    ownerId: string;
    isVisible: boolean;
    onClose: () => void;
};

export default function MembersModal({ members, ownerId, isVisible, onClose }: Props) {

    const sortedMembers = members.sort((a, b) => (a._id === ownerId ? -1 : b._id === ownerId ? 1 : 0));

    const renderMember = ({ item }: { item: Member }) => {
        const isOwner = item._id === ownerId;
        const ownerLabel = isOwner ? ' (Owner)' : '';

        return (
            <View style={styles.memberRow}>
                <View style={styles.avatarContainer}>
                    {item.profilePictureUrl ? (
                        <Image source={{ uri: item.profilePictureUrl }} style={styles.avatar} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={40} color="#2A7886" />
                    )}
                </View>
                <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{item.username} {ownerLabel}</Text>
                    {/* <Text style={styles.memberEmail}>{item.email}</Text> */}
                </View>
                {isOwner && <Ionicons name="star" size={18} color="#FFD700" />}
            </View>
        );
    };

    return (
        <Modal 
            animationType="slide"
            transparent={true} 
            visible={isVisible} 
            onRequestClose={onClose}
        >
            {/* Outer view to push content to the bottom */}
            <Pressable style={styles.centeredView} onPress={onClose}>
                {/* Inner view that holds the content, stops the dismissal on press */}
                <Pressable style={styles.modalView}> 
                    
                    <View style={styles.dragHandle} />
                    
                    <Text style={styles.modalTitle}>List Members ({members.length})</Text>

                    <FlatList
                        data={sortedMembers}
                        keyExtractor={(item) => item._id}
                        renderItem={renderMember}
                        style={styles.list}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    // 1. CRITICAL: Use flex-end to push the content to the bottom
    centeredView: { 
        flex: 1,
        justifyContent: 'flex-end', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent background
    },
    // 2. CRITICAL: Define the content's appearance
    modalView: {
        width: '100%',
        maxHeight: '85%', // Limit the height
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        paddingTop: 10,
        elevation: 5,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 5,
        alignSelf: 'center',
        marginVertical: 10,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2A7886',
        textAlign: 'center',
    },
    list: {
        width: '100%',
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        justifyContent: 'space-between',
    },
    avatarContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
        overflow: 'hidden',
    },
    avatar:{
        width: '100%',
        height: '100%',
    },
    memberInfo: {
        flex: 1,
        marginRight: 10,
    },
    memberName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    memberEmail: {
        fontSize: 12,
        color: 'gray',
    },
});