import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import backendApi from '../config/backendApi';
import { Video, ResizeMode } from 'expo-av';


interface Complaint {
  id: number;
  status: string;
  message: string;
  evidenceUrls: string[];
}

const AllComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await backendApi.get('/user/all/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-slate-50">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-slate-500 mt-2">Loading Complaints...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 pt-12 px-4">
      <Text className="text-2xl font-bold text-slate-800 mb-6">My All Complaints</Text>

      {complaints.length === 0 ? (
        <View className="items-center mt-10">
            <Text className="text-slate-400">No complaints found.</Text>
        </View>
      ) : (
        complaints.map((item) => (
            <View key={item.id} className="bg-white p-4 rounded-xl mb-4 border border-slate-200 shadow-sm">
            
            {/* Card Header: ID and Status Badge */}
            <View className="flex-row justify-between items-center mb-3 border-b border-slate-100 pb-2">
                <Text className="text-slate-400 font-bold text-xs">ID: #{item.id}</Text>
                
                {/* Dynamic Badge Color based on status */}
                <View className={`px-2 py-1 rounded-md ${
                    item.status === 'SOLVED' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                    <Text className={`font-bold text-[10px] ${
                        item.status === 'SOLVED' ? 'text-green-700' : 'text-blue-700'
                    }`}>
                        {item.status}
                    </Text>
                </View>
            </View>

            {/* Description */}
            <Text className="text-slate-800 text-base mb-4 leading-6">
                {item.message}
            </Text>

            {/* Evidence Section (Horizontal Scroll) */}
            {item.evidenceUrls && item.evidenceUrls.length > 0 && (
                <View>
                    <Text className="text-slate-500 text-xs font-bold mb-2 uppercase">Evidence Attached:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {item.evidenceUrls.map((url, index) => (
                            <View key={index} className="mr-3 relative">
                                <Video
                                    source={{ uri: url }}
                                    style={{ width: 120, height: 120, borderRadius: 8, backgroundColor: '#000' }}
                                    useNativeControls
                                    resizeMode={ResizeMode.COVER}
                                    isLooping={false}
                                />
                                <View className="absolute top-1 right-1 bg-black/50 px-1 rounded">
                                    <Text className="text-white text-[8px] font-bold">VIDEO {index + 1}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
            </View>
        ))
      )}

      <View className="h-10" />
    </ScrollView>
  );
};

export default AllComplaints;