import apiRequest from "@/lib/utils/apiRequest";
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

const BillBoardDetails = () => {
  const { billboardId } = useLocalSearchParams();
  const [billboard, setBillboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

    const verdict = (item.aiAnalysis?.verdict || "N/A").toUpperCase();
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
          <Ionicons
            name="ellipse"
            size={4}
            color="#9CA3AF"
            style={{ marginHorizontal: 6 }}
          />
          <Text
            className="text-sm font-montserrat"
            style={{ color: "#6B7280" }}
          >
            {new Date(item.submittedAt).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
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
              {verdict === "AUTHORIZED"
                ? "Authorized"
                : verdict === "UNAUTHORIZED"
                  ? "Unauthorized"
                  : verdict}
            </Text>

            {/* Issues */}
            <View className="mt-1 flex-row flex-wrap gap-2">
              {item.violationType?.length ? (
                item.violationType.map((issue: string, idx: number) => {
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
                })
              ) : (
                <Text
                  className="text-[11px] font-montserrat"
                  style={{ color: "#9CA3AF" }}
                >
                  No issues
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Bottom row: See details */}
        <View className="mt-4 flex-row justify-end">
          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() =>
              router.push({
                pathname: "/reports/[reportId]",
                params: { reportId: item._id },
              })
            }
            activeOpacity={0.8}
          >
            <Text
              className="text-sm font-montserratBold"
              style={{ color: "#6C4FE0" }}
            >
              See details
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#6C4FE0" />
          </TouchableOpacity>
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
