import { getAllReports } from "@/lib/Slices/reportSlice";
import { AppDispatch } from "@/store/store";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { useDispatch } from "react-redux";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard({ role }: { role: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");

  useEffect(() => {
    setStatus("loading");
    dispatch(getAllReports()).then((action: any) => {
      if (action.type.endsWith("/fulfilled")) {
        setReports(action.payload.data);
        setStatus("succeeded");
      } else {
        setStatus("failed");
      }
    });
  }, [dispatch]);

  const stats = useMemo(() => {
    const total = reports?.length || 0;
    const pending = reports?.filter((r) => r.status === "pending").length || 0;
    const resolved =
      reports?.filter((r) => r.status === "resolved").length || 0;
    const verified_authorized =
      reports?.filter((r) => r.status === "verified_authorized").length || 0;
    const verified_unauthorized =
      reports?.filter((r) => r.status === "verified_unauthorized").length || 0;

    return {
      total,
      pending,
      resolved,
      verified_authorized,
      verified_unauthorized,
    };
  }, [reports]);

  // Chart Data
  const pieData = [
    {
      name: "Pending",
      count: stats.pending,
      color: "#facc15",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Resolved",
      count: stats.resolved,
      color: "#22c55e",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Verified Authorized",
      count: stats.verified_authorized,
      color: "#3b82f6",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
    {
      name: "Verified Unauthorized",
      count: stats.verified_unauthorized,
      color: "#ef4444",
      legendFontColor: "#333",
      legendFontSize: 12,
    },
  ];

  const barData = {
    labels: ["Pending", "Resolved", "Auth", "Unauth"],
    datasets: [
      {
        data: [
          stats.pending,
          stats.resolved,
          stats.verified_authorized,
          stats.verified_unauthorized,
        ],
      },
    ],
  };

  return (
    <ScrollView className="p-4">
      <Text className="text-2xl font-bold mb-4">Dashboard</Text>

      {status === "loading" && <Text>Loading reports...</Text>}

      {/* Overview */}
      <View className="mb-4">
        <Text className="font-semibold mb-2">Overview</Text>
        <Text>Pending Reports: {stats.pending}</Text>
        <Text>Resolved Reports: {stats.resolved}</Text>
        <Text>Total Reports: {stats.total}</Text>
        <Text>Total Users: 50</Text>
      </View>

      {/* Pie Chart */}
      <Text className="font-semibold mb-2">Reports by Status</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
        }}
        accessor="count"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />

      {/* Bar Chart */}
      <Text className="font-semibold mt-6 mb-2">Reports Distribution</Text>
      <BarChart
        data={barData}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#4f46e5",
          backgroundGradientTo: "#7c3aed",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
        }}
        style={{ borderRadius: 12 }}
      />

      {/* Recent Reports */}
      <View className="mt-6">
        <Text className="font-semibold mb-2">Recent Reports</Text>
        {reports?.slice(0, 5).map((r) => (
          <View key={r._id} className="p-2 border-b border-gray-300">
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/reports/[reportId]",
                  params: { reportId: r._id },
                })
              }
            >
              <Text className="text-blue-600 font-medium">See Details</Text>
            </TouchableOpacity>
            {r.violationType?.map((type: string) => (
              <Text key={type} className="font-medium">
                {type}
              </Text>
            ))}
            <Text className="text-sm text-gray-600">{r.issueDescription}</Text>
            <Text className="text-xs text-gray-500">
              Status: {r.status} |{" "}
              {new Date(r.submittedAt).toLocaleDateString()}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
