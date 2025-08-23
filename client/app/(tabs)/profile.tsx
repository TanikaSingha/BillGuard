// import { logoutUser } from "@/lib/Slices/userSlice";
// import { AppDispatch, RootState } from "@/store/store";
// import { Ionicons } from "@expo/vector-icons";
// import { useFonts } from "expo-font";
// import { useRouter } from "expo-router";
// import React, { useContext, useState } from "react";
// import { Image, Switch, Text, TouchableOpacity, View } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { ThemeContext, colors } from "../context/ThemeContext";

// export default function Profile() {
//   const [fontsLoaded] = useFonts({
//     Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
//     "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"), // adjust path
//   });
//   const {user}=useSelector((state:RootState)=>state.user);
//   const { status } = useSelector((state: RootState) => state.user);
//   const router = useRouter();
//   const dispatch = useDispatch<AppDispatch>();
  
//   const { currentTheme, toggleTheme } = useContext(ThemeContext);
//   const [menuVisible, setMenuVisible] = useState(false);
//   const theme = colors[currentTheme as keyof typeof colors];

//   if (!user) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <Text className="font-montserrat text-gray-500">Loading user...</Text>
//       </View>
//     );
//   }
//   return (
//     <View className="flex-1 bg-white">
//       <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200 bg-primary-deep">
//         <Text className="font-montserratBold text-xl text-white">
//           Profile
//         </Text>
//         <TouchableOpacity onPress={() => setMenuVisible(prev => !prev)}>
//             <Ionicons name="settings-outline" size={24} color="white" />
//           </TouchableOpacity>
//       </View>
//       {/* Settings menu */}
//         {menuVisible && (
//           <View
//             className="absolute right-4 top-16 px-4 py-2 w-48 z-50 rounded-2xl"
//             style={{
//               backgroundColor: "#CAA8F5",
//               borderColor: "#9984D4",
//               borderWidth: 2,
//               shadowColor: "#230C33",
//               shadowOpacity: 0.25,
//               shadowRadius: 10,
//               shadowOffset: { width: 0, height: 4 },
//               elevation: theme.cardElevation,
//             }}
//           >
//             <View className="flex-row justify-between items-center">
//               <Text
//                 className="text-base font-montserrat"
//                 style={{ color: "#230C33" }}
//               >
//                 Dark Mode
//               </Text>
//               <Switch
//                 value={currentTheme === "dark"}
//                 onValueChange={() =>
//                   toggleTheme(currentTheme === "light" ? "dark" : "light")
//                 }
//               />
//             </View>
//           </View>
//         )}

//       {/* Top Section */}
//       <View className="flex-row m-6 p-8 items-center border border-4 border-primary-medium bg-primary-light justify-between rounded-xl shadow-lg shadow-primary-dark">
//         {/* Profile Image */}
//         <Image
//           className="w-28 h-28 rounded-full border border-2 border-primary-medium"
//           source={require("../../assets/images/profile.png")}
//         />

//         {/* User Info + Stats */}
//         <View className="flex-1 ml-4">
//           {/* Name + Role */}
//           <View className="flex-row flex-wrap mb-2">
//             <Text className="font-montserratBold text-xl text-primary-deep">
//             {user.username}
//           </Text>
//           <Text className="font-montserrat text-base text-primary-dark">
//             ({user.role})
//           </Text>
//           </View>
          

//           {/* Stats Row (like Instagram) */}
//           <View className="flex-row justify-between">
//             <View className="items-start">
//               <Text className="font-montserrat text-lg text-gray-900">
//                 {user.normalUser?.xp||0}
//               </Text>
//               <Text className="font-montserrat text-sm text-gray-500">
//                 Points
//               </Text>
//             </View>
//             <View className="items-start">
//               <Text className="font-montserrat text-lg text-gray-900">
//                 {user.normalUser?.badges || 0}
//               </Text>
//               <Text className="font-montserrat text-sm text-gray-500">
//                 Badges
//               </Text>
//             </View>
//             <View className="items-start">
//               <Text className="font-montserrat text-lg text-gray-900">
//                 {user.normalUser?.reportsSubmitted || 0}
//               </Text>
//               <Text className="font-montserrat text-sm text-gray-500">
//                 Reports
//               </Text>
//             </View>
//           </View>
//         </View>
//       </View>


