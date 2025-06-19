import React from "react";
import SteamServer from "~/types/SteamServer";

import { View, Text } from "react-native";

const SteamServerInfo: React.FC<{
  displayName?: string;
  address: string;
  port: number;
  data?: SteamServer;
  error?: string;
}> = ({ displayName, address, port, data, error }) => {
  return (
    <>
      <View className="flex flex-row flex-1">
        <Text className="text-white text-xl font-bold flex-1 break-words">{displayName ?? "Unnamed"}</Text>
        <Text className="text-white text-xl font-bold">{`${data?.a2sInfo.players ?? 0}/${data?.a2sInfo.maxPlayers ?? 0}`}</Text>
      </View>
      {data ? (
        <>
          <View className="flex flex-row">
            <Text className="text-neutral-400 text-xs flex-1">{`${address}:${port}`}</Text>
            <Text className="text-white">{data.a2sInfo.game}</Text>
          </View>
          <View className="flex flex-row">
            <Text className="text-neutral-400 text-xs flex-1">{data.ping + "ms"}</Text>
            <Text className="text-white">{data.a2sInfo.map}</Text>
          </View>
          <View className="border-b border-white my-1" />
          <Text className="text-white text-center p-2">{data.a2sInfo.name}</Text>
        </>
      ) : (
        <>
          <Text className="text-neutral-400 text-xs">{`${address}:${port}`}</Text>
          <View className="border-b border-white my-1" />
          <View className="flex justify-center flex-1">
            {error ? (
              <Text className="text-red-500 text-center font-bold">{error}</Text>
            ) : (
              <Text className="text-white text-center font-bold">Loading...</Text>
            )}
          </View>
        </>
      )}
    </>
  );
};

export default SteamServerInfo;
