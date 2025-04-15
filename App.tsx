import { Text, View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';
import { Homepage } from 'components/Homepage';
import { Login } from 'components/Login'; // pastikan file Login.tsx ada

import './global.css';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [isClicked, setIsClicked] = useState(''); // State untuk menampung nilai
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading state

  // Fungsi untuk mengubah state isClicked
  const handleClick = (source: string) => {
    setIsClicked(source); // Update state dengan sumber (homepage atau login)
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loginStatus = await SecureStore.getItemAsync('isLoggedIn');
      setIsLoggedIn(loginStatus === 'true'); // simpan dalam boolean
      console.log('Login status from SecureStore:', loginStatus); // Log status login
    };

    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Checking login status...</Text>
      </View>
    );
  }

  //return isLoggedIn ? <Homepage /> : <Login />;
  return (
    <SafeAreaView className="flex-1">
      {/* Display isClicked text */}
      <View className="bg-gray-100 p-4">
        <Text className="text-center text-xl font-bold">isClicked: {isClicked}</Text>
      </View>

      <View className="flex-1 flex-row">
        {/* Homepage takes the left half of the screen */}
        <View className="flex-1 border-r border-gray-200">
          <Homepage setIsClicked={handleClick} />
        </View>

        {/* Login takes the right half of the screen */}
        <View className="flex-1">
          <Login setIsClicked={handleClick} />
        </View>
      </View>
    </SafeAreaView>
  );
}
