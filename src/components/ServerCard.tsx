import { View, Animated, TouchableHighlight } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import Svg, { Line, Path } from "react-native-svg";
import useServer from "~/hooks/useServer";

import MinecraftServer from "~/types/MinecraftServer";
import { Server, ServerType } from "~/types/Server";
import SteamServer from "~/types/SteamServer";
import MinecraftServerInfo from "./MinecraftServerInfo";
import SteamServerInfo from "./SteamServerInfo";
import { useRouter } from "expo-router";

const ServerCard: React.FC<{ server: Server }> = ({ server }) => {
	const router = useRouter();
	const { removeServer, getConnectionString } = useServer();

	return (
		<Swipeable
			renderLeftActions={(progress, dragAnimatedValue) =>
				renderLeftActions(
					() =>
						router.push({
							pathname: "/editServer",
							params: { server: getConnectionString(server) },
						}),
					progress,
					dragAnimatedValue
				)
			}
			renderRightActions={(progress, dragAnimatedValue) =>
				renderRightActions(() => removeServer(server), progress, dragAnimatedValue)
			}
		>
			<View className="bg-[#2f333f] p-2 shadow-lg shadow-black rounded-md mx-4 mb-4 flex flex-row items-center min-h-[125px]">
				{server.type === ServerType.Minecraft ? (
					<View style={{ width: 48, height: 8 }}>
						<Svg viewBox="0 10 24 4" width="48" height="8" fill="white">
							<Path d="M23.7397 10.0058l-2.4424.0023-.076.1198-.03-.1175h-2.4586l-.0599.136-.023-.136-2.4793.0023-.0438.1613-.0161-.1613-2.5023.0023-.023.265-.007-.265-2.5184.0046-.0092.242-.0254-.242-2.4954.0023-.016.1567-.0439-.1567H7.2673l-.0968.6705-.0553-.1382-.0254-.0024-.2096-.53-1.189.0024-.023.129-.0622-.129H4.431l-.03.1198-.0691-.1198-1.1659.0023-.136.523h-.3156l-.06.2282-.5506-.7512-1.1337.0023L0 13.0403l1.03.954h1.1244l.1774-.6706.0876.0968h.2995l.5.5737h1.1544l.023-.1082.0807.1082h1.1636l.0207-.1175.0737.1175h1.1751l.09-.629.3018.629h1.1889l.0138-.1451.0507.1451H11.03l.0093-.228.0276.228h2.4954l.023-.2511.0093.2511h1.2235l.0392-.175.0115.175h1.2097l.0506-.152.0139.152h1.1958l.0622-.1336.0185.1336h1.1843l.0714-.122.0208.122h1.175l.6798-.9677-.0323-.1544h.3756l.5346-.7396.4562 1.8594h1.152L24 13.0334l-.0184-.0737-.0738-.2535-.069-.2327s-.219-.712-.2466-.8065c-.0346-.1152-.0714-.2327-.1037-.3456l-.0046-.0184.4838-.583zm-2.325.1682h2.2005l.1567.493h-.6383l.0046.0162c.0254.1083.0554.2189.0853.3295.03.1129.0645.2258.0968.3433.0345.1152.069.235.106.3525.0368.1199.0737.2374.1083.3572.023.0737.0438.1451.0668.2189.023.0737.046.1497.0691.2235l.0692.228c.023.0761.0437.1522.0667.2282h-.9976l-.6268-2.2973h-.6405zm-.3548.0023l.1222.493h-1.295l.1175.56h1.3134l.136.553h-1.3342l.2466 1.182-.9954.0023-.5093-2.788zm-2.553.0023l.4816 2.788h-.9954l-.129-.8986h-.3733l.1221.8986h-.9954l-.3064-2.7857zm-2.5484.0023l.1037 1.0322h-.3272l.03.3111h.3272l.1451 1.4424h-.993l-.09-1.1751-.3686-.0092.076 1.1843h-.993l-.1037-2.7834zm-2.546.0023l.0138.493h-1.272l-.0299 1.719h1.3503l.016.5737h-2.364l.0945-2.7834zm-2.5438.0023l-.0208.493H9.56l-.0415.5692 1.3042.0023-.023.5369-1.3296.0023-.0437.6014 1.3456.0045-.0253.5738H8.387l.2926-2.7811zm-2.5392.0023l-.3226 2.781h-.9908l.1245-.8847-.3273-.0092.083-.5737-.3594-.007-.235 1.477H5.311l.5184-2.7811h.917l-.0806.5138.3157.0092-.076.5369.3548.0046L7.41 10.19zm-5.0346.0046h.9171l-.6475 2.7788h-.9884l.2972-1.1797H2.516l-.1543.5737h-.6406l.159-.5737h-.3595l-.3502 1.1797h-.97l.8917-2.7765h.8986l-.1475.5046.3134.0115L2 11.257h.6959l.1451-.5391h.318zm2.182.0046l-.546 2.7811h-.9885l.6175-2.7788zm12.1683.4217l.0391.3248-.341-.0023-.0437-.3202h-.4217l.0438.3525h.387l.0185.129h-.1936l.0715.5461h.2327l-.0184-.1843.3456-.0023.03.1866h.2373l-.083-.5414h-.1935l-.0162-.1314.3963-.0023-.0553-.3548zm-2.9286.0553l.0369.5737h.364l-.0438-.5737zm-1.1958 1.0046l.0184.5484-1.2166-.0023.0115-.4102h1.1774Z" />
						</Svg>
					</View>
				) : (
					<View style={{ width: 48, height: 48 }}>
						<Svg viewBox="0 0 24 24" width="48" height="48" fill="white">
							<Path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z" />
						</Svg>
					</View>
				)}
				<View className="ml-2 pl-2 border-l border-white grow h-full">
					{server.type === ServerType.Minecraft ? (
						<MinecraftServerInfo
							displayName={server.displayName}
							address={server.address}
							port={server.port}
							data={server.data as MinecraftServer}
						/>
					) : (
						<SteamServerInfo
							displayName={server.displayName}
							address={server.address}
							port={server.port}
							data={server.data as SteamServer}
						/>
					)}
				</View>
			</View>
		</Swipeable>
	);
};

const renderLeftActions = (
	onEditPress: () => void,
	progress: Animated.AnimatedInterpolation<string | number>,
	dragAnimatedValue: Animated.AnimatedInterpolation<string | number>
) => {
	return (
		<TouchableHighlight onPress={onEditPress}>
			<Animated.View className="bg-yellow-500 p-2 rounded-md ml-4 mb-4 flex grow justify-center">
				<Svg
					width="32"
					height="32"
					viewBox="0 0 24 24"
					stroke="white"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
					<Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
				</Svg>
			</Animated.View>
		</TouchableHighlight>
	);
};

const renderRightActions = (
	onDeletePress: () => void,
	progress: Animated.AnimatedInterpolation<string | number>,
	dragAnimatedValue: Animated.AnimatedInterpolation<string | number>
) => {
	return (
		<TouchableHighlight onPress={onDeletePress}>
			<Animated.View className="bg-red-500 p-2 rounded-md mr-4 mb-4 flex grow justify-center">
				<Svg
					width="32"
					height="32"
					viewBox="0 0 24 24"
					stroke="white"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<Path d="M3 6h18" />
					<Path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
					<Path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
					<Line x1="10" x2="10" y1="11" y2="17" />
					<Line x1="14" x2="14" y1="11" y2="17" />
				</Svg>
			</Animated.View>
		</TouchableHighlight>
	);
};

export default ServerCard;
