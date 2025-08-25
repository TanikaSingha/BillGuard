import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext, colors } from "../context/ThemeContext";

// Mock badge metadata
// const BADGE_METADATA: Record<
//   string,
//   { icon: string; description: string; color: string }
// > = {
//   "Rookie Reporter": {
//     icon: "https://www.freepik.com/icon/interview_7403591#fromView=search&page=1&position=1&uuid=66733126-09a8-4d74-85f5-1b3a6653f3b2",
//     description: "Submitted your first report!",
//     color: "#FBBF24",
//   },
//   "Persistent Eye": {
//     icon: "https://www.freepik.com/icon/vision_4233555#fromView=search&page=1&position=2&uuid=cca06fbc-2aba-44bf-8c60-759b7115bccd",
//     description: "Submitted 5 reports!",
//     color: "#34D399",
//   },
//   "Community Favorite": {
//     icon: "https://www.freepik.com/icon/engagement_15181615#fromView=search&page=1&position=1&uuid=782b39c4-bb2d-46ae-85bb-7a986621601d",
//     description: "One of your reports got 10+ upvotes!",
//     color: "#60A5FA",
//   },
//   "Zone Expert": {
//     icon: "https://www.freepik.com/icon/nearby_8016406#fromView=search&page=1&position=3&uuid=6b4332b5-6ab7-4197-890b-4a5bc15b33c0",
//     description: "Reported in 3 different zones.",
//     color: "#F472B6",
//   },
//   "AI Challenger": {
//     icon: "https://www.freepik.com/icon/ai-assistant_13298257#fromView=search&page=1&position=3&uuid=9b32cdcf-d37e-48f1-bdd8-993faa3aa273",
//     description: "Correctly overrode AI verdict 3 times.",
//     color: "#A78BFA",
//   },
//   "Social Critic": {
//     icon: "https://www.freepik.com/icon/problem_1066422#fromView=search&page=1&position=1&uuid=819b65d4-523f-4d55-aebe-4e26b1b23e92",
//     description: "Commented on 5 reports.",
//     color: "#F87171",
//   },
// };

const BADGE_METADATA: Record<
  string,
  {
    icon: keyof typeof Ionicons.glyphMap;
    description: string;
    color: string;
    iconColor: string;
  }
> = {
  "Rookie Reporter": {
    icon: "person-add-outline",
    description: "Submitted your first report!",
    color: "#FBBF24", // yellow
    iconColor: "#D97706", // darker amber
  },
  "Persistent Eye": {
    icon: "eye-outline",
    description: "Submitted 5 reports!",
    color: "#34D399", // emerald
    iconColor: "#047857", // darker emerald
  },
  "Community Favorite": {
    icon: "thumbs-up-outline",
    description: "One of your reports got 10+ upvotes!",
    color: "#60A5FA", // blue
    iconColor: "#1E40AF", // darker blue
  },
  "Zone Expert": {
    icon: "location-outline",
    description: "Reported in 3 different zones.",
    color: "#F472B6", // pink
    iconColor: "#9D174D", // darker pink
  },
  "AI Challenger": {
    icon: "hardware-chip-outline",
    description: "Correctly overrode AI verdict 3 times.",
    color: "#A78BFA", // violet
    iconColor: "#4C1D95", // darker violet
  },
  "Social Critic": {
    icon: "chatbubbles-outline",
    description: "Commented on 5 reports.",
    color: "#F87171", // red
    iconColor: "#B91C1C", // darker red
  },
};

// Mock API data (simulate user badges)
const MOCK_USER_BADGES = [
  { name: "Rookie Reporter", dateEarned: "2025-08-01" },
  { name: "Persistent Eye", dateEarned: "2025-08-05" },
  { name: "Zone Expert", dateEarned: "2025-08-12" },
];
const formatNiceDateTime = (isoDate: string) => {
  // e.g., "12 Aug 2025, 14:30"
  const d = new Date(isoDate);
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};
type BadgeItem = { name: string; dateEarned: string };

