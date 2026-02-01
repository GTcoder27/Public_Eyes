import { View, Text, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-slate-900 pt-12 px-6 ">
      <Text className="text-3xl font-bold text-slate-200 m-8">How to use</Text>
      
      <ScrollView className="space-y-4 mt-7" showsVerticalScrollIndicator={false} >
        <View className="bg-slate-900 p-5 rounded-xl border border-slate-200 mt-5">
          <Text className="text-lg font-bold text-blue-600 mb-2">Step 1: Check In</Text>
          <Text className="text-slate-600">
            View the latest updates and announcements on the dashboard.
          </Text>
        </View>

        <View className="bg-slate-900 p-5 rounded-xl border border-slate-200 mt-5">
          <Text className="text-lg font-bold text-blue-600 mb-2">Step 2: File Complaint</Text>
          <Text className="text-slate-600">
            Tap the big blue "+" button in the middle to open the complaint form. 
            Fill in the details and attach photos if necessary.
          </Text>
        </View>

        <View className="bg-slate-900 p-5 rounded-xl border border-slate-200 mt-5">
          <Text className="text-lg font-bold text-blue-600 mb-2">Step 3: Track Status</Text>
          <Text className="text-slate-600">
            You will receive notifications when your complaint status changes.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}