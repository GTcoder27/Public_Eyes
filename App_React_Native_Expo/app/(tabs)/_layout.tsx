import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false,
      tabBarActiveTintColor: '#5FD9C2', 
      tabBarInactiveTintColor: '#94a3b8', 
      tabBarActiveBackgroundColor: "#061714",
      tabBarInactiveBackgroundColor:"#061714",
      tabBarStyle: {
        height: 69,
        paddingBottom: 0,
        paddingTop: 0,
      }
    }}>

      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="complaint"
        options={{
          title: 'Complaint', 
          tabBarIcon: ({ focused }) => (
            <View className="bg-blue-600 w-14 h-14 rounded-full justify-center items-center mb-8 shadow-lg shadow-blue-100">
              <FontAwesome name="plus" size={24} color="white" />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}