import React from 'react';
import SteamServer from '~/types/SteamServer';

import { View, Text, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const SteamServerDetails: React.FC<{
  data: SteamServer;
}> = ({ data }) => {
  return (
    <View className='flex gap-1'>
      <View className='flex flex-row gap-5 justify-between pb-1 border-b border-gray-700'>
        <Text className='text-white text-sm font-bold'>Name</Text>
        <Text className='text-gray-400 flex-shrink break-all'>{data.a2sInfo.name}</Text>
      </View>
      <View className='flex flex-row gap-5 justify-between pb-1 border-b border-gray-700'>
        <Text className='text-white text-sm font-bold'>Game</Text>
        <Text className='text-gray-400 break-words'>{data.a2sInfo.game}</Text>
      </View>
      <View className='flex flex-row gap-5 justify-between pb-1 border-b border-gray-700'>
        <Text className='text-white text-sm font-bold'>Map</Text>
        <Text className='text-gray-400 break-words'>{data.a2sInfo.map}</Text>
      </View>
      <View className='flex gap-2'>
        <Text className='text-white text-sm font-bold'>Players</Text>
        <FlatList
          data={data.a2sPlayer?.playerList}
          renderItem={SteamPlayerListItem}
          keyExtractor={(item) => `${item.name}-${item.score}-${item.duration}`}
          className='rounded-lg max-h-52 border border-gray-700'
          persistentScrollbar={true}
          ListEmptyComponent={<Text className='text-gray-400 text-center p-3'>No players online</Text>}
        />
      </View>
    </View>
  );
};

const SteamPlayerListItem: ListRenderItem<{ name: string; score: number; duration: number }> = ({ item }) => {
  return (
    <View className='flex-row justify-between items-center py-1.5 px-2'>
      <Text className='text-sm font-medium text-gray-200 flex-1 mr-2' numberOfLines={1}>
        {item.name}
      </Text>
      <View className='items-end'>
        <Text className='text-xs text-gray-400'>Score: {item.score}</Text>
        <Text className='text-xs text-gray-500'>{new Date(item.duration * 1000).toISOString().slice(11, 19)}</Text>
      </View>
    </View>
  );
};

export default SteamServerDetails;