//       {/* Cards */}
//       <View className="mx-5 gap-4 mb-10">
//         {/* Grid of cards */}
//         <View className="flex-row flex-wrap justify-between">
//           {/* Badges */}
//           <TouchableOpacity className="w-[48%] aspect-square border bg-white rounded-2xl shadow-lg shadow-gray-900 flex items-center justify-center mb-4">
//             <Ionicons name="ribbon-outline" size={40} color="#4F46E5" />
//             <Text className="font-montserrat text-base text-gray-900 mt-2 text-center">
//               My Badges
//             </Text>
//           </TouchableOpacity>

//           {/* Account Details */}
//           <TouchableOpacity className="w-[48%] aspect-square border bg-white rounded-2xl shadow-lg shadow-gray-900 flex items-center justify-center mb-4">
//             <Ionicons name="person-outline" size={40} color="#4F46E5" />
//             <Text className="font-montserrat text-base text-gray-900 mt-2 text-center">
//               Account Details
//             </Text>
//           </TouchableOpacity>

//           {/* My Reports */}
//           <TouchableOpacity className="w-[48%] aspect-square border bg-white rounded-2xl shadow-lg shadow-gray-900 flex items-center justify-center mb-4">
//             <Ionicons name="document-text-outline" size={40} color="#4F46E5" />
//             <Text className="font-montserrat text-base text-gray-900 mt-2 text-center">
//               My Reports
//             </Text>
//           </TouchableOpacity>

//           {/* About */}
//           <TouchableOpacity className="w-[48%] aspect-square border bg-white rounded-2xl shadow-lg shadow-gray-900 flex items-center justify-center mb-4">
//             <Ionicons name="information-circle-outline" size={40} color="#4F46E5" />
//             <Text className="font-montserrat text-base text-gray-900 mt-2 text-center">
//               About
//             </Text>
//           </TouchableOpacity>

//           {/* Logout button (full width, stays same) */}
//           {/* <View className="flex-row justify-center items-center mt-4 w-[100%] h-[20%]"> */}
//             <TouchableOpacity
//               disabled={status === "loading"}
//               className={`w-[48%] aspect-square border border-2 border-red-500 rounded-2xl shadow-lg shadow-gray-900 flex items-center justify-center mb-4 ${
//                 status === "loading" ? "bg-gray-300" : "bg-white"
//               }`}
//               onPress={async () => {
//                 const result = await dispatch(logoutUser());
//                 if (logoutUser.fulfilled.match(result)) {
//                   router.replace("/(auth)/login");
//                 }
//               }}
//             >
//               <Ionicons
//                 name="log-out-outline"
//                 size={40}
//                 color={status === "loading" ? "#9CA3AF" : "red"}
//               />
//               <Text className="text-md font-montserratBold text-red-500">Logout</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       {/* </View> */}

//     </View>
//   );
// }


