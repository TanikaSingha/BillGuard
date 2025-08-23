import { uploadUserImage } from "@/lib/Slices/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image, // NEW: to compute screen ratio
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState<string | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
  const [showCamera, setShowCamera] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedImageURL, setUploadedImageURL] = useState<string | null>(null);
  const [cameraRatio, setCameraRatio] = useState<string | undefined>(undefined);

  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.user);

  // NEW: allow landscape on this screen, lock back to portrait on exit
  useEffect(() => {
    (async () => {
      try {
        await ScreenOrientation.unlockAsync();
      } catch {}
    })();
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).catch(() => {});
    };
  }, []);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission]);

  const toggleCameraFacing = () =>
    setFacing((current) => (current === "back" ? "front" : "back"));
  
  const onCameraReady = () => {
  if (Platform.OS !== "android") return;

  try {
    // Screen ratio independent of current orientation
    const { width, height } = Dimensions.get("window");
    const screenRatio = Math.max(width, height) / Math.min(width, height);

    // Prefer 16:9 on most modern phones; fall back to 4:3 on squarer screens
    const desiredRatio =
      Math.abs(16 / 9 - screenRatio) < Math.abs(4 / 3 - screenRatio)
        ? "16:9"
        : "4:3";

    // If you keep this in state:
    setCameraRatio(desiredRatio as any); // <-- TS may want 'any' for CameraView's ratio prop
  } catch {
    // no-op; CameraView will use its default ratio if anything goes wrong
  }
};
  
  const normalizeAndSet = async (uri: string) => {
    try {
      // This no-op manipulation rewrites pixels with the correct rotation on Android
      const normalized = await ImageManipulator.manipulateAsync(
        uri,
        [], // no actions
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      // Compute aspect ratio to render with 'contain' without distortion
      await new Promise<void>((resolve, reject) => {
        Image.getSize(
          normalized.uri,
          (w, h) => {
            setImageAspectRatio(w / h);
            resolve();
          },
          (e) => reject(e)
        );
      });
      setImage(normalized.uri);
      setShowCamera(false);
    } catch (e) {
      // Fallback: if anything fails, at least show the original
      setImage(uri);
      setImageAspectRatio(null);
      setShowCamera(false);
    }
  };
  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1 ,skipProcessing: false});
      if (photo) {
        // NEW: fix orientation + compute aspect ratio
        await normalizeAndSet(photo.uri);
      }
    } catch {
      Alert.alert("Error", "Failed to take picture");
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      await normalizeAndSet(result.assets[0].uri);
    }
  };

  const retakePhoto = () => {
    setImage(null);
    setImageAspectRatio(null);
    setShowCamera(true);
  };

  const submitPhoto = async () => {
    if (!image) return;
    const formData = new FormData();
    formData.append("image", {
      uri: image,
      name: `photo${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    try {
      const url = await dispatch(uploadUserImage(formData)).unwrap();
      setUploadedImageURL(url);
      setUploadSuccess(true);
    } catch (err: any) {
      Alert.alert("Upload Failed", err);
    }
  };

  // ✅ Success screen comes first
  if (uploadSuccess) {
    return (
      <View style={styles.previewContainer}>
        <Text style={styles.successText}>✅ Image uploaded successfully!</Text>

        <View style={styles.successControls}>
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => {
              setUploadSuccess(false);
              setImage(null);
              setShowCamera(true);
              router.push(
                `/ReportSubmission?imageUrl=${encodeURIComponent(uploadedImageURL ?? "")}`
              );
            }}
          >
            <Ionicons name="document-text" size={20} color="white" />
            <Text style={styles.proceedButtonText}>
              Go to Report Submission
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => {
              setUploadSuccess(false);
              retakePhoto();
            }}
          >
            <Ionicons name="camera" size={20} color="#666" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // 📸 Camera view
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}
        onCameraReady={onCameraReady}            // <-- use the function above
        ratio={Platform.OS === "android" ? (cameraRatio as any) : undefined}>
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={openGallery}
            >
              <Ionicons name="images" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  // 🖼️ Preview with upload
  if (image) {
    return (
      <View style={styles.previewContainer}>
        <Image
          source={{ uri: image }}
          style={[
            styles.preview,
            imageAspectRatio
              ? imageAspectRatio > 1?
                // Landscape: respect aspect ratio, width 95%
                { width: "95%", aspectRatio: imageAspectRatio }
                // Portrait: fix height to 80% of screen
                : { width: "95%", height: "80%" }
              // Fallback if ratio missing
              : { width: "95%", height: "80%" },
          ]}
          resizeMode="contain"
        />
        <View style={styles.previewControls}>
          <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
            <Ionicons name="camera" size={20} color="#666" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.proceedButton}
            onPress={submitPhoto}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="white" />
                <Text style={styles.proceedButtonText}>Submit</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        {status === "failed" && error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
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
  cameraContainer: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1 },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  successText: {
    fontSize: 18, // slightly bigger for emphasis
    color: "#28a745", // nicer green (#28a745 is bootstrap success green)
    fontWeight: "600", // slightly bolder
    textAlign: "center", // center the text nicely
    marginBottom: 24, // add space below text for buttons
  },

  successControls: {
    flexDirection: "row",
    justifyContent: "space-around", // space buttons evenly
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 16, // a bit tighter than before
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingBottom: 50,
    paddingTop: 30,
  },
  galleryButton: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  galleryPreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.8)",
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "white",
  },
  flipButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",

  },
  preview: {
    padding: 30,
    marginBottom:10,
    // width/height applied inline based on aspect ratio
  },
  previewControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.9)",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    gap: 8,
  },
  retakeButtonText: { fontSize: 16, fontWeight: "600", color: "#666" },
  proceedButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#6c3ef4",
    gap: 8,
  },
  proceedButtonText: { fontSize: 16, fontWeight: "600", color: "white" },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
