import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeContext, colors } from "../context/ThemeContext";

// Mock badge metadata
const BADGE_METADATA: Record<
  string,
  { icon: string; description: string; color: string }
> = {
  "Rookie Reporter": {
    icon: "https://img.icons8.com/color/96/rookie.png",
    description: "Submitted your first report!",
    color: "#FBBF24",
  },
  "Persistent Eye": {
    icon: "https://img.icons8.com/color/96/spy.png",
    description: "Submitted 5 reports!",
    color: "#34D399",
  },
  "Community Favorite": {
    icon: "https://img.icons8.com/color/96/thumb-up.png",
    description: "One of your reports got 10+ upvotes!",
    color: "#60A5FA",
  },
  "Zone Expert": {
    icon: "https://img.icons8.com/color/96/marker.png",
    description: "Reported in 3 different zones.",
    color: "#F472B6",
  },
  "AI Challenger": {
    icon: "https://img.icons8.com/color/96/artificial-intelligence.png",
    description: "Correctly overrode AI verdict 3 times.",
    color: "#A78BFA",
  },
  "Social Critic": {
    icon: "https://img.icons8.com/color/96/chat.png",
    description: "Commented on 5 reports.",
    color: "#F87171",
  },
};

// Mock API data (simulate user badges)
const MOCK_USER_BADGES = [
  { name: "Rookie Reporter", dateEarned: "2025-08-01" },
  { name: "Persistent Eye", dateEarned: "2025-08-05" },
  { name: "Zone Expert", dateEarned: "2025-08-12" },
];

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
      <View style={{ marginBottom: 12, alignItems: "center" }}>
        <Text
          style={{
            color: themeColors.accent,
            fontSize: 28,
            fontWeight: "bold",
            letterSpacing: 1,
          }}
        >
          My Badges
        </Text>
        <Text
          style={{
            color: themeColors.textSecondary,
            marginTop: 4,
            textAlign: "center",
          }}
        >
          Earned by your contributions in reporting
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {badges.map((badge, idx) => {
          const meta = BADGE_METADATA[badge.name];
          if (!meta) return null;

          return (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                marginBottom: 12,
                borderRadius: 20,
                backgroundColor: themeColors.surface,
                borderColor: themeColors.border,
                borderWidth: 1,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 4 },
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  backgroundColor: meta.color + "33",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 16,
                }}
              >
                <Image
                  source={{ uri: meta.icon }}
                  style={{ width: 36, height: 36, resizeMode: "contain" }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: meta.color,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {badge.name}
                </Text>
                <Text
                  style={{ color: themeColors.textSecondary, marginTop: 2 }}
                >
                  {meta.description}
                </Text>
                <Text
                  style={{
                    color: themeColors.textSecondary,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Earned on {new Date(badge.dateEarned).toLocaleDateString()}
                </Text>
              </View>

              <Ionicons name="checkmark-circle" size={28} color={meta.color} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default BadgePage;
