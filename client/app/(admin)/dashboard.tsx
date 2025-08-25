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
    dispatch(getAllReports({})).then((action: any) => {
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

  // Pie Chart Data
  const pieData = [
    {
      name: "Pending",
      count: stats.pending,
      color: "#facc15",
      legendFontColor: "#374151",
      legendFontSize: 13,
    },
    {
      name: "Resolved",
      count: stats.resolved,
      color: "#22c55e",
      legendFontColor: "#374151",
      legendFontSize: 13,
    },
    {
      name: "Authorized",
      count: stats.verified_authorized,
      color: "#3b82f6",
      legendFontColor: "#374151",
      legendFontSize: 13,
    },
    {
      name: "Unauthorized",
      count: stats.verified_unauthorized,
      color: "#ef4444",
      legendFontColor: "#374151",
      legendFontSize: 13,
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
    <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
      {/* Header */}
      <Text className="text-3xl font-extrabold text-indigo-700 mb-6">
        📊 Dashboard
      </Text>

      {status === "loading" && (
        <Text className="text-gray-600 italic">Loading reports...</Text>
      )}

      {/* Overview Cards */}
      <View className="flex-row flex-wrap justify-between mb-6">
        {[
          {
            label: "Pending",
            value: stats.pending,
            color: "bg-yellow-100 text-yellow-700",
          },
          {
            label: "Resolved",
            value: stats.resolved,
            color: "bg-green-100 text-green-700",
          },
          {
            label: "Total",
            value: stats.total,
            color: "bg-indigo-100 text-indigo-700",
          },
          { label: "Users", value: 50, color: "bg-pink-100 text-pink-700" },
        ].map((item) => (
          <View
            key={item.label}
            className={`w-[48%] rounded-2xl p-5 mb-4 shadow-md ${item.color.split(" ")[0]}`}
          >
            <Text className={`text-xl font-bold ${item.color.split(" ")[1]}`}>
              {item.value}
            </Text>
            <Text className="text-gray-600 mt-1">{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Pie Chart Card */}
      <View className="bg-white rounded-2xl shadow-md p-4 mb-6">
        <Text className="font-semibold text-gray-700 mb-3">
          Reports by Status
        </Text>
        <PieChart
          data={pieData}
          width={screenWidth - 50}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(55,65,81,${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      {/* Bar Chart Card */}
      <View className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-4 mb-6">
        <Text className="font-semibold text-white mb-3">
          Reports Distribution
        </Text>
        <BarChart
          data={barData}
          width={screenWidth - 50}
          height={220}
          chartConfig={{
            backgroundColor: "#4f46e5",
            backgroundGradientFrom: "#4f46e5",
            backgroundGradientTo: "#7c3aed",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
            labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
          }}
          style={{ borderRadius: 12 }}
          yAxisLabel=""
          yAxisSuffix=""
        />
      </View>

      {/* Recent Reports */}
      <View className="bg-white rounded-2xl shadow-md p-5 mb-10">
        <Text className="font-semibold text-gray-700 mb-4">Recent Reports</Text>
        {reports?.slice(0, 5).map((r) => (
          <TouchableOpacity
            key={r._id}
            className="border-b border-gray-200 pb-3 mb-3 active:opacity-70"
            onPress={() =>
              router.push({
                pathname: "/reports/[reportId]",
                params: { reportId: r._id },
              })
            }
          >
            <Text className="text-indigo-600 font-medium mb-1">
              {r.violationType?.join(", ") || "Unknown Violation"}
            </Text>
            <Text className="text-sm text-gray-600 mb-1">
              {r.issueDescription}
            </Text>
            <Text className="text-xs text-gray-500">
              {new Date(r.submittedAt).toLocaleDateString()} •{" "}
              <Text className="capitalize">{r.status}</Text>
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
