import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';
import api from '../utils/api'; // Import your api setup

// Mendefinisikan tipe Props untuk menerima fungsi setIsClicked
interface Props {
  setIsClicked: (source: string) => void;
  setIsLoggedIn: (source: boolean) => void;
}
export const Homepage = ({ setIsClicked, setIsLoggedIn }: Props) => {
  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('isLoggedIn'); // atau key lain yang kamu pakai
      await SecureStore.deleteItemAsync('loginTimestamp'); // atau key lain yang kamu pakai\
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <View className={styles.container}>
      <Text>Homepage</Text>
      <TouchableOpacity className="mt-4 w-full rounded-full bg-red-400 py-3" onPress={logout}>
        <Text className="text-center text-lg font-bold text-white">Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4 w-full rounded-full bg-blue-400 py-3"
        onPress={() => setIsClicked('HOMEPAGE MANTAP')} // Set value to 'from homepage'
      >
        <Text className="text-center text-lg font-bold text-white">Update App State</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-color-500`,
};
