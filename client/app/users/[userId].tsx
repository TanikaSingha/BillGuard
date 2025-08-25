// import apiRequest from "@/lib/utils/apiRequest";
// import { RootState } from "@/store/store";
// import { FontAwesome } from "@expo/vector-icons";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Image,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSelector } from "react-redux";

// const UserDetails = () => {
//   const { userId } = useLocalSearchParams();
//   const router = useRouter();
//   const { user } = useSelector((state: RootState) => state.user);
//   const [userInfo, setUserInfo] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await apiRequest.get<{ data: any }>(
//           `/user/details/${userId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
//             },
//           }
//         );
//         if (!res) throw new Error("Failed to fetch user info");
//         setUserInfo(res.data.data);
//       } catch (err: any) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, [userId]);

//   const handleDeleteUser = async () => {
//     Alert.alert("Delete User", "Are you sure you want to delete this user?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: async () => {
//           try {
//             setLoading(true);
//             await apiRequest.delete(`/user/delete/${userId}`, {
//               headers: {
//                 Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
//               },
//             });
//             Alert.alert("Success", "User deleted successfully");
//             router.back();
//           } catch (error) {
//             Alert.alert("Error", "Failed to delete user");
//             console.error(error);
//           } finally {
//             setLoading(false);
//           }
//         },
//       },
//     ]);
//   };

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#1E90FF" />
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.error}>{error}</Text>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
//           <Text style={styles.backBtnText}>Go Back</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       {/* Avatar Section */}
//       <View style={styles.header}>
//         <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
//         <Text style={styles.name}>{userInfo.name}</Text>
//         <Text style={styles.username}>@{userInfo.username}</Text>
//       </View>

//       {/* User Info Card */}
//       <View style={styles.card}>
//         <Text style={styles.title}>Profile Information</Text>

//         <InfoRow label="User ID" value={userInfo._id} />
//         <InfoRow label="Email" value={userInfo.email} />
//         <InfoRow label="Status" value={userInfo.status} />
//         <InfoRow label="XP" value={userInfo.xp || 0} />
//         <InfoRow
//           label="Reports Submitted"
//           value={userInfo.reportsSubmitted || 0}
//         />
//         <InfoRow
//           label="Reports Verified"
//           value={userInfo.reportsVerified || 0}
//         />

//         <Text style={styles.label}>Badges</Text>
//         <View style={styles.badges}>
//           {userInfo.badges?.length > 0 ? (
//             userInfo.badges.map((badge: string, idx: number) => (
//               <View key={idx} style={styles.badge}>
//                 <FontAwesome name="trophy" size={14} color="#fff" />
//                 <Text style={styles.badgeText}>{badge}</Text>
//               </View>
//             ))
//           ) : (
//             <Text style={styles.value}>No badges earned yet</Text>
//           )}
//         </View>

//         {/* Delete User Button */}
//         {user?.role === "AdminUser" && (
//           <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteUser}>
//             <FontAwesome name="trash" size={16} color="#fff" />
//             <Text style={styles.deleteBtnText}>Delete User</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Back Button */}
//       <TouchableOpacity
//         onPress={() => {
//           if (user?.role === "NormalUser") {
//             router.push("/(tabs)/profile");
//           } else if (user?.role === "AdminUser") {
//             router.push("/(admin)/manage-users");
//           }
//         }}
//         style={styles.backBtn}
//       >
//         <Text style={styles.backBtnText}>Go Back</Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const InfoRow = ({ label, value }: { label: string; value: any }) => (
//   <View style={styles.infoRow}>
//     <Text style={styles.label}>{label}</Text>
//     <Text style={styles.value}>{value}</Text>
//   </View>
// );

// export default UserDetails;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f9fafc", padding: 16 },
//   center: { flex: 1, justifyContent: "center", alignItems: "center" },
//   error: { color: "red", fontSize: 16, marginBottom: 10 },

//   header: { alignItems: "center", marginBottom: 24 },
//   avatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     marginBottom: 12,
//     borderWidth: 3,
//     borderColor: "#1E90FF",
//   },
//   name: { fontSize: 22, fontWeight: "700", color: "#111" },
//   username: { fontSize: 16, color: "#666", marginTop: 4 },

//   card: {
//     backgroundColor: "#fff",
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 6,
//     elevation: 4,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 16,
//     color: "#1E90FF",
//   },
//   infoRow: { marginBottom: 12 },
//   label: { fontSize: 14, fontWeight: "600", color: "#444" },
//   value: { fontSize: 15, color: "#222", marginTop: 2 },