import { logoutUser } from "@/lib/Slices/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { Image, Switch, Text, TouchableOpacity, View } from "react-native";
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
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border bg-primary-dark">
        <Text className="font-montserratBold text-xl text-white">Profile</Text>
        <TouchableOpacity onPress={() => setMenuVisible((prev) => !prev)}>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Settings menu */}
      {menuVisible && (
        <View
          className="absolute right-4 top-16 px-4 py-2 w-48 z-50 rounded-2xl border"
          style={{
            backgroundColor: "#A78BFA", // primary.light
            borderColor: "#6C4FE0", // primary.main
            borderWidth: 2,
            shadowColor: "#4C1D95", // primary.dark
            shadowOpacity: 0.25,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: theme.cardElevation,
          }}
        >
          <View className="flex-row justify-between items-center">
            <Text className="text-base font-montserrat text-text-primary">
              Dark Mode
            </Text>
            <Switch
              value={currentTheme === "dark"}
              onValueChange={() =>
                toggleTheme(currentTheme === "light" ? "dark" : "light")
              }
            />
          </View>
        </View>
      )}

      {/* Top Section */}
      <View className="flex-row m-6 p-8 items-center bg-white justify-between rounded-xl shadow-lg shadow-primary-dark">
        {/* Profile Image */}
        <Image
          className="w-28 h-28 rounded-full border-2 border-text-primary"
          source={require("../../assets/images/profile.png")}
        />

        {/* User Info + Stats */}
        <View className="flex-1 ml-4">
          <View className="flex-row flex-wrap mb-2">
            <Text className="font-montserratBold text-xl text-text-primary">
              {user.username}
            </Text>
            <Text className="font-montserrat text-base text-text-secondary">
              ({user.role})
            </Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row justify-between">
            <View className="items-start">
              <Text className="font-montserrat text-lg text-text-primary">
                {user.normalUser?.xp || 0}
              </Text>
              <Text className="font-montserrat text-sm text-text-secondary">
                Points
              </Text>
            </View>
            <View className="items-start">
              <Text className="font-montserrat text-lg text-text-primary">
                {user.normalUser?.badges || 0}
              </Text>
              <Text className="font-montserrat text-sm text-text-secondary">
                Badges
              </Text>
            </View>
            <View className="items-start">
              <Text className="font-montserrat text-lg text-text-primary">
                {user.normalUser?.reportsSubmitted || 0}
              </Text>
              <Text className="font-montserrat text-sm text-text-secondary">
                Reports
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Cards */}
      <View className="mx-5 gap-4 mb-10">
        <View className="flex-row flex-wrap justify-between">
          {/* Badges */}
          <TouchableOpacity className="w-[48%] aspect-square border border-border bg-surface rounded-2xl shadow-lg shadow-primary-dark flex items-center justify-center mb-4">
            <Ionicons name="ribbon-outline" size={40} color="#6C4FE0" />
            <Text className="font-montserrat text-base text-text-primary mt-2 text-center">
              My Badges
            </Text>
          </TouchableOpacity>

          {/* Account Details */}
          <TouchableOpacity className="w-[48%] aspect-square border border-border bg-surface rounded-2xl shadow-lg shadow-primary-dark flex items-center justify-center mb-4">
            <Ionicons name="person-outline" size={40} color="#6C4FE0" />
            <Text className="font-montserrat text-base text-text-primary mt-2 text-center">
              Account Details
            </Text>
          </TouchableOpacity>

          {/* My Reports */}
          <TouchableOpacity className="w-[48%] aspect-square border border-border bg-surface rounded-2xl shadow-lg shadow-primary-dark flex items-center justify-center mb-4">
            <Ionicons name="document-text-outline" size={40} color="#6C4FE0" />
            <Text className="font-montserrat text-base text-text-primary mt-2 text-center">
              My Reports
            </Text>
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity className="w-[48%] aspect-square border border-border bg-surface rounded-2xl shadow-lg shadow-primary-dark flex items-center justify-center mb-4">
            <Ionicons
              name="information-circle-outline"
              size={40}
              color="#6C4FE0"
            />
            <Text className="font-montserrat text-base text-text-primary mt-2 text-center">
              About
            </Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            disabled={status === "loading"}
            className={`w-[48%] aspect-square border-2 rounded-2xl shadow-lg shadow-primary-dark flex items-center justify-center mb-4 ${
              status === "loading" ? "bg-text-disabled" : "bg-surface"
            }`}
            style={{
              borderColor: "#EF4444", // error
            }}
            onPress={async () => {
              const result = await dispatch(logoutUser());
              if (logoutUser.fulfilled.match(result)) {
                router.replace("/(auth)/login");
              }
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={40}
              color={status === "loading" ? "#9CA3AF" : "#EF4444"}
            />
            <Text className="text-md font-montserratBold text-error">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
