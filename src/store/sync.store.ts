/**
 * Sync store for managing offline/online state and synchronization
 */
import { create } from 'zustand';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export interface PendingChange {
  id: string;
  entityType: 'Room' | 'Tenant' | 'PaymentRecord' | 'Property';
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: Date;
  retryCount: number;
}

interface SyncStore {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAt: Date | null;
  pendingChanges: number;
  syncError: string | null;

  // Actions
  setOnline: (online: boolean) => void;
  setSyncing: (syncing: boolean) => void;
  setLastSyncAt: (date: Date) => void;
  setPendingChanges: (count: number) => void;
  setSyncError: (error: string | null) => void;
  incrementPendingChanges: () => void;
  decrementPendingChanges: () => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
  isOnline: true,
  isSyncing: false,
  lastSyncAt: null,
  pendingChanges: 0,
  syncError: null,

  setOnline: (online) => set({ isOnline: online }),
  setSyncing: (syncing) => set({ isSyncing: syncing }),
  setLastSyncAt: (date) => set({ lastSyncAt: date }),
  setPendingChanges: (count) => set({ pendingChanges: count }),
  setSyncError: (error) => set({ syncError: error }),
  incrementPendingChanges: () =>
    set((state) => ({ pendingChanges: state.pendingChanges + 1 })),
  decrementPendingChanges: () =>
    set((state) => ({ pendingChanges: Math.max(0, state.pendingChanges - 1) })),
}));

/**
 * Initialize network state listener
 */
export function initializeNetworkListener(): () => void {
  const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
    const isConnected = state.isConnected ?? false;
    useSyncStore.getState().setOnline(isConnected);
  });

  // Get initial state
  NetInfo.fetch().then((state) => {
    const isConnected = state.isConnected ?? false;
    useSyncStore.getState().setOnline(isConnected);
  });

  return unsubscribe;
}
