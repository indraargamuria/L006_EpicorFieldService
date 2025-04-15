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
    <View className="flex-1 items-center justify-center bg-white">
      <View className="w-full max-w-xs text-center">
        <View className="mb-6">
          <Image
            source={{
              uri: 'https://media.licdn.com/dms/image/v2/C560BAQEEytOEph7Mcw/company-logo_200_200/company-logo_200_200/0/1630647912132/epicor_software_corp_logo?e=2147483647&v=beta&t=Mfo7Jn7eDMf4J4cfSMHCIjVS0vsTKcmmLCXUzMMn1DE',
            }}
            className="mx-auto"
            style={{ width: 100, height: 100 }}
            alt="Epicor logo"
          />
        </View>
        <Text className="mb-2 text-2xl font-bold">Epicor FS Management</Text>
        <Text className="mb-6 text-gray-500">One Tap Solution for FS</Text>
        <TouchableOpacity className="mt-4 w-full rounded-full bg-red-400 py-3" onPress={logout}>
          <Text className="text-center text-lg font-bold text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-color-500`,
};
