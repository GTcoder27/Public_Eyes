import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View className="flex-1 bg-slate-900 justify-center items-center px-6">
      <View className="w-24 h-24 bg-blue-100 rounded-full justify-center items-center mb-4">
        <Text className="text-4xl">👤</Text>
      </View>
      
      <Text className="text-2xl font-bold text-slate-200 mb-2">User Profile</Text>
      <Text className="text-slate-500 mb-10">user@example.com</Text>

      <TouchableOpacity 
        className="bg-red-500 w-full p-4 rounded-xl items-center"
        onPress={handleLogout}
      >
        <Text className="text-white font-bold text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}