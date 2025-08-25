import apiRequest from "@/lib/utils/apiRequest";
import { RootState } from "@/store/store";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
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
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Avatar Section */}
      <View style={styles.header}>
        <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{userInfo.name}</Text>
        <Text style={styles.username}>@{userInfo.username}</Text>
      </View>

      {/* User Info Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Profile Information</Text>

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

        <Text style={styles.label}>Badges</Text>
        <View style={styles.badges}>
          {userInfo.badges?.length > 0 ? (
            userInfo.badges.map((badge: string, idx: number) => (
              <View key={idx} style={styles.badge}>
                <FontAwesome name="trophy" size={14} color="#fff" />
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.value}>No badges earned yet</Text>
          )}
        </View>

        {/* Delete User Button */}
        {user?.role === "AdminUser" && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteUser}>
            <FontAwesome name="trash" size={16} color="#fff" />
            <Text style={styles.deleteBtnText}>Delete User</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => {
          if (user?.role === "NormalUser") {
            router.push("/(tabs)/profile");
          } else if (user?.role === "AdminUser") {
            router.push("/(admin)/manage-users");
          }
        }}
        style={styles.backBtn}
      >
        <Text style={styles.backBtnText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default UserDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafc", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", fontSize: 16, marginBottom: 10 },

  header: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#1E90FF",
  },
  name: { fontSize: 22, fontWeight: "700", color: "#111" },
  username: { fontSize: 16, color: "#666", marginTop: 4 },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#1E90FF",
  },
  infoRow: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: "600", color: "#444" },
  value: { fontSize: 15, color: "#222", marginTop: 2 },

  badges: { flexDirection: "row", flexWrap: "wrap", marginTop: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E90FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  badgeText: { color: "#fff", marginLeft: 6, fontWeight: "600", fontSize: 13 },

  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF4C4C",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 20,
  },
  deleteBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },

  backBtn: {
    backgroundColor: "#1E90FF",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  backBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
