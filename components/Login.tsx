import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useState } from 'react';
import api from '../utils/api'; // Import your api setup

export const Login = () => {
  const [username, setUsername] = useState('OpexArga');
  const [password, setPassword] = useState('Nilam172459');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      console.log(response.data); // Log the response to inspect it

      // Check if the returnObj field is true for success
      if (response.data && response.data.returnObj) {
        console.log('Login success');
        // Store the session token (if provided by the API) securely
        //await SecureStore.setItemAsync('userToken', 'your-session-token'); // Replace with actual token if returned
        // Navigate to the home page or another screen
        // navigation.replace('Home');
        setError('Good');
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error(err); // Log the error to see the detailed response
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
        <Text className="text-2xl font-bold mb-2">Epicor FS Managements</Text>
        <Text className="text-gray-500 mb-6">One Tap Solution for FS</Text>
        <View className="mb-4">
          <TextInput
            className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-700"
            placeholder="User"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View className="mb-4 relative">
          <TextInput
            className="w-full px-4 py-3 rounded-full bg-gray-100 text-gray-700"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {error && <Text className="text-red-500 mb-4">{error}</Text>}
        <TouchableOpacity
          className="w-full py-3 rounded-full bg-blue-400"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <Text className="text-white font-bold text-lg text-center">Loading...</Text>
          ) : (
            <Text className="text-white font-bold text-lg text-center">LOGIN</Text>
          )}
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
