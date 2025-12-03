import React from 'react';
import { Modal, View, Text, StyleSheet, Pressable, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ThemedView from './ThemedView';
import { useColorScheme } from 'react-native';

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
    const colorScheme = useColorScheme();

    const renderMember = ({ item }: { item: Member }) => {
        const isOwner = item._id === ownerId;
        const ownerLabel = isOwner ? ' (Owner)' : '';

        return (
            <ThemedView style={styles.memberRow}>
                <ThemedView style={styles.avatarContainer}>
                    {item.profilePictureUrl ? (
                        <Image source={{ uri: item.profilePictureUrl }} style={styles.avatar} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={40} color="#2A7886" />
                    )}
                </ThemedView>
                <ThemedView style={styles.memberInfo}>
                    <Text style={colorScheme==="dark"?{...styles.memberName,color:'white'}:{...styles.memberName}}>{item.username} {ownerLabel}</Text>
                </ThemedView>
                {isOwner && <Ionicons name="star" size={18} color="#FFD700" />}
            </ThemedView>
        );
    };

    return (
        <Modal 
            animationType="slide"
            transparent={true} 
            visible={isVisible} 
            onRequestClose={onClose}
        >
            <Pressable style={styles.centeredView} onPress={onClose}>
                <Pressable style={colorScheme==="dark"?{...styles.modalView,backgroundColor:'#0B0E16',borderColor:'#2A7886',borderWidth:2}:{...styles.modalView,backgroundColor:'white'}} onPress={(e) => e.stopPropagation()}>
                    
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
    centeredView: { 
        flex: 1,
        justifyContent: 'flex-end', 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '100%',
        maxHeight: '85%',
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