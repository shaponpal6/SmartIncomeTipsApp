import React, { createContext, useContext, ReactNode } from 'react';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
import { migrateDbIfNeeded } from './database';
import { insertDataWithTransaction as insertDataWithTransactionFn } from './dataStoreService';
import {
  getPostById as fetchPostById,
  getCategories as fetchCategories,
  getTags as fetchTags,
  searchPosts as fetchSearchPosts,
  homePageData as fetchHomePageData,
  isDataEmpty as fetchIsDataEmpty,
  getUserChoose as _getUserChoose,
  type SearchPostsArgs
} from './dataService';
import {type insertDataWithTransactionType} from './types'

// Create a context for sharing database access
interface SQLiteDatabaseContextType {
  db: SQLiteDatabase;
  insertDataWithTransaction: (data: insertDataWithTransactionType) => Promise<void>;
  getCategories: () => Promise<unknown>;
  getPostById: (id: number) => Promise<unknown>;
  getTags: () => Promise<unknown>;
  searchPosts: (args: SearchPostsArgs) => Promise<unknown>;
  homePageData: () => Promise<unknown>;
  isDataEmpty: () => Promise<unknown>;
  migrateDB: () => Promise<unknown>;
  getUserChoose: () => Promise<unknown>;
}

const SQLiteDatabaseContext = createContext<SQLiteDatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(SQLiteDatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a SQLiteDatabaseProvider');
  }
  return context;
};

export const SQLiteDatabaseProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded}>
      <DatabaseInitializer>{children}</DatabaseInitializer>
    </SQLiteProvider>
  );
};

const DatabaseInitializer = ({ children }: { children: ReactNode }) => {
  const db = useSQLiteContext();

  // Wrap all functions so that they use the `db` from the context
  const insertDataWithTransaction = (data: insertDataWithTransactionType) => insertDataWithTransactionFn(db, data);
  const getPostById = (id: number) => fetchPostById(db, id);
  const getCategories = () => fetchCategories(db);
  const getTags = () => fetchTags(db);
  const searchPosts = (args: SearchPostsArgs) => fetchSearchPosts(db, args);
  const homePageData = () => fetchHomePageData(db);
  const isDataEmpty = () => fetchIsDataEmpty(db);
  const migrateDB = () => migrateDbIfNeeded(db);
  const getUserChoose = () => _getUserChoose(db);

  return (
    <SQLiteDatabaseContext.Provider
      value={{
        db,
        insertDataWithTransaction,
        getPostById,
        getUserChoose,
        getCategories,
        getTags,
        searchPosts,
        homePageData,
        isDataEmpty,
        migrateDB
      }}
    >
      {children}
    </SQLiteDatabaseContext.Provider>
  );
};
