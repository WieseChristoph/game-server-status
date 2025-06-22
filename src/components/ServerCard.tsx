import React from 'react';
import { useRouter } from 'expo-router';

import { View, Image, Text, LayoutAnimation } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { Server, ServerType } from '~/types/Server';
import MinecraftServerDetails from './MinecraftServerDetails';
import SteamServerDetails from './SteamServerDetails';
import { OpacityDecorator, RenderItemParams, ScaleDecorator, ShadowDecorator } from 'react-native-draggable-flatlist';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Pressable } from 'react-native-gesture-handler';
import { GRASS_BLOCK } from '~/image';
import useServer from '~/hooks/useServer';
import MinecraftServer from '~/types/MinecraftServer';
import SteamServer from '~/types/SteamServer';

const ServerCard: React.FC<RenderItemParams<Server>> = ({ item: server, drag, isActive }) => {
  const router = useRouter();
  const { deleteServer } = useServer();

  const [expanded, setExpanded] = React.useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <ShadowDecorator>
      <ScaleDecorator>
        <OpacityDecorator>
          <Swipeable
            renderLeftActions={(_prog, _drag, methods) => (
              <EditServerButton
                onEditPress={() => {
                  router.push({ pathname: '/editServer', params: { serverId: server.id } });
                  methods.close();
                }}
              />
            )}
            renderRightActions={(_prog, _drag, methods) => (
              <DeleteServerButton
                onDeletePress={() => {
                  deleteServer(server.id);
                  methods.close();
                }}
              />
            )}
          >
            <Pressable onPress={toggleExpanded} onLongPress={drag} disabled={isActive}>
              <View className={`flex gap-3 bg-[#2f333f] shadow-lg rounded-md p-3 border border-gray-700`}>
                <ServerCardHeader server={server} />
                {expanded &&
                  (server.data ? (
                    <View>
                      {server.type === 'minecraft' ? (
                        <MinecraftServerDetails data={server.data as MinecraftServer} />
                      ) : (
                        <SteamServerDetails data={server.data as SteamServer} />
                      )}
                    </View>
                  ) : (
                    <View className='flex flex-row gap-5 justify-between'>
                      <Text className='text-white text-sm font-bold'>Error</Text>
                      <Text className='text-red-400 flex-shrink break-all'>{server.error}</Text>
                    </View>
                  ))}
              </View>
            </Pressable>
          </Swipeable>
        </OpacityDecorator>
      </ScaleDecorator>
    </ShadowDecorator>
  );
};

const ServerCardIcon: React.FC<{ type: ServerType; favicon?: string }> = ({ type, favicon }) => {
  return type === 'minecraft' ? (
    <Image className='w-[32px] h-[32px]' source={favicon ? { uri: favicon } : GRASS_BLOCK} />
  ) : (
    <View className='w-[32px] h-[32px]'>
      <Svg viewBox='0 0 24 24' width='32' height='32' fill='white'>
        <Path d='M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z' />
      </Svg>
    </View>
  );
};

const ServerCardHeader: React.FC<{ server: Server }> = ({ server }) => {
  const playerCount = server.type === 'minecraft' ? server.data?.players.online : server.data?.a2sInfo.players;
  const maxPlayers = server.type === 'minecraft' ? server.data?.players.max : server.data?.a2sInfo.maxPlayers;

  return (
    <>
      <View className='flex flex-row w-full gap-3 items-center'>
        <ServerCardIcon type={server.type} favicon={server.type === 'minecraft' ? server.data?.favicon : undefined} />

        <View className='flex flex-1'>
          <View className='flex flex-row justify-between items-center'>
            <Text className='text-white text-xl font-bold flex-1 break-words'>{server.displayName}</Text>

            <View className='flex flex-row gap-1 items-center'>
              <View className={`${server.data ? 'bg-green-600' : 'bg-red-600'} w-3 h-3 rounded-full`} />
              <Text className='text-xs text-center text-white'>
                {server.data ? `${server.data.ping}ms` : 'Offline'}
              </Text>
            </View>
          </View>

          <View className='flex flex-row justify-between items-center'>
            <Text className='text-gray-400 text-xs'>
              {server.address}:{server.port}
            </Text>

            {maxPlayers && <Text className='text-white text-right'>{`${playerCount ?? 0}/${maxPlayers}`}</Text>}
          </View>
        </View>
      </View>
    </>
  );
};

const EditServerButton: React.FC<{ onEditPress: () => void }> = ({ onEditPress }) => {
  return (
    <Pressable onPress={onEditPress}>
      <View className='bg-yellow-500 p-2 mr-2 rounded-md flex flex-1 justify-center'>
        <Svg
          width='32'
          height='32'
          viewBox='0 0 24 24'
          stroke='white'
          stroke-linecap='round'
          stroke-linejoin='round'
          fill='none'
        >
          <Path d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7' />
          <Path d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z' />
        </Svg>
      </View>
    </Pressable>
  );
};

const DeleteServerButton: React.FC<{ onDeletePress: () => void }> = ({ onDeletePress }) => {
  return (
    <Pressable onPress={onDeletePress}>
      <View className='bg-red-500 p-2 ml-2 rounded-md flex flex-1 justify-center'>
        <Svg
          width='32'
          height='32'
          viewBox='0 0 24 24'
          stroke='white'
          stroke-linecap='round'
          stroke-linejoin='round'
          fill='none'
        >
          <Path d='M3 6h18' />
          <Path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
          <Path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
          <Line x1='10' x2='10' y1='11' y2='17' />
          <Line x1='14' x2='14' y1='11' y2='17' />
        </Svg>
      </View>
    </Pressable>
  );
};

export default ServerCard;
