import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ServerProvider } from "~/context/ServerContext";

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
	return (
		<SafeAreaProvider>
			<ServerProvider>
				{/*
          The Stack component displays the current page.
          It also allows you to configure your screens 
        */}
				<Stack
					screenOptions={{
						headerStyle: {
							backgroundColor: "#17191f",
						},
					}}
				/>
				<StatusBar />
			</ServerProvider>
		</SafeAreaProvider>
	);
};

export default RootLayout;
