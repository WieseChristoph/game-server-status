import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Player {
  name: string;
  score: number;
  onlineTime: string;
}

interface BaseGameServer {
  id: string;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
  description: string;
  address: string;
  port: number;
  isOnline: boolean;
  ping: number;
  players?: Player[];
}

interface SteamServer extends BaseGameServer {
  game: 'Steam';
  map: string;
  gameType: string;
}

interface MinecraftServer extends BaseGameServer {
  game: 'Minecraft';
  version: string;
  logoUrl?: string;
}

type GameServer = SteamServer | MinecraftServer;

interface GameServerItemProps {
  server: GameServer;
}

const GameServerItem: React.FC<GameServerItemProps> = ({ server }) => {
  const [expanded, setExpanded] = React.useState(false);

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  const getStatusColor = () => {
    if (!server.isOnline) return 'bg-red-500';
    const playerRatio = server.currentPlayers / server.maxPlayers;
    if (playerRatio >= 0.9) return 'bg-orange-500';
    if (playerRatio >= 0.7) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusTextColor = () => {
    if (!server.isOnline) return 'text-red-400';
    const playerRatio = server.currentPlayers / server.maxPlayers;
    if (playerRatio >= 0.9) return 'text-orange-400';
    if (playerRatio >= 0.7) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getPingColor = () => {
    if (!server.isOnline) return 'text-red-400';
    if (server.ping < 50) return 'text-green-400';
    if (server.ping < 100) return 'text-yellow-400';
    if (server.ping < 200) return 'text-orange-400';
    return 'text-red-400';
  };

  const renderServerIcon = () => {
    if (server.game === 'Minecraft' && 'logoUrl' in server && server.logoUrl) {
      return <Image source={{ uri: server.logoUrl }} className='w-8 h-8 rounded mr-3' resizeMode='cover' />;
    }
    return <Text className='text-xl mr-3'>{server.game === 'Steam' ? '🎮' : '⛏️'}</Text>;
  };

  const renderGameBadge = () => {
    if (server.game === 'Steam') {
      return (
        <View className='bg-blue-900/50 border border-blue-700 px-2 py-1 rounded'>
          <Text className='text-xs text-blue-300 font-medium'>{server.gameType}</Text>
        </View>
      );
    } else {
      return (
        <View className='bg-green-900/50 border border-green-700 px-2 py-1 rounded'>
          <Text className='text-xs text-green-300 font-medium'>{server.version}</Text>
        </View>
      );
    }
  };

  const renderGameSpecificInfo = () => {
    if (server.game === 'Steam') {
      return (
        <Text className='text-sm text-gray-400 mb-2' numberOfLines={1}>
          Map: {server.map}
        </Text>
      );
    }
    return null; // Minecraft servers don't show additional info here
  };

  return (
    <View className='bg-gray-800 rounded-xl mb-3 shadow-lg border border-gray-700'>
      <TouchableOpacity onPress={toggleExpanded} className='p-4' activeOpacity={0.7}>
        <View className='flex-row items-start mb-3'>
          {renderServerIcon()}
          <View className='flex-1'>
            <View className='flex-row items-center justify-between mb-1'>
              <Text className='text-lg font-semibold text-white flex-1 mr-2' numberOfLines={1}>
                {server.name}
              </Text>
              <View className='flex-row items-center'>
                <View className={`w-3 h-3 rounded-full mr-2 ${getStatusColor()}`} />
                <Text className={`text-xs font-medium ${getPingColor()}`}>
                  {server.isOnline ? `${server.ping}ms` : 'Offline'}
                </Text>
              </View>
            </View>

            <View className='flex-row justify-between items-center mb-2'>
              <Text className='text-sm font-medium text-gray-300'>
                {server.currentPlayers}/{server.maxPlayers} players
              </Text>
              {renderGameBadge()}
            </View>

            {renderGameSpecificInfo()}

            <View className='flex-row items-center justify-between'>
              <Text className='text-xs font-mono text-gray-500'>
                {server.address}:{server.port}
              </Text>
              <Text
                className={`text-xs text-gray-500 ${expanded ? 'rotate-180' : 'rotate-0'}`}
                style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}
              >
                ▼
              </Text>
            </View>
          </View>
        </View>

        {/* Always visible Description/MOTD */}
        <Text className='text-sm text-gray-300 leading-5' numberOfLines={expanded ? undefined : 2}>
          {server.description}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <View className='px-4 pb-4 border-t border-gray-700'>
          <View className='flex-row justify-between items-center mb-4 py-2 px-3 bg-gray-700/50 rounded-lg mt-3'>
            <Text className={`text-sm font-semibold ${getStatusTextColor()}`}>
              {server.isOnline ? 'Online' : 'Offline'}
            </Text>
            <Text className={`text-sm font-medium ${getPingColor()}`}>
              Ping: {server.isOnline ? `${server.ping}ms` : 'N/A'}
            </Text>
          </View>

          {server.players && server.players.length > 0 && (
            <View className='mt-2'>
              <Text className='text-base font-semibold text-white mb-2'>Online Players ({server.players.length})</Text>
              <View className='bg-gray-700/50 rounded-lg p-2'>
                {server.players.map((player, index) => (
                  <View
                    key={index}
                    className={`flex-row justify-between items-center py-1.5 px-2 ${
                      index < server.players!.length - 1 ? 'border-b border-gray-600' : ''
                    }`}
                  >
                    <Text className='text-sm font-medium text-gray-200 flex-1 mr-2' numberOfLines={1}>
                      {player.name}
                    </Text>
                    <View className='items-end'>
                      {server.game === 'Steam' && <Text className='text-xs text-gray-400'>Score: {player.score}</Text>}
                      <Text className='text-xs text-gray-500'>{player.onlineTime}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

interface GameServerListProps {
  servers: GameServer[];
}

const GameServerList: React.FC<GameServerListProps> = ({ servers }) => {
  const renderServer = ({ item }: { item: GameServer }) => <GameServerItem server={item} />;

  return (
    <View className='flex-1 bg-gray-900'>
      <Text className='text-2xl font-bold text-white px-4 pt-4 pb-2'>Game Servers</Text>
      <FlatList
        data={servers}
        renderItem={renderServer}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
        className='flex-1'
      />
    </View>
  );
};

// Example usage with sample data
const sampleServers: GameServer[] = [
  {
    id: '1',
    name: 'Epic Gaming Server',
    currentPlayers: 24,
    maxPlayers: 32,
    game: 'Steam',
    gameType: 'Counter-Strike 2',
    map: 'de_dust2',
    description:
      'Competitive Counter-Strike server with active community and regular tournaments. Join us for intense matches and skilled gameplay!',
    address: '192.168.1.100',
    port: 27015,
    isOnline: true,
    ping: 45,
    players: [
      { name: 'PlayerOne', score: 1250, onlineTime: '2h 15m' },
      { name: 'GamerPro', score: 980, onlineTime: '45m' },
      { name: 'NoobSlayer', score: 1100, onlineTime: '1h 30m' },
      { name: 'FragMaster', score: 1450, onlineTime: '3h 5m' },
    ],
  },
  {
    id: '2',
    name: 'TF2 Community Server',
    currentPlayers: 18,
    maxPlayers: 24,
    game: 'Steam',
    gameType: 'Team Fortress 2',
    map: '2fort',
    description:
      'Classic Team Fortress 2 server running 24/7 with custom maps and friendly community. All skill levels welcome!',
    address: 'tf2.gameserver.net',
    port: 27016,
    isOnline: true,
    ping: 67,
    players: [
      { name: 'HeavyGuy', score: 850, onlineTime: '1h 20m' },
      { name: 'SpyMain', score: 1200, onlineTime: '2h 45m' },
    ],
  },
  {
    id: '3',
    name: 'Creative Builders Paradise',
    currentPlayers: 8,
    maxPlayers: 20,
    game: 'Minecraft',
    version: '1.20.4',
    description:
      '§6Welcome to §bCreative Builders Paradise§r! §aUnlimited building with custom plugins and friendly community. §eJoin us for epic builds and creative adventures!',
    address: 'mc.example.com',
    port: 25565,
    isOnline: true,
    ping: 23,
    logoUrl: 'https://via.placeholder.com/64x64/4CAF50/FFFFFF?text=MC',
    players: [
      { name: 'Builder123', score: 0, onlineTime: '3h 22m' },
      { name: 'Architect', score: 0, onlineTime: '1h 5m' },
      { name: 'CreativeMaster', score: 0, onlineTime: '45m' },
    ],
  },
  {
    id: '4',
    name: 'Survival Adventures',
    currentPlayers: 15,
    maxPlayers: 50,
    game: 'Minecraft',
    version: '1.20.2',
    description:
      '§2Hardcore Survival Server §r- §cPvP Enabled §r- §6Custom Economy §r- §bDaily Events §r- §eCome test your survival skills in our challenging world!',
    address: 'survival.minecraft-server.net',
    port: 25565,
    isOnline: true,
    ping: 67,
    logoUrl: 'https://via.placeholder.com/64x64/FF5722/FFFFFF?text=SV',
    players: Array.from({ length: 6 }, (_, i) => ({
      name: `Survivor${i + 1}`,
      score: 0,
      onlineTime: `${Math.floor(Math.random() * 5)}h ${Math.floor(Math.random() * 60)}m`,
    })),
  },
  {
    id: '5',
    name: 'Offline Test Server',
    currentPlayers: 0,
    maxPlayers: 16,
    game: 'Steam',
    gameType: "Garry's Mod",
    map: 'gm_construct',
    description:
      'This server is currently offline for maintenance. We will be back online soon with exciting updates and new content!',
    address: '10.0.0.50',
    port: 27017,
    isOnline: false,
    ping: 0,
  },
  {
    id: '6',
    name: 'High Latency MC Server',
    currentPlayers: 3,
    maxPlayers: 20,
    game: 'Minecraft',
    version: '1.19.4',
    description:
      '§cHigh ping server for testing §r- §7Located far away §r- §eStill playable but expect some delay in gameplay',
    address: 'distant.server.com',
    port: 25565,
    isOnline: true,
    ping: 245,
    logoUrl: 'https://via.placeholder.com/64x64/9C27B0/FFFFFF?text=HP',
    players: [
      { name: 'TestPlayer1', score: 0, onlineTime: '15m' },
      { name: 'TestPlayer2', score: 0, onlineTime: '8m' },
    ],
  },
];

export default function App() {
  return <GameServerList servers={sampleServers} />;
}