//   badges: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
//   badge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#1E90FF",
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     borderRadius: 20,
//     marginRight: 8,
//     marginBottom: 8,
//   },
//   badgeText: { color: "#fff", marginLeft: 6, fontWeight: "600", fontSize: 13 },

//   deleteBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FF4C4C",
//     paddingVertical: 12,
//     borderRadius: 10,
//     justifyContent: "center",
//     marginTop: 20,
//   },
//   deleteBtnText: {
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 16,
//     marginLeft: 8,
//   },

//   backBtn: {
//     backgroundColor: "#1E90FF",
//     padding: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginBottom: 40,
//   },
//   backBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
// });
import apiRequest from "@/lib/utils/apiRequest";
import { RootState } from "@/store/store";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const UserDetails = () => {
  const { userId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiRequest.get<{ data: any }>(
          `/user/details/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            },
          }
        );
        if (!res) throw new Error("Failed to fetch user info");
        setUserInfo(res.data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleDeleteUser = async () => {
    Alert.alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true);
            await apiRequest.delete(`/user/delete/${userId}`, {
              headers: {
                Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
              },
            });
            Alert.alert("Success", "User deleted successfully");
            router.back();
          } catch (error) {
            Alert.alert("Error", "Failed to delete user");
            console.error(error);
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6c4fe0ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-6">
        <Text className="font-montserrat text-error text-base mb-3">
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-primary-main px-4 py-3 rounded-xl"
        >
          <Text className="font-montserratBold text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-background px-4">
      {/* Top bar */}
      <View className="flex-row items-center py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-surface border border-border items-center justify-center mr-3"
        >
          <Ionicons name="chevron-back" size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text className="font-montserratBold text-lg text-text-primary">
          User Details
        </Text>
      </View>

      {/* Avatar + name */}
      <View className="items-center mb-6">
        <Image
          source={{ uri: userInfo.avatar }}
          className="w-28 h-28 rounded-full mb-3 border-4"
          style={{ borderColor: "#6c4fe0ff" }}
        />
        <Text className="font-montserratBold text-xl text-text-primary">
          {userInfo.name}
        </Text>
        <Text className="font-montserrat text-base text-text-secondary mt-1">
          @{userInfo.username}
        </Text>
      </View>

      {/* Profile info card */}
      <View className="bg-surface rounded-2xl p-5 mb-5 border border-border shadow-sm">
        <Text className="font-montserratBold text-lg text-primary-main mb-4">
          Profile Information
        </Text>

        <InfoRow label="User ID" value={userInfo._id} />
        <InfoRow label="Email" value={userInfo.email} />
        <InfoRow label="Status" value={userInfo.status} />
        <InfoRow label="XP" value={userInfo.xp || 0} />
        <InfoRow
          label="Reports Submitted"
          value={userInfo.reportsSubmitted || 0}
        />
        <InfoRow
          label="Reports Verified"
          value={userInfo.reportsVerified || 0}
        />

        <Text className="font-montserratBold text-sm text-text-primary mt-2">
          Badges
        </Text>
        <View className="flex-row flex-wrap mt-2">
          {userInfo.badges?.length > 0 ? (
            userInfo.badges.map((badge: string, idx: number) => (
              <View
                key={idx}
                className="flex-row items-center bg-primary-main px-3 py-1.5 rounded-full mr-2 mb-2"
              >
                <FontAwesome name="trophy" size={14} color="#FFFFFF" />
                <Text className="font-montserratBold text-white text-xs ml-2">
                  {badge}
                </Text>
              </View>
            ))
          ) : (
            <Text className="font-montserrat text-text-secondary text-sm">
              No badges earned yet
            </Text>
          )}
        </View>

        {/* Delete button (admin only) */}
        {user?.role === "AdminUser" && (
          <TouchableOpacity
            onPress={handleDeleteUser}
            className="items-center justify-center bg-surface border border-border rounded-2xl py-6 mt-6"
            activeOpacity={0.85}
          >
            <FontAwesome name="trash" size={28} color="#EF4444" />
            <Text className="font-montserratBold text-error text-sm mt-2">
              Delete User
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <View className="mb-3">
    <Text className="font-montserratBold text-xs text-text-secondary">
      {label}
    </Text>
    <Text className="font-montserrat text-sm text-text-primary mt-0.5">
      {String(value)}
    </Text>
  </View>
);

export default UserDetails;
