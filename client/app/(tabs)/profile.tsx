import { logoutUser } from "@/lib/Slices/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function Profile() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"), // adjust path
  });
  const { status } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const user = {
    name: "Michael",
    role: "User", 
    points: 120,
    profileImage: "https://i.pravatar.cc/300", 
    badges: 5,
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-6 py-3 border-b border-gray-200">
        <Text className="font-montserratBold text-xl text-gray-900">
          Profile
        </Text>
        <TouchableOpacity onPress={() => console.log("Go to settings")}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Top Section */}
      <View className="items-center my-6">
        <Image
          className="w-28 h-28 rounded-full mb-4"
          source={{ uri: user.profileImage }}
        />
        <Text className="font-montserratBold text-2xl text-purple-700">
          {user.name}
        </Text>
        <Text className="font-montserrat text-base text-gray-500">
          Role: {user.role}
        </Text>
      </View>

      {/* Highlighted Points */}
      <View className="mx-5 mb-5">
        <View className="flex-row items-center bg-purple-100 border border-purple-200 rounded-2xl p-5 shadow">
          <Ionicons name="trophy" size={28} color="#4F46E5" />
          <Text className="font-montserratBold text-purple-600 flex-1 ml-3">
            Points Earned
          </Text>
          <Text className="font-montserratBold text-lg text-indigo-600">
            {user.points}
          </Text>
        </View>
      </View>

      {/* Cards */}
      <View className="mx-5 gap-4 mb-10">
        {/* Badges */}
        <TouchableOpacity className="flex-row items-center bg-white rounded-2xl shadow-md shadow-purple-500 p-4">
          <Ionicons name="ribbon-outline" size={24} color="#4F46E5" />
          <Text className="font-montserrat text-base text-gray-900 flex-1 ml-3">
            Badges Earned
          </Text>
          <Text className="font-montserratBold text-base text-indigo-600">
            {user.badges}
          </Text>
        </TouchableOpacity>

        {/* Account Details */}
        <TouchableOpacity className="flex-row items-center bg-white rounded-2xl shadow-md shadow-purple-500 p-4">
          <Ionicons name="person-outline" size={24} color="#4F46E5" />
          <Text className="font-montserrat text-base text-gray-900 ml-3 flex-1">
            Account Details
          </Text>
        </TouchableOpacity>

        {/* My Reports */}
        <TouchableOpacity className="flex-row items-center bg-white rounded-2xl shadow-md shadow-purple-500 p-4">
          <Ionicons name="document-text-outline" size={24} color="#4F46E5" />
          <Text className="font-montserrat text-base text-gray-900 ml-3 flex-1">
            My Reports
          </Text>
        </TouchableOpacity>

        {/* About */}
        <TouchableOpacity className="flex-row items-center bg-white rounded-2xl shadow-md shadow-purple-500 p-4">
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#4F46E5"
          />
          <Text className="font-montserrat text-base text-gray-900 ml-3 flex-1">
            About
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          disabled={status === "loading"} // ⛔ prevent double taps
          className={`flex-row items-center rounded-2xl p-4 shadow-md shadow-purple-500 ${
            status === "loading" ? "bg-gray-300" : "bg-white"
          }`}
          onPress={async () => {
            const result = await dispatch(logoutUser());
            if (logoutUser.fulfilled.match(result)) {
              router.replace("/(auth)/login");
            }
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#DC2626" />
          <Text className="font-montserratBold text-base text-red-600 ml-3">
            {status === "loading" ? "Logging out..." : "Logout"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// const styles = StyleSheet.create({
//   role: {
//     fontSize: 14,
//     fontFamily: "Montserrat_400Regular",
//     color: "#6B7280",
//   },
//   pointsLabel: {
//     flex: 1,
//     marginLeft: 12,
//     fontSize: 16,
//     fontFamily: "Montserrat_400Regular",
//     color: "#111827",
//   },
//   pointsValue: {
//     fontSize: 18,
//     fontFamily: "Montserrat_600SemiBold",
//     color: "#4F46E5",
//   },
//   itemText: {
//     marginLeft: 12,
//     fontSize: 16,
//     fontFamily: "Montserrat_400Regular",
//     color: "#111827",
//     flex: 1,
//   },
//   badgesValue: {
//     fontSize: 16,
//     fontFamily: "Montserrat_600SemiBold",
//     color: "#4F46E5",
//   },
//   logout: {
//     marginLeft: 12,
//     fontSize: 16,
//     fontFamily: "Montserrat_600SemiBold",
//     color: "#DC2626",
//   },
// });
