/**
 * Property Store
 * Manages property-related state using Zustand
 */

import { create } from 'zustand';
import { Property } from '../types';

interface PropertyState {
  selectedPropertyId: string | null;
  properties: Property[];
  isLoading: boolean;
  error: string | null;
}

interface PropertyActions {
  setSelectedProperty: (propertyId: string | null) => void;
  setProperties: (properties: Property[]) => void;
  addProperty: (property: Property) => void;
  updateProperty: (id: string, property: Property) => void;
  removeProperty: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  getSelectedProperty: () => Property | null;
}

type PropertyStore = PropertyState & PropertyActions;

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  // Initial state
  selectedPropertyId: null,
  properties: [],
  isLoading: false,
  error: null,

  // Actions
  setSelectedProperty: (propertyId) => {
    set({ selectedPropertyId: propertyId });
  },

  setProperties: (properties) => {
    set({ properties });
  },

  addProperty: (property) => {
    set((state) => ({
      properties: [...state.properties, property],
    }));
  },

  updateProperty: (id, property) => {
    set((state) => ({
      properties: state.properties.map((p) => (p.id === id ? property : p)),
    }));
  },

  removeProperty: (id) => {
    set((state) => ({
      properties: state.properties.filter((p) => p.id !== id),
      selectedPropertyId:
        state.selectedPropertyId === id ? null : state.selectedPropertyId,
    }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  setError: (error) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  getSelectedProperty: () => {
    const { selectedPropertyId, properties } = get();
    if (!selectedPropertyId) return null;
    return properties.find((p) => p.id === selectedPropertyId) || null;
  },
}));
