import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import backendApi from './src/config/backendApi';
import { useAuth } from './src/context/AuthContext';



export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await backendApi.post('/auth/login', {
        email: email,
        password: password
      });

      console.log(response.data);
      
      // Assuming response.data contains the token property
      // Adjust 'response.data.token' based on your actual API response structure
      if (response.data?.token) {
        await login(response.data.access_token);
      }
      
      Alert.alert('Success', 'Welcome back!');
      router.replace('/(tabs)/home'); 
    } 
    catch (error: any) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Invalid credentials');
      } else if (error.request) {
        Alert.alert('Error', 'No response from server. Check your connection.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred');
      }
    } 
    finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6 justify-center bg-slate-50">
      <Text className="text-3xl font-bold text-center mb-8 text-black">
        Login
      </Text>

      <TextInput
        placeholder="Email"
        className="border border-indigo-200 rounded-xl p-3.5 mb-4 bg-white text-base"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        className="border border-indigo-200 rounded-xl p-3.5 mb-4 bg-white text-base"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity 
        className={`bg-blue-600 p-3.5 rounded-xl mt-2 ${loading ? 'opacity-70' : 'opacity-100'}`}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-center text-lg font-semibold">
           {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <View className="mt-5 flex-row justify-center">
        <Text className="text-gray-600">Don’t have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text className="text-blue-600 font-medium">Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}