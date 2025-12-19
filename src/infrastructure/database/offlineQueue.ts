/**
 * Offline queue for managing pending changes
 */
import { getRealm } from './realm';
import { PendingChangeSchema } from './schemas';
import { PendingChange } from '../../store/sync.store';

/**
 * Add a change to the offline queue
 */
export function queueChange(change: Omit<PendingChange, 'id' | 'retryCount'>): void {
  const realm = getRealm();
  
  realm.write(() => {
    realm.create('PendingChange', {
      id: `${change.entityType}_${change.entityId}_${Date.now()}`,
      entityType: change.entityType,
      entityId: change.entityId,
      operation: change.operation,
      data: JSON.stringify(change.data),
      timestamp: change.timestamp,
      retryCount: 0,
    });
  });
}

/**
 * Get all pending changes
 */
export function getPendingChanges(): PendingChange[] {
  const realm = getRealm();
  const changes = realm.objects<PendingChangeSchema>('PendingChange').sorted('timestamp');
  
  return Array.from(changes).map((change) => ({
    id: change.id,
    entityType: change.entityType as PendingChange['entityType'],
    entityId: change.entityId,
    operation: change.operation as PendingChange['operation'],
    data: JSON.parse(change.data),
    timestamp: change.timestamp,
    retryCount: change.retryCount,
  }));
}

/**
 * Remove a change from the queue
 */
export function removeChange(changeId: string): void {
  const realm = getRealm();
  
  realm.write(() => {
    const change = realm.objectForPrimaryKey<PendingChangeSchema>('PendingChange', changeId);
    if (change) {
      realm.delete(change);
    }
  });
}

/**
 * Increment retry count for a change
 */
export function incrementRetryCount(changeId: string): void {
  const realm = getRealm();
  
  realm.write(() => {
    const change = realm.objectForPrimaryKey<PendingChangeSchema>('PendingChange', changeId);
    if (change) {
      change.retryCount += 1;
    }
  });
}

/**
 * Clear all pending changes
 */
export function clearPendingChanges(): void {
  const realm = getRealm();
  
  realm.write(() => {
    const changes = realm.objects('PendingChange');
    realm.delete(changes);
  });
}

/**
 * Get count of pending changes
 */
export function getPendingChangesCount(): number {
  const realm = getRealm();
  return realm.objects('PendingChange').length;
}
