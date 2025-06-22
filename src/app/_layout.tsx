import React from 'react';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ServerProvider } from '~/context/ServerContext';
import { RootSiblingParent } from 'react-native-root-siblings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DATABASE_NAME, migrateDbIfNeeded } from '~/utils/db';
import { SQLiteProvider } from 'expo-sqlite';

import '../../global.css';

// This is the main layout of the app
// It wraps your pages with the providers they need
const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrateDbIfNeeded}>
        <ServerProvider>
          <RootSiblingParent>
            <GestureHandlerRootView>
              {/*
							The Stack component displays the current page.
							It also allows you to configure your screens 
						*/}
              <Stack
                screenOptions={{
                  headerStyle: {
                    backgroundColor: '#17191f',
                  },
                }}
              />
              <StatusBar translucent={false} />
            </GestureHandlerRootView>
          </RootSiblingParent>
        </ServerProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
