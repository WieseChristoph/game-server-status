import { SQLiteDatabase } from 'expo-sqlite';

export const DATABASE_NAME = 'game-server-status.db';

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  const DATABASE_VERSION = 1;

  let { user_version: currentDbVersion } = (await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version',
  )) ?? { user_version: 0 };
  if (currentDbVersion >= DATABASE_VERSION) {
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
      PRAGMA journal_mode = 'wal';

      CREATE TABLE server (
        id INTEGER PRIMARY KEY NOT NULL,
        position INTEGER NOT NULL,
        type TEXT NOT NULL,
        displayName TEXT NOT NULL,
        address TEXT NOT NULL,
        port INTEGER NOT NULL
      );
    `);

    currentDbVersion = 1;
  }

  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}
