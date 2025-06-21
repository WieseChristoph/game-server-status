import UDPSockets from 'react-native-udp';
import { Buffer } from 'buffer';
import SteamServer, { A2S_INFO, A2S_PLAYER } from '~/types/SteamServer';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';

const S2C_CHALLENGE_HEADER = 65; // Response with challenge number
const S2C_INFO_HEADER = 73; // A2S_INFO response
const S2C_PLAYER_HEADER = 68; // A2S_PLAYER response

function randomPort() {
  return (Math.random() * 60536) | (0 + 5000); // 60536-65536
}

function readString(buffer: Buffer) {
  return buffer.slice(0, buffer.indexOf(0x00)).toString('utf8');
}

function readA2sInfo(buffer: Buffer): A2S_INFO {
  const a2sInfo = {} as A2S_INFO;

  // Remove header
  buffer = buffer.slice(4 + 1);

  // Read protocol version
  a2sInfo.protocol = buffer.readUInt8(0);
  buffer = buffer.slice(1);
  // Read name
  a2sInfo.name = readString(buffer);
  buffer = buffer.slice(buffer.indexOf(0x00) + 1);
  // Read map
  a2sInfo.map = readString(buffer);
  buffer = buffer.slice(buffer.indexOf(0x00) + 1);
  // Read folder
  a2sInfo.folder = readString(buffer);
  buffer = buffer.slice(buffer.indexOf(0x00) + 1);
  // Read game
  a2sInfo.game = readString(buffer);
  buffer = buffer.slice(buffer.indexOf(0x00) + 1);
  // Read appid
  a2sInfo.appId = buffer.readUInt16LE(0);
  buffer = buffer.slice(2);
  // Read players
  a2sInfo.players = buffer.readUInt8(0);
  buffer = buffer.slice(1);
  // Read max players
  a2sInfo.maxPlayers = buffer.readUInt8(0);
  buffer = buffer.slice(1);
  // Read bots
  a2sInfo.bots = buffer.readUInt8(0);
  buffer = buffer.slice(1);
  // Read server type
  a2sInfo.serverType = buffer.slice(0, 1).toString('utf8');
  buffer = buffer.slice(1);
  // Read environment
  a2sInfo.environment = buffer.slice(0, 1).toString('utf8');
  buffer = buffer.slice(1);
  // Read visibility
  a2sInfo.private = Boolean(buffer.readUInt8(0));
  buffer = buffer.slice(1);
  // Read vac
  a2sInfo.vac = Boolean(buffer.readUInt8(0));
  buffer = buffer.slice(1);
  // Read version
  a2sInfo.version = readString(buffer);
  buffer = buffer.slice(buffer.indexOf(0x00) + 1);

  return a2sInfo;
}

function readA2sPlayer(buffer: Buffer): A2S_PLAYER {
  const a2sPlayer = {} as A2S_PLAYER;

  // Remove header
  buffer = buffer.slice(4 + 1);

  // Read players
  a2sPlayer.players = buffer.readUInt8(0);
  buffer = buffer.slice(1);

  // Read player list
  a2sPlayer.playerList = [];
  for (let i = 0; i < a2sPlayer.players; i++) {
    // Skip the index byte
    buffer = buffer.slice(1);

    const name = readString(buffer);
    buffer = buffer.slice(buffer.indexOf(0x00) + 1);
    const score = buffer.readInt32LE(0);
    buffer = buffer.slice(4);
    const duration = buffer.readFloatLE(0);
    buffer = buffer.slice(4);

    a2sPlayer.playerList.push({
      name,
      score,
      duration,
    });
  }

  return a2sPlayer;
}

function sendA2sInfoRequest(socket: UdpSocket, host: string, port: number, challenge?: Buffer) {
  // https://developer.valvesoftware.com/wiki/Server_queries#A2S_INFO
  const a2sInfoRequestBuffer = Buffer.concat([
    Buffer.from([0xff, 0xff, 0xff, 0xff]),
    Buffer.from([0x54]),
    Buffer.from('Source Engine Query', 'ascii'),
    Buffer.from([0x00]),
    challenge ? challenge : Buffer.from([0xff, 0xff, 0xff, 0xff]),
  ]);

  socket.send(a2sInfoRequestBuffer, 0, a2sInfoRequestBuffer.length, port, host, (error) => {
    if (error) {
      throw error;
    }
  });
}

function sendA2sPlayerRequest(socket: UdpSocket, host: string, port: number, challenge?: Buffer) {
  // https://developer.valvesoftware.com/wiki/Server_queries#A2S_PLAYER
  const a2sPlayerRequestBuffer = Buffer.concat([
    Buffer.from([0xff, 0xff, 0xff, 0xff]),
    Buffer.from([0x55]),
    challenge ? challenge : Buffer.from([0xff, 0xff, 0xff, 0xff]),
  ]);

  socket.send(a2sPlayerRequestBuffer, 0, a2sPlayerRequestBuffer.length, port, host, (error) => {
    if (error) {
      throw error;
    }
  });
}

export function querySteamServer(host: string, port = 27015, timeoutMs = 10000) {
  return new Promise<SteamServer>((resolve, reject) => {
    const server = {} as SteamServer;
    let ping = -1;
    let pingStart = -1;

    const socket = UDPSockets.createSocket({ type: 'udp4' });

    const socketTimeout = setTimeout(() => {
      socket.close(() => {
        if (server.a2sInfo) {
          resolve(server);
        }

        reject(new Error('Socket timeout'));
      });
    }, timeoutMs);

    socket.bind(randomPort(), (err: Error | undefined) => {
      if (err) {
        socket.close();
        reject(err);
      }
    });

    socket.once('listening', () => {
      try {
        pingStart = Date.now();
        sendA2sInfoRequest(socket, host, port);
      } catch (error) {
        reject(error);
        socket.close();
      }
    });

    socket.on('message', function (data: Buffer) {
      ping = Date.now() - pingStart;

      const header = data.at(4);

      if (header === S2C_CHALLENGE_HEADER) {
        try {
          // Resend status request with challenge number
          const challenge = data.slice(5);

          if (!server.a2sInfo) {
            sendA2sInfoRequest(socket, host, port, challenge);
          } else {
            sendA2sPlayerRequest(socket, host, port, challenge);
          }

          return;
        } catch (error) {
          socket.close();
          reject(error);
        }
      }

      if (header === S2C_INFO_HEADER) {
        server.ping = ping;
        server.a2sInfo = readA2sInfo(data);

        try {
          sendA2sPlayerRequest(socket, host, port);

          return;
        } catch (error) {
          socket.close();
          reject(error);
        }
      }

      if (header === S2C_PLAYER_HEADER) {
        server.a2sPlayer = readA2sPlayer(data);
      }

      socket.close();
      resolve(server);
    });

    socket.on('error', (err) => {
      socket.close();
      reject(err);
    });

    socket.on('close', () => {
      clearTimeout(socketTimeout);
    });
  });
}
