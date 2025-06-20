import * as SecureStore from 'expo-secure-store';

export const secureStoreAdapter = {
  getItem: async (key) => await SecureStore.getItemAsync(key),
  setItem: async (key, value) => await SecureStore.setItemAsync(key, value),
  removeItem: async (key) => await SecureStore.deleteItemAsync(key),
};

