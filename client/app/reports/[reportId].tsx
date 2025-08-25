import apiRequest from "@/lib/utils/apiRequest";
import { RootState } from "@/store/store";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const ReportDetails = () => {
  const { reportId } = useLocalSearchParams(); // get dynamic param from URL
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await apiRequest.get<{ data: any }>(
          `/report/details/${reportId}`,
          {
            headers: {
              Authorization: `Bearer ${await SecureStore.getItemAsync("token")}`,
            },
          }
        );

        if (!res) throw new Error("Failed to fetch report");
        setReport(res.data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Images */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.imageScroll}
      >
        {report.imageURL && (
          <Image source={{ uri: report.imageURL }} style={styles.image} />
        )}
        {report.annotatedURL && (
          <Image source={{ uri: report.annotatedURL }} style={styles.image} />
        )}
      </ScrollView>

      {/* Main Info */}
      <View style={styles.card}>
        <Text style={styles.title}>Report Details</Text>

        <Text style={styles.label}>Report ID:</Text>
        <Text style={styles.value}>{report._id}</Text>

        <Text style={styles.label}>Issue Description:</Text>
        <Text style={styles.value}>{report.issueDescription}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{report.status.toUpperCase()}</Text>

        <Text style={styles.label}>Violation Type:</Text>
        <Text style={styles.value}>{report.violationType.join(", ")}</Text>

        <Text style={styles.label}>Reported By:</Text>
        <Text style={styles.value}>
          {report.reportedBy?.username} ({report.reportedBy?.email})
        </Text>

        <Text style={styles.label}>Submitted At:</Text>
        <Text style={styles.value}>
          {new Date(report.submittedAt).toLocaleString()}
        </Text>

        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>
          {report.location?.address || "N/A"} (
          {report.location?.coordinates.join(", ")})
        </Text>

        <Text style={styles.label}>Suspected Dimensions:</Text>
        <Text style={styles.value}>
          Height: {report.suspectedDimensions?.height} | Width:{" "}
          {report.suspectedDimensions?.width}
        </Text>

        <Text style={styles.label}>QR Code Detected:</Text>
        <Text style={styles.value}>{report.qrCodeDetected ? "Yes" : "No"}</Text>

        <Text style={styles.label}>AI Analysis:</Text>
        <Text style={styles.value}>
          Verdict: {report.aiAnalysis?.verdict || "N/A"}
        </Text>
        <Text style={styles.value}>
          Confidence: {(report.aiAnalysis?.confidence * 100).toFixed(2)}%
        </Text>
        <Text style={styles.value}>
          Detected Objects: {report.aiAnalysis?.detectedObjects.join(", ")}
        </Text>
        <FontAwesome name="arrow-up" size={16} color="#1E90FF" />
        <Text style={styles.label}>Upvotes:</Text>
        <Text style={styles.value}>{report.upvotes?.length || 0}</Text>

        <Text style={styles.label}>Downvotes:</Text>
        <Text style={styles.value}>{report.downvotes?.length || 0}</Text>
        <FontAwesome name="arrow-down" size={16} color="#FF6347" />

        <Text style={styles.label}>XP Awarded:</Text>
        <Text style={styles.value}>{report.xpAwarded}</Text>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (user?.role === "NormalUser") {
            router.push("/(tabs)/reports");
          } else if (user?.role === "AdminUser") {
            router.push("/(admin)/reports");
          }
        }}
        style={styles.backBtn}
      >
        <Text style={styles.backBtnText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReportDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f4f8", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", fontSize: 16, marginBottom: 10 },
  backBtn: {
    backgroundColor: "#1E90FF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  backBtnText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  imageScroll: { marginBottom: 16 },
  image: { width: 300, height: 200, borderRadius: 12, marginRight: 12 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1E90FF",
  },
  label: { fontSize: 14, fontWeight: "600", color: "#555", marginTop: 8 },
  value: { fontSize: 15, color: "#333", marginTop: 2 },
});