// ---- Badge Card ----
const BadgeCard = ({
  badge,
  meta,
  surface,
  border,
  text,
  textSecondary,
}: {
  badge: BadgeItem;
  meta: { icon: string; description: string; color: string };
  surface: string;
  border: string;
  text: string;
  textSecondary: string;
}) => {
  return (
    <Pressable
      android_ripple={{ color: border }}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          marginBottom: 12,
          borderRadius: 16,
          backgroundColor: surface,
          borderWidth: 1,
          borderColor: border,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 2,
          transform: [{ scale: pressed ? 0.99 : 1 }],
        },
      ]}
    >
      {/* Icon + soft ring */}
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: `${meta.color}1A`, // ~10% tint
          justifyContent: "center",
          alignItems: "center",
          marginRight: 16,
          borderWidth: 1,
          borderColor: `${meta.color}33`, // soft ring
        }}
      >
        <Image
          source={{ uri: meta.icon }}
          style={{ width: 36, height: 36, resizeMode: "contain" }}
        />
      </View>

      {/* Text block */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: text,
            fontWeight: "700",
            fontSize: 18,
            letterSpacing: 0.2,
          }}
        >
          {badge.name}
        </Text>
        <Text style={{ color: textSecondary, marginTop: 4, lineHeight: 18 }}>
          {meta.description}
        </Text>

        <View
          style={{
            marginTop: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ionicons name="checkmark-circle" size={16} color={meta.color} />
          <Text style={{ color: textSecondary, fontSize: 12 }}>
            Earned on {formatNiceDateTime(badge.dateEarned)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};
const BadgePage = () => {
  const { currentTheme } = useContext(ThemeContext);
  const themeColors = colors[currentTheme as keyof typeof colors];

  const [badges, setBadges] = useState<typeof MOCK_USER_BADGES>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("loading");
  const [error, setError] = useState<string | null>(null);

  // Simulate API fetch
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setStatus("loading");
        await new Promise((r) => setTimeout(r, 1200));
        setBadges(MOCK_USER_BADGES);
        setStatus("succeeded");
      } catch (err) {
        setError("Failed to load badges.");
        setStatus("failed");
      }
    };
    fetchBadges();
  }, []);

  if (status === "loading") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: themeColors.background,
        }}
      >
        <ActivityIndicator size="large" color={themeColors.accent} />
        <Text style={{ color: themeColors.textSecondary, marginTop: 12 }}>
          Loading badges...
        </Text>
      </View>
    );
  }

  if (status === "failed" || error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: themeColors.background,
          paddingHorizontal: 24,
        }}
      >
        <Text
          style={{
            color: "#EF4444",
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {error}
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 16,
            backgroundColor: themeColors.accent,
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 24,
          }}
          onPress={() => setStatus("loading")}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: themeColors.background,
        paddingTop: 16,
        paddingHorizontal: 16,
      }}
    >
      {/* Header */}
      <View className="mb-6">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile")} // <-- requires `useNavigation` from @react-navigation/native
          className="absolute left-0 top-0 p-2"
        >
          <Ionicons name="chevron-back" size={24} color="#6c4fe0ff" />
        </TouchableOpacity>
        {/* Title */}
        <Text className="text-3xl font-montserratBold tracking-wide text-primary-main ml-10">
          My Badges
        </Text>

        {/* Subtitle */}
        <Text className="mt-1 text-base text-gray-400 font-montserrat ml-10">
          Earned by your contributions in reporting
        </Text>
      </View>

      <ScrollView className="mx-4" showsVerticalScrollIndicator={false}>
        {badges.map((badge, idx) => {
          const meta = BADGE_METADATA[badge.name];
          if (!meta) return null;

          return (
            <View
              key={idx}
              className="flex-row items-center bg-white rounded-2xl px-4 py-3 mb-3 shadow-sm"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
              }}
            >
              <View
                className="w-12 h-12 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${meta.color}20` }}
              >
                <Ionicons name={meta.icon} size={24} color={meta.iconColor} />
              </View>

              <View className="flex-1">
                <Text
                  className="font-semibold text-base"
                  style={{
                    fontFamily: "Montserrat-Bold",
                    color: meta.color,
                  }}
                >
                  {badge.name}
                </Text>
                <Text
                  className="text-xs mt-0.5"
                  style={{ fontFamily: "Montserrat", color: "#6B7280" }}
                >
                  {meta.description}
                </Text>
              </View>
              <Text
                className="text-xs"
                style={{ fontFamily: "Montserrat", color: "#9CA3AF" }}
              >
                {new Date(badge.dateEarned).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                })}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BadgePage;
