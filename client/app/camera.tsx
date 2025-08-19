import { Ionicons } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Report from './(modals)/report';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(true);
  const cameraRef = useRef<CameraView>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [capturedImageUri, setCapturedImageUri] = useState<string>('');

  const requestCameraPermission = async () => {
    if (!permission) return;
    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission Required', 'Camera permission is required to use this feature');
        setShowCamera(false);
      }
    }
  };

  const toggleCameraFacing = () => setFacing(current => (current === 'back' ? 'front' : 'back'));

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 1 });
        if (photo) {
          setImage(photo.uri);
          setShowCamera(false);
        }
      } catch {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const openGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Gallery permission is required to access photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setShowCamera(false);
    }
  };

  const retakePhoto = () => {
    setImage(null);
    setShowCamera(true);
    requestCameraPermission();
  };

  const proceed = () => {
    if (image) {
      setCapturedImageUri(image);
      setShowReportModal(true);
    }
  };

  const handleReportClose = () => {
    setShowReportModal(false);
    // Reset to camera view after closing report
    setImage(null);
    setShowCamera(true);
    setCapturedImageUri('');
  };

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    requestCameraPermission();
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (image) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: image }} style={styles.preview} />
        <View style={styles.previewControls}>
          <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
            <Ionicons name="camera" size={20} color="#666" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.proceedButton} onPress={proceed}>
            <Ionicons name="checkmark" size={20} color="white" />
            <Text style={styles.proceedButtonText}>Proceed</Text>
          </TouchableOpacity>
        </View>

        {/* Report Modal */}
        <Report
          visible={showReportModal}
          onClose={handleReportClose}
          imageUri={capturedImageUri}
        />
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.galleryButton} onPress={openGallery}>
              <View style={styles.galleryPreview}>
                <Ionicons name="images" size={24} color="white" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Camera not available</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  cameraContainer: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 50,
    paddingTop: 30,
  },
  galleryButton: { width: 50, height: 50, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  galleryPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  captureButtonInner: { width: 65, height: 65, borderRadius: 32.5, backgroundColor: 'white' },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  previewContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  preview: { width: '95%', height: '80%', borderRadius: 15, marginBottom: 30 },
  previewControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, paddingHorizontal: 20 },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  retakeButtonText: { fontSize: 16, fontWeight: '600', color: '#666' },
  proceedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#6c3ef4',
    gap: 8,
  },
  proceedButtonText: { fontSize: 16, fontWeight: '600', color: 'white' },
});