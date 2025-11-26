import React from 'react'
import { FlatList } from 'react-native'
import ItemItem from './ItemItem';

type ItemListProps = {
    items?: {
      _id: string;
      itemName: string;
      isClaimed: boolean;
      claimedBy: {
        _id: string;
        username: string;
        profilePictureUrl: string;
      };
    }[];
    owner: string;
    fetchItems: () => void;
    isListLoading: boolean;
    setDeleteModelVisibility:(visible: boolean) => void;
    setSelectedDeleteItemId:(visible: string) => void;
    itemClaiming:(visible: string) => void;

  };

const ItemList:React.FC<ItemListProps> = ({
    items,
    fetchItems,
    isListLoading,
    setDeleteModelVisibility,
    setSelectedDeleteItemId,
    itemClaiming,
    owner
}) => {
  return (
    <FlatList
    data={items}
    keyExtractor={(item) => item._id}
    renderItem={({ item }) => (
          <ItemItem key={item._id} owner={owner} id={item._id} item={item} setDeleteModelVisibility={setDeleteModelVisibility} setSelectedDeleteItemId={setSelectedDeleteItemId}  itemClaiming={itemClaiming}/>
    )}
    onRefresh={fetchItems}
    refreshing={isListLoading}
    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}
    />
  )
}

export default ItemList
