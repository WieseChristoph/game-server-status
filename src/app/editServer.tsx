import React from 'react';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ServerType } from '~/types/Server';
import Toast from 'react-native-root-toast';

import { View, Text, TextInput } from 'react-native';
import ServerTypeSelector from '~/components/ServerTypeSelector';
import { Pressable } from 'react-native-gesture-handler';
import useServer from '~/hooks/useServer';

const EditServer: React.FC = () => {
  const router = useRouter();
  const { serverId } = useLocalSearchParams<{ serverId?: string }>();
  const { servers, addServer, updateServer, queryServer } = useServer();

  const serverToEdit = serverId ? servers[Number(serverId)] : undefined;

  const [serverType, setServerType] = React.useState<ServerType>(serverToEdit ? serverToEdit.type : 'minecraft');
  const [displayName, setDisplayName] = React.useState<string>(serverToEdit ? serverToEdit.displayName : '');
  const [address, setAddress] = React.useState<string>(serverToEdit ? serverToEdit.address : '');
  const [port, setPort] = React.useState<number>(serverToEdit ? serverToEdit.port : 25565);

  return (
    <View className='bg-[#1d2029]'>
      {/* Changes page title visible on the header */}
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Text className='text-4xl font-bold text-white'>
              <Text className='text-[#a732f5]'>{!serverId ? 'Add' : 'Edit'}</Text> Server
            </Text>
          ),
          headerTintColor: 'white',
        }}
      />
      <View className='h-full w-full p-4'>
        <ServerTypeSelector
          selected={serverType}
          onSelect={(selection) => {
            setServerType(selection);
            setPort(selection === 'minecraft' ? 25565 : 27015);
          }}
        />
        <TextInput
          className='bg-[#2f333f] mt-3 rounded-md p-2 text-white border border-neutral-500 focus:border-[#a732f5]'
          placeholder='Display name'
          placeholderTextColor='gray'
          onChangeText={(text) => setDisplayName(text)}
          defaultValue={displayName}
          maxLength={32}
        />
        <View className='flex flex-row mt-3'>
          <TextInput
            className='bg-[#2f333f] rounded-md p-2 flex-1 mr-3 text-white border border-neutral-500 focus:border-[#a732f5]'
            placeholder='Address'
            placeholderTextColor='gray'
            onChangeText={(text) => setAddress(text)}
            defaultValue={address}
            autoCorrect={false}
          />
          <TextInput
            className='bg-[#2f333f] rounded-md p-2 text-white border border-neutral-500 focus:border-[#a732f5] w-1/5'
            placeholder='Port'
            placeholderTextColor='gray'
            inputMode='numeric'
            maxLength={5}
            onChangeText={(text) => setPort(parseInt(text))}
            defaultValue={port >= 0 ? port.toString() : ''}
          />
        </View>

        <View className='mt-4'>
          <Pressable
            onPress={async () => {
              try {
                if (!serverToEdit) {
                  const server = {
                    type: serverType,
                    displayName,
                    address,
                    port,
                  };
                  const addedServer = await addServer(server);

                  queryServer(addedServer);
                } else {
                  const server = {
                    id: serverToEdit.id,
                    position: serverToEdit.position,
                    type: serverType,
                    displayName,
                    address,
                    port,
                  };
                  await updateServer(server);

                  queryServer(server);
                }

                router.push('/');
              } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                Toast.show(errorMessage, {
                  duration: 5000,
                  backgroundColor: 'red',
                });
              }
            }}
          >
            <View className={`p-2 bg-[#a732f5] rounded-md shadow-lg`}>
              <Text className='text-white text-center font-bold text-xl'>Save</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default EditServer;
