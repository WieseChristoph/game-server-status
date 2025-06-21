import React from 'react';
import SteamServer from '~/types/SteamServer';

import { View, Text, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import MinecraftServer from '~/types/MinecraftServer';
import MinecraftMotd from './MinecraftMotd';

const MinecraftServerDetails: React.FC<{
  data: MinecraftServer;
}> = ({ data }) => {
  return (
    <View className='flex gap-1'>
      <View className='flex flex-row gap-5 justify-between pb-1 border-b border-gray-700'>
        <Text className='text-white text-sm font-bold'>Motd</Text>
        <Text className='text-center'>
          <MinecraftMotd motd={data.description} />
        </Text>
      </View>
      <View className='flex flex-row gap-5 justify-between pb-1 border-b border-gray-700'>
        <Text className='text-white text-sm font-bold'>Version</Text>
        <Text className='text-gray-400'>{data.version.name}</Text>
      </View>
      <View className='flex flex-row gap-5 justify-between pb-1 border-b border-gray-700'>
        <Text className='text-white text-sm font-bold'>Enforces Secure Chat</Text>
        <Text className='text-gray-400'>{data.enforcesSecureChat ? 'Yes' : 'No'}</Text>
      </View>
      <View className='flex gap-2'>
        <Text className='text-white text-sm font-bold'>Players</Text>
        <FlatList
          data={data.players.sample}
          renderItem={MinecraftPlayerListItem}
          keyExtractor={(item) => item.id}
          className='rounded-lg max-h-52 border border-gray-700'
          persistentScrollbar={true}
          ListEmptyComponent={<Text className='text-gray-400 text-center p-3'>No player samples available</Text>}
        />
      </View>
    </View>
  );
};

const MinecraftPlayerListItem: ListRenderItem<{ id: string; name: string }> = ({ item }) => {
  return (
    <View className='flex-row justify-between items-center py-1.5 px-2'>
      <Text className='text-sm font-medium text-gray-200 flex-1 mr-2' numberOfLines={1}>
        {item.name}
      </Text>
      <Text className='items-end text-xs text-gray-400'>{item.id}</Text>
    </View>
  );
};

export default MinecraftServerDetails;
