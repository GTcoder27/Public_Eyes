import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import RecordVideo from '../src/components/RecordVideo';
import { Cloudinary } from "@cloudinary/url-gen";
import { upload } from 'cloudinary-react-native';
import backendApi from '../src/config/backendApi';


export default function ComplaintScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);

  const [videos, setVideos] = useState<{ uri: string; meta: any }[]>([]);

  // 1. Setup Cloudinary
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'dzari4gkn'
    }
  });

  const uploadVideoToCloudinary = (uri: string) => {
    return new Promise((resolve, reject) => {
      const options = {
        upload_preset: 'gtcoder_upload_present',
        unsigned: true,
        resource_type: 'video' as const,
      };

      upload(cld, {
        file: uri,
        options: options,
        callback: (error, response) => {
          if (error || !response) {
            reject(error);
          } else {
            resolve(response.secure_url);
          }
        }
      });
    });
  };

  const handleCapture = (uri: string, metadata: any) => {
    setVideos((prev) => [...prev, { uri, meta: metadata }]);
    setShowCamera(false);
  };

  const removeVideo = (indexToRemove: number) => {
    setVideos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async () => {
    if (!title || !desc) {
      Alert.alert("Missing Fields", "Please add title and description");
      return;
    }

    if (videos.length === 0) {
      Alert.alert("Evidence Required", "Please record at least one video.");
      return;
    }

    setLoading(true);

    try {
      console.log("Starting Uploads...");
      const uploadPromises = videos.map(async (video) => {
        const cloudUrl = await uploadVideoToCloudinary(video.uri);
        return {
          url: cloudUrl,
          meta: video.meta
        };
      });

      const uploadedEvidence = await Promise.all(uploadPromises);

      let cloudUrls = uploadedEvidence.map((item) => item.url);

      console.log("All Uploads Complete:");

      const complaintData = {
        message: desc,
        evidenceUrls: cloudUrls,
      };
      let res = await backendApi.post('/user/make/complaint', complaintData);
      console.log(res.data)

      Alert.alert("Success", "Complaint Submitted successfully!");

      setTitle('');
      setDesc('');
      setVideos([]);

    } catch (error) {
      console.error("Upload failed", error);
      Alert.alert("Upload Failed", "Could not upload videos. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (showCamera) {
    return (
      <RecordVideo
        onCapture={handleCapture}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 pt-12 px-6">
      <Text className="text-2xl font-bold text-slate-800 mb-6">New Complaint</Text>

      <View className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
        <Text className="text-slate-600 font-medium mb-2">Subject</Text>
        <TextInput
          className="border border-slate-300 rounded-lg p-3 mb-4 bg-slate-50"
          placeholder="e.g. Illegal Dumping"
          value={title}
          onChangeText={setTitle}
        />

        <Text className="text-slate-600 font-medium mb-2">Description</Text>
        <TextInput
          className="border border-slate-300 rounded-lg p-3 mb-6 bg-slate-50 h-32"
          placeholder="Describe the issue..."
          multiline
          textAlignVertical="top"
          value={desc}
          onChangeText={setDesc}
        />

        <Text className="text-slate-600 font-medium mb-2">
          Video Evidence ({videos.length})
        </Text>

        <TouchableOpacity
          className="bg-slate-100 border border-dashed border-slate-400 rounded-xl h-24 justify-center items-center mb-6"
          onPress={() => setShowCamera(true)}
        >
          <View className="flex-row items-center">
            <FontAwesome name="plus-circle" size={20} color="#2563eb" />
            <Text className="text-slate-500 font-medium ml-2">Record Video</Text>
          </View>
        </TouchableOpacity>

        {videos.map((item, index) => (
          <View key={index} className="mb-6 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <Video
              source={{ uri: item.uri }}
              style={{ width: '100%', height: 200, borderRadius: 12 }}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping={false}
            />

            <View className="bg-green-100 p-2 mt-2 rounded-lg border border-green-200 flex-row justify-between items-center">
              <View>
                <Text className="text-green-800 font-bold text-[10px]">✓ VERIFIED METADATA</Text>
                <Text className="text-slate-600 text-[10px]">
                  Lat: {item.meta?.latitude ? item.meta.latitude.toFixed(5) : 'N/A'}
                </Text>
                <Text className="text-slate-600 text-[10px]">
                  Time: {item.meta?.timestamp ? new Date(item.meta.timestamp).toLocaleTimeString() : 'N/A'}
                </Text>
              </View>
              <Text className="text-slate-400 font-bold text-lg">#{index + 1}</Text>
            </View>

            <TouchableOpacity
              onPress={() => removeVideo(index)}
              className="mt-2 bg-red-100 p-3 rounded-lg items-center flex-row justify-center"
            >
              <FontAwesome name="trash" size={16} color="#dc2626" />
              <Text className="text-red-600 font-bold text-sm ml-2">Remove</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          className={`bg-green-600 p-4 rounded-xl items-center shadow-md shadow-blue-200 mt-2 ${loading ? 'opacity-70' : ''}`}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row items-center">
              <ActivityIndicator color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">Uploading...</Text>
            </View>
          ) : (
            <Text className="text-white font-bold text-lg">Submit Complaint</Text>
          )}
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity
          className={`bg-amber-400 p-4 rounded-xl items-center shadow-md shadow-blue-800 mt-2 ${loading ? 'opacity-70' : ''}`}
          onPress={() => { router.push('/src/components/AllComplaints') }}
          disabled={loading}
        >
          <Text className="text-black font-bold text-lg">See All Complaints</Text>
        </TouchableOpacity>
      </View>
      <View className="h-32" />
    </ScrollView>
  );
}