import { getReportsByUser } from "@/lib/Slices/reportSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Picker } from "@react-native-picker/picker";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const Reports = () => {
  const dispatch = useDispatch<AppDispatch>();
  const route = useRoute<any>();
  const router = useRouter();
  const { reports, status } = useSelector((state: RootState) => state.report);

  const [filters, setFilters] = useState({
    status: "",
    violationType: "",
    verdict: "",
    page: 1,
    limit: 10,
  });

  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  // Fetch reports
  const fetchReports = async () => {
    const data: any = await dispatch(
      getReportsByUser({
        status: filters.status,
        violationType: filters.violationType,
        verdict: filters.verdict,
        page: filters.page,
        limit: filters.limit,
      })
    ).unwrap();

    if (route.params?.fromSubmission) {
      setShowRecent(true);
      const sortedReports = data.data
        .slice()
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setRecentReports(sortedReports.slice(0, 1)); // Only most recent report
    } else {
      setShowRecent(false);
      setRecentReports([]);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters, route.params?.fromSubmission]);

  // Reset recent reports when leaving the page
  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowRecent(false);
        setRecentReports([]);
      };
    }, [])
  );

  const renderReportItem = ({ item }: { item: any }) => (
    <View style={styles.reportCard}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/(tabs)/reports/[reportId]",
            params: { reportId: item._id },
          })
        }
      >
        <Text>See Details!</Text>
      </TouchableOpacity>
      <Text style={styles.reportTitle}>
        {item.violationType.join(", ")} - {item.status.toUpperCase()}
      </Text>
      <View style={styles.imageRow}>
        {item.imageURL && (
          <Image source={{ uri: item.imageURL }} style={styles.reportImage} />
        )}
        {item.annotatedURL && (
          <Image
            source={{ uri: item.annotatedURL }}
            style={styles.reportImage}
          />
        )}
      </View>
      <Text style={styles.reportText}>
        <Text style={styles.bold}>Verdict:</Text>{" "}
        {item.aiAnalysis?.verdict || "N/A"}
      </Text>
      <Text style={styles.reportText}>
        <Text style={styles.bold}>Location:</Text>{" "}
        {item.location?.coordinates.join(", ") || "N/A"}
      </Text>
      <Text style={styles.reportText}>
        <Text style={styles.bold}>Submitted on:</Text>{" "}
        {new Date(item.submittedAt).toLocaleString()}
      </Text>
    </View>
  );

  if (status === "loading") {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filters:</Text>
        <Picker
          selectedValue={filters.status}
          onValueChange={(val) => setFilters({ ...filters, status: val })}
          style={styles.picker}
        >
          <Picker.Item label="All Status" value="" />
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Resolved" value="resolved" />
          <Picker.Item label="Rejected" value="rejected" />
        </Picker>
        <Picker
          selectedValue={filters.violationType}
          onValueChange={(val) =>
            setFilters({ ...filters, violationType: val })
          }
          style={styles.picker}
        >
          <Picker.Item label="All Violation Types" value="" />
          <Picker.Item label="Size Violation" value="size_violation" />
          <Picker.Item label="Unauthorized" value="unauthorized" />
          <Picker.Item label="Other" value="other" />
        </Picker>
        <Picker
          selectedValue={filters.verdict}
          onValueChange={(val) => setFilters({ ...filters, verdict: val })}
          style={styles.picker}
        >
          <Picker.Item label="All Verdicts" value="" />
          <Picker.Item label="Authorized" value="authorized" />
          <Picker.Item label="Unauthorized" value="unauthorized" />
          <Picker.Item label="Unsure" value="unsure" />
        </Picker>
      </View>

      {/* Recently Submitted */}
      {showRecent && recentReports.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recently Submitted</Text>
          <FlatList
            data={recentReports}
            renderItem={renderReportItem}
            keyExtractor={(item) => item._id}
          />
        </>
      )}

      {/* Report History */}
      <Text style={styles.sectionTitle}>Report History</Text>
      {reports.length === 0 ? (
        <Text style={styles.emptyText}>No reports found.</Text>
      ) : (
        <FlatList
          data={reports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  filterContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  filterTitle: {
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 16,
    color: "#333",
  },
  picker: { marginBottom: 10 },
  sectionTitle: {
    fontWeight: "700",
    fontSize: 18,
    marginVertical: 12,
    color: "#1E90FF",
  },
  reportCard: {
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  reportTitle: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  imageRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  reportImage: { width: "48%", height: 180, borderRadius: 10 },
  reportText: { fontSize: 14, marginBottom: 4, color: "#555" },
  bold: { fontWeight: "600", color: "#333" },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#999",
    fontSize: 14,
  },
});
