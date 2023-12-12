// modified from https://github.com/firebase/firebase-js-sdk/blob/master/packages/auth/src/platform_react_native/persistence/react_native.ts

/**
 * An interface covering the possible persistence mechanism types.
 *
 * @public
 */
export interface Persistence {
  /**
   * Type of Persistence.
   * - 'SESSION' is used for temporary persistence such as `sessionStorage`.
   * - 'LOCAL' is used for long term persistence such as `localStorage` or `IndexedDB`.
   * - 'NONE' is used for in-memory, or no persistence.
   */
  readonly type: 'SESSION' | 'LOCAL' | 'NONE';
}

/**
 * Interface for a supplied `AsyncStorage`.
 *
 * @public
 */
export interface ReactNativeAsyncStorage {
  /**
   * Persist an item in storage.
   *
   * @param key - storage key.
   * @param value - storage value.
   */
  setItem(key: string, value: string): Promise<void>;
  /**
   * Retrieve an item from storage.
   *
   * @param key - storage key.
   */
  getItem(key: string): Promise<string | null>;
  /**
   * Remove an item from storage.
   *
   * @param key - storage key.
   */
  removeItem(key: string): Promise<void>;
}

export const enum PersistenceType {
  SESSION = 'SESSION',
  LOCAL = 'LOCAL',
  NONE = 'NONE',
}

export type PersistedBlob = Record<string, unknown>;

export interface Instantiator<T> {
  (blob: PersistedBlob): T;
}

export type PersistenceValue = PersistedBlob | string;

export const STORAGE_AVAILABLE_KEY = '__sak';

export interface StorageEventListener {
  (value: PersistenceValue | null): void;
}

export interface PersistenceInternal extends Persistence {
  type: PersistenceType;
  _isAvailable(): Promise<boolean>;
  _set(key: string, value: PersistenceValue): Promise<void>;
  _get<T extends PersistenceValue>(key: string): Promise<T | null>;
  _remove(key: string): Promise<void>;
  _addListener(key: string, listener: StorageEventListener): void;
  _removeListener(key: string, listener: StorageEventListener): void;
  // Should this persistence allow migration up the chosen hierarchy?
  _shouldAllowMigration?: boolean;
}

/**
 * Returns a persistence object that wraps `AsyncStorage` imported from
 * `react-native` or `@react-native-community/async-storage`, and can
 * be used in the persistence dependency field in {@link initializeAuth}.
 *
 * @public
 */
export function getReactNativePersistence(
  storage: ReactNativeAsyncStorage
): Persistence {
  // In the _getInstance() implementation (see src/core/persistence/index.ts),
  // we expect each "externs.Persistence" object passed to us by the user to
  // be able to be instantiated (as a class) using "new". That function also
  // expects the constructor to be empty. Since ReactNativeStorage requires the
  // underlying storage layer, we need to be able to create subclasses
  // (closures, esentially) that have the storage layer but empty constructor.
  return class implements PersistenceInternal {
    static type: 'LOCAL' = 'LOCAL';
    readonly type: PersistenceType = PersistenceType.LOCAL;

    async _isAvailable(): Promise<boolean> {
      try {
        if (!storage) {
          return false;
        }
        await storage.setItem(STORAGE_AVAILABLE_KEY, '1');
        await storage.removeItem(STORAGE_AVAILABLE_KEY);
        return true;
      } catch {
        return false;
      }
    }

    _set(key: string, value: PersistenceValue): Promise<void> {
      return storage.setItem(key, JSON.stringify(value));
    }

    async _get<T extends PersistenceValue>(key: string): Promise<T | null> {
      const json = await storage.getItem(key);
      return json ? JSON.parse(json) : null;
    }

    _remove(key: string): Promise<void> {
      return storage.removeItem(key);
    }

    _addListener(_key: string, _listener: StorageEventListener): void {
      // Listeners are not supported for React Native storage.
    }

    _removeListener(_key: string, _listener: StorageEventListener): void {
      // Listeners are not supported for React Native storage.
    }
  };
}
