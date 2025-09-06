import { voteReport } from "@/lib/Slices/reportSlice";
import apiRequest from "@/lib/utils/apiRequest";
import { AppDispatch } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

const BillBoardDetails = () => {
  const { billboardId } = useLocalSearchParams();
  const [billboard, setBillboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleVote = (reportId: string, voteType: "upvote" | "downvote") => {
    dispatch(voteReport({ reportId, voteType }));
  };

  useEffect(() => {
    const fetchBillboard = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await apiRequest.get<{ data: any }>(
          `/billboard/details/${billboardId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res) throw new Error("Failed to fetch billboard");
        setBillboard(res.data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBillboard();
  }, [billboardId]);

  const renderReportItem = ({ item }: { item: any }) => {
    const status = (item?.status || "").toLowerCase();
    const statusStyles =
      status === "pending"
        ? { bg: "#FEF3C7", border: "#F59E0B", text: "#B45309" }
        : status === "rejected"
          ? { bg: "#FEE2E2", border: "#EF4444", text: "#B91C1C" }
          : { bg: "#DCFCE7", border: "#16A34A", text: "#166534" };

    const verdictType = item.aiAnalysis?.verdict || "UNSURE";
    const verdictText = verdictType.toUpperCase();

    const confidence =
      typeof item.aiAnalysis?.confidence === "number"
        ? (item.aiAnalysis.confidence * 100).toFixed(1)
        : null;

    const thumb = item.annotatedURL || item.imageURL;

    return (
      <View
        className="mb-4 mx-2 rounded-2xl p-4 shadow-md border border-border"
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: "#E5E7EB",
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        {/* Top row: date & time */}
        <View className="flex-row items-center">
          <Text
            className="text-sm font-montserrat"
            style={{ color: "#6B7280" }}
          >
            {new Date(item.submittedAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
        </View>

        {/* Middle row */}
        <View className="flex-row items-start gap-3 mt-4 border-b border-text-secondary/20 pb-4">
          {thumb ? (
            <Image
              source={{ uri: thumb }}
              className="h-24 w-24 rounded-xl"
              resizeMode="cover"
            />
          ) : (
            <View
              className="h-24 w-24 rounded-xl"
              style={{ backgroundColor: "#F3F4F6" }}
            />
          )}

          <View className="flex-1">
            {/* Status pill */}
            <View
              className="self-start rounded-lg px-2 py-0.5"
              style={{
                backgroundColor: statusStyles.bg,
                borderColor: statusStyles.border,
                borderWidth: 1,
              }}
            >
              <Text
                className="text-[10px] font-montserratBold"
                style={{ color: statusStyles.text }}
              >
                {item.status?.toUpperCase()}
              </Text>
            </View>

            {/* Verdict */}
            <Text
              numberOfLines={1}
              className="mt-1 text-base font-montserratBold"
              style={{ color: "#1F2937" }}
            >
              {verdictText === "AUTHORIZED"
                ? "Authorized"
                : verdictText === "UNAUTHORIZED"
                  ? "Unauthorized"
                  : "Unsure"}
            </Text>

            {/* AI Confidence */}
            {confidence !== null && (
              <Text
                className="mt-0.5 text-sm font-montserrat"
                style={{ color: "#6B7280" }}
              >
                AI Confidence: {confidence}%
              </Text>
            )}

            {/* Issues */}
            <View className="mt-1 flex-row flex-wrap gap-2">
              {item.aiAnalysis.detectedObjects?.length ? (
                item.aiAnalysis.detectedObjects.map(
                  (issue: string, idx: number) => {
                    const formatted = issue
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase());
                    return (
                      <View
                        key={idx}
                        className="rounded-full px-2 py-0.5"
                        style={{ backgroundColor: "#F3F4F6" }}
                      >
                        <Text
                          className="text-[11px] font-montserrat"
                          style={{ color: "#374151" }}
                        >
                          {formatted}
                        </Text>
                      </View>
                    );
                  }
                )
              ) : (
                <Text
                  className="text-[11px] font-montserrat"
                  style={{ color: "#9CA3AF" }}
                >
                  No issues
                </Text>
              )}
            </View>

            {/* Upvote / Downvote buttons */}
            <View className="flex-row items-center gap-6 mt-3">
              {/* Upvote */}
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={item.userVote === "upvote"} // disable if already upvoted
                onPress={() => handleVote(item._id, "upvote")}
              >
                <View className="flex-row items-center gap-1">
                  <Ionicons
                    name="arrow-up"
                    size={20}
                    color={item.userVote === "upvote" ? "#16A34A" : "#9CA3AF"}
                  />
                  <Text className="text-sm text-gray-700">
                    {item.upvotes.length}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Downvote */}
              <TouchableOpacity
                activeOpacity={0.7}
                disabled={item.userVote === "downvote"} // disable if already downvoted
                onPress={() => handleVote(item._id, "downvote")}
              >
                <View className="flex-row items-center gap-1">
                  <Ionicons
                    name="arrow-down"
                    size={20}
                    color={item.userVote === "downvote" ? "#EF4444" : "#9CA3AF"}
                  />
                  <Text className="text-sm text-gray-700">
                    {item.downvotes.length}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  if (error) return <Text style={{ color: "red", margin: 20 }}>{error}</Text>;
  if (!billboard) return <Text>No billboard data found.</Text>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View className="p-4">
        {/* Billboard Heading */}
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <Text>Back</Text>
        </TouchableOpacity>
        <Text className="text-xl font-montserratBold mb-2 text-gray-900">
          Billboard @ {billboard.location?.address || "Unknown location"}
        </Text>
        <Text className="text-sm text-gray-600 mb-1">
          Coordinates: {billboard.location?.coordinates?.join(", ")}
        </Text>
        <Text className="text-sm text-gray-600 mb-1">
          Status: {billboard.verifiedStatus}
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          Crowd Confidence: {billboard.crowdConfidence.toFixed(2)}%
        </Text>

        {/* Reports */}
        <Text className="text-lg font-montserratBold mb-3 text-gray-800">
          Reports
        </Text>
        {billboard.reports?.length ? (
          <FlatList
            data={billboard.reports}
            keyExtractor={(item) => item._id}
            renderItem={renderReportItem}
            scrollEnabled={false}
          />
        ) : (
          <Text className="text-center text-gray-500">No reports found.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default BillBoardDetails;
