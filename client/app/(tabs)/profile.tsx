import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import React, { useContext, useState } from "react";
import { Image, ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import AnimatedScreenWrapper from "../components/ScreenWrapper";
import { colors, ThemeContext } from "../context/ThemeContext";

export default function Profile() {
  const [fontsLoaded] = useFonts({
    "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
  });
  const navigation = useNavigation();
  const { currentTheme, toggleTheme } = useContext(ThemeContext);
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = colors[currentTheme as keyof typeof colors];

  const user = {
    name: "Michael",
    role: "User",
    points: 120,
    profileImage: "https://i.pravatar.cc/300",
    badges: 5,
  };

  return (
    <AnimatedScreenWrapper>
      <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text
            className="font-montserratBold text-xl"
            style={{ color: theme.textPrimary }}
          >
            Profile
          </Text>
          <TouchableOpacity onPress={() => setMenuVisible(prev => !prev)}>
            <Ionicons name="settings-outline" size={24} color={theme.icon} />
          </TouchableOpacity>
        </View>

        {/* Settings menu */}
        {menuVisible && (
          <View
            className="absolute right-4 top-16 px-4 py-2 w-48 z-50 rounded-2xl"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
              borderWidth: 2,
              shadowColor: theme.cardShadow,
              shadowOpacity: 0.25,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: theme.cardElevation,
            }}
          >
            <View className="flex-row justify-between items-center">
              <Text
                className="text-base font-montserrat"
                style={{ color: theme.textSecondary }}
              >
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

        {/* Profile info */}
        <View className="items-center my-6">
          <Image
            className="w-28 h-28 rounded-full mb-4"
            source={{ uri: user.profileImage }}
          />
          <Text
            className="font-montserratBold text-2xl"
            style={{ color: theme.textPrimary }}
          >
            {user.name}
          </Text>
          <Text
            className="font-montserrat text-base"
            style={{ color: theme.textSecondary }}
          >
            Role: {user.role}
          </Text>
        </View>

        {/* Points card */}
        <View className="mx-5 mb-5">
          <View
            className="flex-row items-center rounded-2xl p-5"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
              borderWidth: 1,
              shadowColor: theme.cardShadow,
              shadowOpacity: 0.15,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 6 },
              elevation: theme.cardElevation,
            }}
          >
            <Ionicons name="trophy" size={28} color={theme.highlightIcon} />
            <Text
              className="font-montserratBold flex-1 ml-3"
              style={{ color: theme.textPrimary }}
            >
              Points Earned
            </Text>
            <Text
              className="font-montserratBold text-lg"
              style={{ color: theme.highlightText }}
            >
              {user.points}
            </Text>
          </View>
        </View>

        {/* Action cards */}
        <View className="mx-5 gap-4 mb-10">
          {/* Badges */}
          <TouchableOpacity
            className="flex-row items-center rounded-2xl p-4"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
              borderWidth: 1,
              shadowColor: theme.cardShadow,
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: theme.cardElevation,
            }}
          >
            <Ionicons name="ribbon-outline" size={24} color={theme.icon} />
            <Text
              className="font-montserrat text-base flex-1 ml-3"
              style={{ color: theme.textSecondary }}
            >
              Badges Earned
            </Text>
            <Text
              className="font-montserratBold text-base"
              style={{ color: theme.textPrimary }}
            >
              {user.badges}
            </Text>
          </TouchableOpacity>

          {/* Account Details */}
          <TouchableOpacity
            className="flex-row items-center rounded-2xl p-4"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
              borderWidth: 1,
              shadowColor: theme.cardShadow,
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: theme.cardElevation,
            }}
          >
            <Ionicons name="person-outline" size={24} color={theme.icon} />
            <Text
              className="font-montserrat text-base flex-1 ml-3"
              style={{ color: theme.textSecondary }}
            >
              Account Details
            </Text>
          </TouchableOpacity>

          {/* My Reports */}
          <TouchableOpacity
            className="flex-row items-center rounded-2xl p-4"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
              borderWidth: 1,
              shadowColor: theme.cardShadow,
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: theme.cardElevation,
            }}
          >
            <Ionicons name="document-text-outline" size={24} color={theme.icon} />
            <Text
              className="font-montserrat text-base flex-1 ml-3"
              style={{ color: theme.textSecondary }}
            >
              My Reports
            </Text>
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity
            className="flex-row items-center rounded-2xl p-4"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
              borderWidth: 1,
              shadowColor: theme.cardShadow,
              shadowOpacity: 0.1,
              shadowRadius: 6,
              elevation: theme.cardElevation,
            }}
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.icon}
            />
            <Text
              className="font-montserrat text-base flex-1 ml-3"
              style={{ color: theme.textSecondary }}
            >
              About
            </Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            className="flex-row items-center rounded-2xl p-4"
            style={{
              backgroundColor: theme.cardBackground,
              borderColor: theme.cardBorder,
              borderWidth: 1,
              shadowColor: theme.shadowStrong,
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: theme.cardElevation,
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="#DC2626" />
            <Text
              className="font-montserratBold text-base ml-3"
              style={{ color: "#DC2626" }}
            >
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AnimatedScreenWrapper>
  );
}
