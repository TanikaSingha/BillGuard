import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LeaderboardItem from "../components/leaderBoard/LeaderBoardItem";

const LeaderBoardPage = () => {
  const navigation = useNavigation<any>();
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("succeeded");
  const [error, setError] = React.useState<string | null>(null);

  const data = [
    {
      username: "Alice",
      avatar: "https://i.pravatar.cc/150?img=1",
      playerLevel: 15,
      score: 2450,
    },
    {
      username: "Bob",
      avatar: "https://i.pravatar.cc/150?img=2",
      playerLevel: 12,
      score: 1980,
    },
    {
      username: "Charlie",
      avatar: "https://i.pravatar.cc/150?img=3",
      playerLevel: 10,
      score: 1750,
    },
    {
      username: "Diana",
      avatar: "https://i.pravatar.cc/150?img=4",
      playerLevel: 8,
      score: 1420,
    },
    {
      username: "Ethan",
      avatar: "https://i.pravatar.cc/150?img=5",
      playerLevel: 7,
      score: 1300,
    },
    {
      username: "Fiona",
      avatar: "https://i.pravatar.cc/150?img=6",
      playerLevel: 6,
      score: 1150,
    },
    {
      username: "George",
      avatar: "https://i.pravatar.cc/150?img=7",
      playerLevel: 5,
      score: 980,
    },
    {
      username: "Hannah",
      avatar: "https://i.pravatar.cc/150?img=8",
      playerLevel: 4,
      score: 850,
    },
    {
      username: "Ian",
      avatar: "https://i.pravatar.cc/150?img=9",
      playerLevel: 3,
      score: 700,
    },
    {
      username: "Jane",
      avatar: "https://i.pravatar.cc/150?img=10",
      playerLevel: 2,
      score: 550,
    },
  ];

  if (status === "loading") {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#111827",
        }}
      >
        <ActivityIndicator size="large" color="#6C4FE0" />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#111827",
        }}
      >
        <Text style={{ color: "#EF4444", fontSize: 22, fontWeight: "bold" }}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111827",
        alignItems: "center",
        paddingTop: 20,
      }}
    >
      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: "absolute",
          top: 50,
          left: 20,
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: "#FFFFFF",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 50,
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Ionicons name="arrow-back-outline" size={24} color="#000" />
      </TouchableOpacity>

      {/* Container */}
      <View
        style={{
          width: "95%",
          marginTop: 60,
          borderWidth: 2,
          borderColor: "#FACC15",
          borderRadius: 24,
          padding: 16,
          backgroundColor: "#1F2937",
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
        }}
      >
        {/* Title */}
        <View
          style={{
            position: "absolute",
            top: -30,
            left: "50%",
            transform: [{ translateX: -150 }],
            backgroundColor: "#111827",
            borderWidth: 2,
            borderColor: "#FCD34D",
            width: 300,
            padding: 16,
            borderRadius: 24,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: "#FDE68A",
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Leaderboard
          </Text>
        </View>

        {/* List */}
        <ScrollView style={{ marginTop: 50 }}>
          {data.map((item, index) => (
            <LeaderboardItem key={index} item={item} rank={index + 1} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default LeaderBoardPage;
