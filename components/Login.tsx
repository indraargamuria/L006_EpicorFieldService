import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect } from 'react';
import api from '../utils/api'; // Import your api setup
import UserInactivity from 'react-native-user-inactivity';

interface Props {
  setIsClicked: (source: string) => void;
  setIsLoggedIn: (source: boolean) => void;
}
export const Login = ({ setIsClicked, setIsLoggedIn }: Props) => {
  const [username, setUsername] = useState('OpexArga');
  const [password, setPassword] = useState('Nilam172459');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync('isLoggedIn'); // atau key lain yang kamu pakai
      await SecureStore.deleteItemAsync('loginTimestamp'); // atau key lain yang kamu pakai
      setError('Logout Success');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkSession = async () => {
    const isLoggedIn = await SecureStore.getItemAsync('isLoggedIn');
    const loginTimestamp = await SecureStore.getItemAsync('loginTimestamp');

    const loginStatus = isLoggedIn == null ? 'Session Inactive' : 'Active';
    setError(loginStatus);

    return false; // Not logged in
  };

  // Login function
  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // Prepare the payload for the request
      const payload = {
        userID: username,
        password: password,
      };

      // Make the POST request with the correct payload
      const response = await api.post('/Ice.BO.UserFileSvc/ValidatePassword', payload);

      // Check if the returnObj field is true for success
      if (response.data && response.data.returnObj) {
        await SecureStore.setItemAsync('isLoggedIn', 'true'); // Store login flag
        await SecureStore.setItemAsync('loginTimestamp', Date.now().toString()); // Store timestamp
        setIsLoggedIn(true);
        // Store the session token (if provided by the API) securely
        //await SecureStore.setItemAsync('userToken', 'your-session-token'); // Replace with actual token if returned
        // Navigate to the home page or another screen
        // navigation.replace('Home');
        setError('Good');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
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
        <View className="mb-4">
          <TextInput
            className="w-full rounded-full bg-gray-100 px-4 py-3 text-gray-700"
            placeholder="User"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View className="relative mb-4">
          <TextInput
            className="w-full rounded-full bg-gray-100 px-4 py-3 text-gray-700"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {error && <Text className="mb-4 text-red-500">{error}</Text>}
        <TouchableOpacity
          className="w-full rounded-full bg-blue-400 py-3"
          onPress={handleLogin}
          disabled={loading}>
          {loading ? (
            <Text className="text-center text-lg font-bold text-white">Loading...</Text>
          ) : (
            <Text className="text-center text-lg font-bold text-white">Login</Text>
          )}
        </TouchableOpacity>
        {/* <TouchableOpacity
          className="mt-4 w-full rounded-full bg-green-400 py-3"
          onPress={checkSession}
          disabled={loading}>
          <Text className="text-center text-lg font-bold text-white">Check Session</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-4 w-full rounded-full bg-red-400 py-3"
          onPress={logout}
          disabled={loading}>
          <Text className="text-center text-lg font-bold text-white">Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-4 w-full rounded-full bg-blue-400 py-3"
          onPress={() => setIsClicked('LOGIN NIH BOS')} // Set value to 'from homepage'
        >
          <Text className="text-center text-lg font-bold text-white">Update App State</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold text-color-500`,
};
