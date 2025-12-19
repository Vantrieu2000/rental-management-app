/**
 * Realm database configuration and initialization
 */
import Realm from 'realm';
import { schemas } from './schemas';

const SCHEMA_VERSION = 1;

let realmInstance: Realm | null = null;

/**
 * Initialize Realm database
 */
export async function initializeRealm(): Promise<Realm> {
  if (realmInstance) {
    return realmInstance;
  }

  try {
    realmInstance = await Realm.open({
      schema: schemas,
      schemaVersion: SCHEMA_VERSION,
      deleteRealmIfMigrationNeeded: __DEV__, // Only in development
    });

    return realmInstance;
  } catch (error) {
    console.error('Failed to initialize Realm:', error);
    throw error;
  }
}

/**
 * Get the current Realm instance
 */
export function getRealm(): Realm {
  if (!realmInstance) {
    throw new Error('Realm not initialized. Call initializeRealm() first.');
  }
  return realmInstance;
}

/**
 * Close Realm database
 */
export function closeRealm(): void {
  if (realmInstance && !realmInstance.isClosed) {
    realmInstance.close();
    realmInstance = null;
  }
}

/**
 * Clear all data from Realm (for testing or logout)
 */
export async function clearRealm(): Promise<void> {
  const realm = getRealm();
  realm.write(() => {
    realm.deleteAll();
  });
}
