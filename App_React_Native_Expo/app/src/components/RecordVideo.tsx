import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';

interface EvidenceCameraProps {
  onCapture: (videoUri: string, metadata: any) => void;
  onClose: () => void;
}

export default function RecordVideo({ onCapture, onClose }: EvidenceCameraProps) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [timestamp, setTimestamp] = useState(new Date().toLocaleString());
  const [permissionError, setPermissionError] = useState(false);

  useEffect(() => {
    (async () => {
      const camStatus = await requestCameraPermission();
      const micStatus = await requestMicPermission();
      const locStatus = await Location.requestForegroundPermissionsAsync();

      if (!camStatus.granted || !micStatus.granted || !locStatus.granted) {
        Alert.alert('Permission Required', 'Camera, Mic, and Location are needed.');
        setPermissionError(true);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc);
    })();

    const timer = setInterval(() => {
      setTimestamp(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const recordVideo = async () => {
    if (cameraRef) {
      setIsRecording(true);
      try {
        const video = await cameraRef.recordAsync({
          maxDuration: 60,
        });

        setIsRecording(false);
        if (video?.uri) {
          onCapture(video.uri, {
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
            timestamp: new Date().toISOString(),
          });
        }
      } catch (e) {
        console.error(e);
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef && isRecording) {
      cameraRef.stopRecording();
      setIsRecording(false);
    }
  };

  if (permissionError) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-lg mb-4">Permissions Denied</Text>
        <TouchableOpacity onPress={onClose} className="bg-red-600 px-6 py-3 rounded-lg">
          <Text className="text-white font-bold">Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black relative">
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        mode="video"
        ref={(ref) => setCameraRef(ref)}
      >
        <View className="absolute top-12 left-5 z-20">
          <TouchableOpacity onPress={onClose} className="bg-black/50 p-2 rounded-full">
            <FontAwesome name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="absolute top-12 right-5 bg-black/60 p-3 rounded-lg z-10 items-end">
          <Text className="text-white text-xs font-bold text-right">
            LAT: {location?.coords?.latitude?.toFixed(6) || 'Locating...'}
          </Text>
          <Text className="text-white text-xs font-bold text-right">
            LNG: {location?.coords?.longitude?.toFixed(6) || 'Locating...'}
          </Text>
          <Text className="text-yellow-400 text-xs font-bold mt-1 text-right">
            {timestamp}
          </Text>
          <Text className="text-red-400 text-[10px] font-bold mt-1">
            VERIFIED LIVE CAPTURE
          </Text>
        </View>

        <View className="absolute bottom-10 w-full items-center z-20">
          {isRecording ? (
            <TouchableOpacity
              onPress={stopRecording}
              className="w-20 h-20 bg-red-600 rounded-full border-4 border-white justify-center items-center"
            >
              <View className="w-8 h-8 bg-white rounded-sm" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={recordVideo}
              className="w-20 h-20 bg-white rounded-full border-4 border-slate-300 justify-center items-center"
            >
              <View className="w-16 h-16 bg-red-500 rounded-full" />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
}