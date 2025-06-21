import React from 'react';
import { Stack, useRouter } from 'expo-router';

import { Text, View } from 'react-native';
import ServerCard from '~/components/ServerCard';
import useServer from '~/hooks/useServer';
import GitHubButton from '~/components/GitHubButton';
import LoadingIcon from '~/components/LoadingIcon';
import { NestableDraggableFlatList, NestableScrollContainer } from 'react-native-draggable-flatlist';
import AddButton from '~/components/AddButton';
import { RefreshControl } from 'react-native-gesture-handler';

const Index = () => {
  const router = useRouter();
  const [dragging, setDragging] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const { servers, fetchAllServers, setPosition, refetchStatus } = useServer();

  React.useEffect(() => {
    fetchAllServers();
  }, []);

  return (
    <View className='bg-[#1d2029]'>
      {/* Changes page title visible on the header */}
      <Stack.Screen
        options={{
          headerLeft: () => <GitHubButton size={30} />,
          headerTitle: () => (
            <Text className='text-3xl font-bold text-white'>
              <Text className='text-[#a732f5]'>Game</Text> Server Status
            </Text>
          ),
          headerTitleAlign: 'center',
          headerRight: () => <AddButton size={30} onPress={() => router.push('/editServer')} />,
        }}
      />
      <NestableScrollContainer
        refreshControl={
          <RefreshControl
            onRefresh={async () => {
              setRefreshing(true);
              try {
                await refetchStatus();
              } finally {
                setRefreshing(false);
              }
            }}
            refreshing={refreshing}
            enabled={!dragging}
          />
        }
      >
        {servers !== null ? (
          <NestableDraggableFlatList
            data={servers}
            onDragBegin={() => setDragging(true)}
            onDragEnd={({ from, to }) => {
              setDragging(false);
              setPosition(from, to);
            }}
            renderItem={({ item, drag, isActive, getIndex }) => (
              <ServerCard item={item} drag={drag} isActive={isActive} getIndex={getIndex} />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 10, gap: 10 }}
            showsVerticalScrollIndicator={true}
            renderPlaceholder={() => (
              <View className='bg-[#a732f5] shadow-lg shadow-black rounded-md mx-4 mb-4 items-center min-h-[125px] flex-1' />
            )}
            ListEmptyComponent={
              <View>
                <Text className='text-white text-center text-3xl font-bold'>List empty</Text>
                <Text className='text-white text-center text-sm'>
                  Add a server with the plus in the top right corner
                </Text>
              </View>
            }
          />
        ) : (
          <LoadingIcon size={64} textClassName='self-center mt-4' />
        )}
      </NestableScrollContainer>
    </View>
  );
};

export default Index;
