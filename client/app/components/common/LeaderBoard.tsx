import { getLeaderBoard } from "@/lib/Slices/leaderBoardSlice";
import { AppDispatch } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import LeaderboardItem from "../../components/leaderBoard/LeaderBoardItem";

const LeaderBoardPage = () => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<AppDispatch>();

  const { status, data, error } = useSelector(
    (state: any) => state.leaderBoard
  );

  useEffect(() => {
    console.log("Leaderboard fetched");

    dispatch(getLeaderBoard());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#6c4fe0ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="font-montserratBold text-2xl text-error">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* header */}
      <View className="flex-row items-center px-5 pt-5 pb-3 border-b border-border bg-surface">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <Ionicons name="arrow-back-outline" size={24} color={"#1F2937"} />
        </TouchableOpacity>
        <Text className="font-montserratBold text-xl text-primary-main">
          Leaderboard
        </Text>
      </View>
      {/* Container */}
      <SafeAreaView edges={["bottom"]} style={{ flex: 1 }}>
        <View className="bg-background p-4 mx-4 mb-4">
          {/* List */}
          <ScrollView showsVerticalScrollIndicator={false} className="mt-4">
            {data?.map((item: any, index: number) => (
              <LeaderboardItem
                key={item?._id || index}
                item={item}
                rank={index + 1}
              />
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LeaderBoardPage;
