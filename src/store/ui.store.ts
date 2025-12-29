/**
 * UI Store
 * Manages UI-related state like selected property
 */

import { create } from 'zustand';

interface UIState {
  selectedPropertyId: string | null;
}

interface UIActions {
  setSelectedPropertyId: (propertyId: string | null) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set) => ({
  // Initial state
  selectedPropertyId: null,

  // Actions
  setSelectedPropertyId: (propertyId) => {
    set({ selectedPropertyId: propertyId });
  },
}));
