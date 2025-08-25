import React from "react";
import { View, Text, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LeaderboardItemProps {
  item: {
    avatar: string;
    username: string;
    score: number;
    playerLevel: number;
  };
  rank: number;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ item, rank }) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return "#FBBF24"; // Gold
    if (rank === 2) return "#D1D5DB"; // Silver
    if (rank === 3) return "#CD7F32"; // Bronze
    return "#4B5563"; // Dark Gray
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
        backgroundColor: "#111827", // dark background like Reports' cards
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      }}
    >
      {/* Rank */}
      <Text
        style={{
          color: getRankColor(rank),
          fontSize: 20,
          fontWeight: "bold",
          width: 32,
          textAlign: "center",
        }}
      >
        #{rank}
      </Text>

      {/* Avatar */}
      <Image
        source={{ uri: item.avatar }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          marginHorizontal: 12,
          borderWidth: 2,
          borderColor: "#FBBF24",
        }}
      />

      {/* Info Box */}
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1F2937", // slightly lighter dark card
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
        }}
      >
        {/* Level + Medal */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="medal-outline"
            size={18}
            color={getRankColor(rank)}
            style={{ marginRight: 6 }}
          />
          <Text style={{ color: "#FFFFFF", fontSize: 14 }}>
            Level {item.playerLevel}
          </Text>
        </View>

        {/* Username */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
            flex: 1,
            textAlign: "center",
          }}
          numberOfLines={1}
        >
          {item.username}
        </Text>

        {/* Score */}
        <Text style={{ color: "#E5E7EB", fontSize: 16, fontWeight: "bold" }}>
          {item.score} pts
        </Text>
      </View>
    </View>
  );
};

export default LeaderboardItem;
