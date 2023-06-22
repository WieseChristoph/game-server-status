import { Text } from "react-native";
import { MinecraftServerDescription } from "~/types/MinecraftServer";

function getHexColor(color: string | undefined) {
	switch (color) {
		case "0":
		case "black":
			return "#000000";
		case "f":
		case "white":
			return "#FFFFFF";
		case "c":
		case "red":
			return "#FF5555";
		case "4":
		case "dark_red":
			return "#AA0000";
		case "a":
		case "green":
			return "#55FF55";
		case "2":
		case "dark_green":
			return "#00AA00";
		case "9":
		case "blue":
			return "#5555FF";
		case "1":
		case "dark_blue":
			return "#0000AA";
		case "b":
		case "aqua":
			return "#55FFFF";
		case "3":
		case "dark_aqua":
			return "#00AAAA";
		case "d":
		case "light_purple":
			return "#FF55FF";
		case "5":
		case "dark_purple":
			return "#AA00AA";
		case "e":
		case "yellow":
			return "#FFFF55";
		case "6":
		case "gold":
			return "#FFAA00";
		case "7":
		case "gray":
			return "#AAAAAA";
		case "8":
		case "dark_gray":
			return "#555555";
		default:
			return "#FFFFFF";
	}
}

function motdStringToJsx(motd: string) {
	let color = "#FFFFFF";
	let bold = false;
	let italic = false;
	let underlined = false;
	let strikethrough = false;

	return motd.split(/(§[0-9a-fk-or])/g).map((part, i) => {
		if (part.startsWith("§")) {
			switch (part.slice(1)) {
				case "l":
					bold = true;
					break;
				case "m":
					strikethrough = true;
					break;
				case "n":
					underlined = true;
					break;
				case "o":
					italic = true;
					break;
				default:
					color = getHexColor(part[1]);
			}
			return null;
		} else
			return (
				<Text
					style={{
						color: color,
						fontWeight: bold ? "bold" : "normal",
						fontStyle: italic ? "italic" : "normal",
						textDecorationLine: underlined
							? strikethrough
								? "underline line-through"
								: "underline"
							: "none",
					}}
				>
					{part}
				</Text>
			);
	});
}

const MinecraftMotd: React.FC<{ motd: string | MinecraftServerDescription }> = ({ motd }) => {
	if (typeof motd === "string" || motd.extra === undefined)
		return (
			<Text style={{ color: "#FFFFFF" }}>
				{motdStringToJsx(typeof motd === "string" ? motd : motd.text)}
			</Text>
		);
	else
		return (
			<>
				{motd.extra.map((part) => (
					<Text
						style={{
							color: getHexColor(part.color),
							fontWeight: part.bold ? "bold" : "normal",
							fontStyle: part.italic ? "italic" : "normal",
							textDecorationLine: part.underlined
								? part.strikethrough
									? "underline line-through"
									: "underline"
								: "none",
						}}
					>
						{part.text}
					</Text>
				))}
			</>
		);
};

export default MinecraftMotd;
