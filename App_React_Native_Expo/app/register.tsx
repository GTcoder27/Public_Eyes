import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import backendApi from './src/config/backendApi';



export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await backendApi.post('/auth/register', {
        name: name,
        email: email,
        password: password
      });
      console.log(response.data); 

      console.log("Account Created Successfully");
      Alert.alert('Success', 'Account created! Please login.');
      router.push('/login');
    } catch (error: any) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Registration failed');
      } else {
        Alert.alert('Error', 'Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 p-6 justify-center bg-slate-50">
      <Text className="text-3xl font-bold text-center mb-8 text-black">
        Register
      </Text>

      <TextInput 
        placeholder="Name" 
        className="border border-indigo-200 rounded-xl p-3.5 mb-4 bg-white text-base"
        value={name}
        onChangeText={setName}
      />
      
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
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity 
        className={`bg-green-600 p-3.5 rounded-xl mt-2 ${loading ? 'opacity-70' : 'opacity-100'}`}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text className="text-white text-center text-lg font-semibold">
          {loading ? 'Creating Account...' : 'Create Account'}
        </Text>
      </TouchableOpacity>

      <View className="mt-5 flex-row justify-center">
        <Text className="text-gray-600">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text className="text-blue-600 font-medium">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}