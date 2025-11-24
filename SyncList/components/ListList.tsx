import React from "react";
import { FlatList, Pressable } from "react-native";
import { Link } from "expo-router";
import ListItem from "./ListItem";

type ListListProps = {
  lists: {
    _id: string;
    listName: string;
    owner: string;
  }[];
  fetchLists: () => void;
  isListLoading: boolean;
  setDeleteModelVisibility:(visible: boolean)=>void;
  setSelectedDeleteItemId:(visible: string) => void;
  joined:boolean;
};

const ListList: React.FC<ListListProps> = ({
  lists,
  fetchLists,
  isListLoading,
  setDeleteModelVisibility,
  setSelectedDeleteItemId,
  joined
}) => {
  return (
    <FlatList
      data={lists}
      scrollEnabled={false}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <Link href={`/list/${item._id}`} asChild>
          <Pressable>
            <ListItem key={item._id} joined={joined} id={item._id} name={item.listName} setDeleteModelVisibility={setDeleteModelVisibility} setSelectedDeleteItemId={setSelectedDeleteItemId}/>
          </Pressable>
        </Link>
      )}
      onRefresh={fetchLists}
      refreshing={isListLoading}
      contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}
    />
  );
};

export default ListList;
