import { logoutUser } from "@/lib/Slices/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { ThemeContext, colors } from "../context/ThemeContext";

export default function Profile() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
  });
  const { user } = useSelector((state: RootState) => state.user);
  const { status } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { currentTheme, toggleTheme } = useContext(ThemeContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = colors[currentTheme as keyof typeof colors];

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="font-montserrat text-text-secondary">
          Loading user...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View
        className="bg-primary-dark px-4 py-3 shadow-lg shadow-primary-dark/40 border-b border-primary-main/30"
        style={{
          zIndex: 10,
          elevation: 10,
        }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="font-montserratBold text-xl text-white tracking-widest">
            Profile
          </Text>
          <TouchableOpacity
            className="p-2 rounded-xl bg-white/10 border border-white/20"
            onPress={() => setMenuVisible((prev) => !prev)}
          >
            <Ionicons name="settings-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings menu */}
      {menuVisible && (
        <View
          className="absolute right-4 top-20 px-4 py-2 w-48 z-50 rounded-2xl border"
          style={{
            backgroundColor: "#FFFFFF", // surface
            borderColor: "#E5E7EB", // neutral border
            borderWidth: 1,
            shadowColor: "#000", // subtle shadow
            shadowOpacity: 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
          }}
        >
          <View
            className="px-4 py-3 border-b"
            style={{ borderColor: "#E5E7EB" }}
          >
            <Text className="font-montserratBold" style={{ color: "#1F2937" }}>
              Appearance
            </Text>
          </View>

          <View className="px-4 py-3 flex-row items-center justify-between">
            <Text
              className="text-base font-montserrat"
              style={{ color: "#1F2937" }}
            >
              Dark Mode
            </Text>
            <Switch
              value={currentTheme === "dark"}
              onValueChange={() =>
                toggleTheme(currentTheme === "light" ? "dark" : "light")
              }
              trackColor={{ false: "#E5E7EB", true: "#C7D2FE" }} // subtle gray → light purple
              thumbColor={currentTheme === "dark" ? "#6C4FE0" : "#FFFFFF"} // purple accent when active
            />
          </View>
        </View>
      )}

      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <ScrollView>
          {/* Floating Profile Card */}
          <View className="mt-16 px-5">
            <View className="bg-surface rounded-3xl px-5 pb-5 pt-12 shadow-xl shadow-primary-dark/20 border border-border">
              {/* Avatar */}
              <View className="-mt-24 self-center">
                <View className="w-24 h-24 rounded-full border-4 border-primary-dark shadow-lg overflow-hidden bg-background">
                  <Image
                    className="w-full h-full"
                    source={{ uri: user.avatar }}
                  />
                </View>
              </View>

              {/* Name + Role */}
              <View className="mt-2 items-center">
                <Text className="font-montserratBold text-xl text-text-primary">
                  {user.username}
                </Text>
                <View className="mt-2 px-3 py-1 rounded-full bg-primary-main/10 border border-primary-main/30">
                  <Text className="font-montserrat text-xs tracking-wide text-primary-dark">
                    {user.role}
                  </Text>
                </View>
              </View>

              {/* Stats: show different for NormalUser vs AdminUser */}
              {user.role === "NormalUser" && (
                <View className="mt-6 flex-row justify-between mx-6">
                  <View className="flex-1 mx-1 items-center">
                    <View className="px-4 py-3 rounded-2xl bg-background border border-border w-full items-center">
                      <Text className="font-montserratBold text-xl text-text-primary">
                        {user.normalUser?.xp || 0}
                      </Text>
                      <Text className="font-montserrat text-xs text-text-secondary mt-1">
                        Points
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1 mx-1 items-center">
                    <View className="px-4 py-3 rounded-2xl bg-background border border-border w-full items-center">
                      <Text className="font-montserratBold text-xl text-text-primary">
                        {user.normalUser?.badges.length || 0}
                      </Text>
                      <Text className="font-montserrat text-xs text-text-secondary mt-1">
                        Badges
                      </Text>
                    </View>
                  </View>
                  <View className="flex-1 mx-1 items-center">
                    <View className="px-4 py-3 rounded-2xl bg-background border border-border w-full items-center">
                      <Text className="font-montserratBold text-xl text-text-primary">
                        {user.normalUser?.reportsSubmitted || 0}
                      </Text>
                      <Text className="font-montserrat text-xs text-text-secondary mt-1">
                        Reports
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {user.role === "AdminUser" && (
                <View>
                  <View className="mt-6 flex-row mx-5 gap-3">
                    <View className="w-[48%] items-center">
                      <View className="px-3 py-4 rounded-2xl bg-background border border-border w-full items-center">
                        <Text className="font-montserratBold text-xl text-text-primary">
                          {user.adminUser?.verifiedReports || 0}
                        </Text>
                        <Text className="font-montserrat text-xs text-text-secondary mt-1">
                          Verified
                        </Text>
                      </View>
                    </View>

                    <View className="w-[48%] items-center">
                      <View className="px-3 py-4 rounded-2xl bg-background border border-border w-full items-center">
                        <Text className="font-montserratBold text-xl text-text-primary">
                          {user.adminUser?.rejectedReports || 0}
                        </Text>
                        <Text className="font-montserrat text-xs text-text-secondary mt-1">
                          Rejected
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="mt-4 mx-6 items-center">
                    <View className="px-4 py-2 rounded-full bg-background border border-primary-main/30">
                      <Text className="font-montserrat text-xs text-primary-dark tracking-wide">
                        Admin Code: {user.adminUser?.adminCode || "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Admin Permissions list */}
              {user.role === "AdminUser" && (
                <View className="mt-6 px-2">
                  <Text className="font-montserratBold text-sm text-text-primary mb-2">
                    Permissions
                  </Text>
                  <Text
                    className="font-montserrat text-xs text-primary-dark"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {user.adminUser?.permissions?.length
                      ? user.adminUser.permissions
                          .map((perm) => perm)
                          .join(" • ") // 👈 replace commas with dot separator
                      : "No permissions assigned"}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Quick Actions (same for both) */}
          <View className="mt-6 px-5">
            <Text className="font-montserratBold text-lg text-text-primary mb-3">
              Quick Actions
            </Text>

            <View className="flex-row justify-between">
              {/* Badge tile */}
              {user.role === "NormalUser" && (
                <TouchableOpacity className="w-[30%] aspect-square mb-4 rounded-2xl bg-surface border border-border shadow-md shadow-primary-dark/15 px-3 py-4 items-center justify-center active:opacity-90">
                  <View className="w-10 h-10 items-center justify-center rounded-2xl bg-primary-main/10 border border-primary-main/30">
                    <Ionicons name="ribbon-outline" size={24} color="#6C4FE0" />
                  </View>
                  <Text className="font-montserrat text-sm text-text-primary mt-2 text-center">
                    My Badges
                  </Text>
                </TouchableOpacity>
              )}

              {/* Account */}
              <TouchableOpacity className="w-[23%] aspect-square rounded-2xl bg-surface border border-border shadow-md shadow-primary-dark/15 items-center justify-center active:opacity-90">
                <View className="w-10 h-10 items-center justify-center rounded-2xl bg-primary-main/10 border border-primary-main/30">
                  <Ionicons name="person-outline" size={24} color="#6C4FE0" />
                </View>
                <Text className="font-montserrat text-sm text-text-primary mt-2 text-center">
                  Account
                </Text>
              </TouchableOpacity>

              {/* Reports */}
              <TouchableOpacity
                className="w-[23%] aspect-square rounded-2xl bg-surface border border-border shadow-md shadow-primary-dark/15 items-center justify-center active:opacity-90"
                onPress={() => router.push("/reports")}
              >
                <View className="w-10 h-10 items-center justify-center rounded-2xl bg-primary-main/10 border border-primary-main/30">
                  <Ionicons
                    name="document-text-outline"
                    size={24}
                    color="#6C4FE0"
                  />
                </View>
                <Text className="font-montserrat text-sm text-text-primary mt-2 text-center">
                  Reports
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-[23%] aspect-square rounded-2xl bg-surface border border-border shadow-md shadow-primary-dark/15 items-center justify-center active:opacity-90">
                <View className="w-10 h-10 items-center justify-center rounded-2xl bg-primary-main/10 border border-primary-main/30">
                  <MaterialIcons name="leaderboard" size={24} color="#6C4FE0" />
                </View>
                <Text className="font-montserrat text-[11px] text-text-primary mt-2 text-center">
                  Leaderboard
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={status === "loading"}
                className={`w-[23%] aspect-square rounded-2xl border items-center justify-center shadow-md shadow-primary-dark/15 ${
                  status === "loading"
                    ? "bg-text-disabled/20 border-error/40"
                    : "bg-surface border-error"
                }`}
                onPress={async () => {
                  const result = await dispatch(logoutUser());
                  if (logoutUser.fulfilled.match(result)) {
                    router.replace("/(auth)/login");
                  }
                }}
              >
                <View
                  className={`w-10 h-10 items-center justify-center rounded-2xl border mb-2 ${
                    status === "loading"
                      ? "bg-error/10 border-error/30"
                      : "bg-error/10 border-error/40"
                  }`}
                >
                  <Ionicons
                    name="log-out-outline"
                    size={24}
                    color={status === "loading" ? "#9CA3AF" : "#EF4444"}
                  />
                </View>
                <Text
                  className={`font-montserratBold text-sm mt-2 ${
                    status === "loading" ? "text-text-disabled" : "text-error"
                  }`}
                >
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
