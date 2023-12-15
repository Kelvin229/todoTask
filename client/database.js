import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const databaseConfig = {
  name: 'TasksDB.db',
  version: '1.0',
  displayName: 'SQLite React Offline Database',
  size: 200000,
};

export const initDB = async () => {
  try {
    console.log('Plugin integrity check ...');
    await SQLite.echoTest();
    console.log('Integrity check passed ...');

    const db = await SQLite.openDatabase(databaseConfig);
    console.log('Database OPEN');

    await db.executeSql(
      'CREATE TABLE IF NOT EXISTS Tasks (id INTEGER PRIMARY KEY NOT NULL, title TEXT, completed INTEGER);',
    );
    console.log('Table created successfully');

    return db;
  } catch (error) {
    console.error('Database initialization failed', error);
  }
};
