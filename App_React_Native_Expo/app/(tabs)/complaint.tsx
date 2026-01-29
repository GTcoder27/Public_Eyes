import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ComplaintScreen() {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <View className="flex-1 bg-slate-900 pt-12 px-5">
      <Text className="text-2xl font-bold text-slate-100 mb-6">New Complaint</Text>

      <View className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 gap-5">
        <Text className="text-slate-100 font-medium mb-2">Subject</Text>
        <TextInput 
          className="border border-slate-300 rounded-lg p-3 mb-4 bg-slate-50"
          placeholder="e.g. Broken streetlight"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="text-slate-100 font-medium mb-2">Description</Text>
        <TextInput 
          className="border border-slate-300 rounded-lg p-3 mb-6 bg-slate-50 h-32"
          placeholder="Describe the issue in detail..."
          multiline
          textAlignVertical="top"
          value={desc}
          onChangeText={setDesc}
        />

        <TouchableOpacity className="bg-blue-600 p-4 rounded-xl items-center">
          <Text className="text-white font-bold text-lg">Submit Complaint</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}