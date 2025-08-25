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
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";

const ReportDetails = () => {
  const { reportId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const formatSubmittedAt = (dateLike: string | number | Date) => {
    const d = new Date(dateLike);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const day = pad(d.getDate());
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  };

  const toSentence = (s: string) => {
    const t = s?.replace(/_/g, " ").toLowerCase() || "";
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
  };

  const formatViolations = (v: string | string[]) => {
    const arr = Array.isArray(v) ? v : v ? [v] : [];
    return arr.map(toSentence).join(", ");
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        const res = await apiRequest.get<{ data: any }>(
          `/report/details/${reportId}`,
          { headers: { Authorization: `Bearer ${token}` } }
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

  const goBackByRole = () => {
    if (user?.role === "NormalUser") {
      router.push("/(tabs)/reports");
    } else if (user?.role === "AdminUser") {
      router.push("/(admin)/reports");
    } else {
      router.back();
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#1E90FF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50 px-6">
        <Text className="text-red-600 text-base mb-3">{error}</Text>
        <TouchableOpacity
          onPress={goBackByRole}
          className="bg-sky-600 px-5 py-3 rounded-2xl shadow-sm active:opacity-90"
        >
          <Text className="text-white font-semibold text-base">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const media: { uri: string; caption: string }[] = [];
  if (report?.imageURL)
    media.push({ uri: report.imageURL, caption: "Original Image" });
  if (report?.annotatedURL)
    media.push({ uri: report.annotatedURL, caption: "AI Annotation" });

  return (
    <View className="flex-1 bg-slate-50">
      {/* Top Bar */}
      <View className="bg-sky-700 px-4 py-3 shadow-lg shadow-sky-900/30 border-b border-sky-600">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={goBackByRole}
            className="h-10 w-10 rounded-full items-center justify-center active:opacity-70 bg-white/20"
            activeOpacity={0.8}
          >
            <FontAwesome name="chevron-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="ml-3 font-montserratBold text-xl text-white tracking-wide">
            Report Details
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
        {/* Report ID */}
        <View className="bg-white rounded-xl px-4 py-3 mb-4 shadow-sm border border-slate-200/60">
          <Text className="text-xs text-slate-500 uppercase tracking-wider">
            Report ID
          </Text>
          <Text className="font-montserratBold text-base text-slate-800 mt-1 select-all">
            {report._id}
          </Text>
        </View>

        {/* Images */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <Text className="font-montserratBold text-xl text-slate-900 mb-2">
            Images
          </Text>
          {media.length === 0 ? (
            <Text className="italic text-slate-500">No images available</Text>
          ) : (
            media.map((m, idx) => (
              <View key={`${m.uri}-${idx}`} className="mb-5">
                <Image
                  source={{ uri: m.uri }}
                  className="w-full h-52 rounded-2xl bg-slate-200"
                  resizeMode="cover"
                />
                <Text className="text-sm text-slate-600 mt-2 text-center">
                  {m.caption}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Status + Stats */}
        <View className="bg-white rounded-2xl p-4 shadow-sm mb-5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <FontAwesome name="flag" size={16} color="#0ea5e9" />
              <Text className="ml-2 font-montserratBold text-lg text-slate-900">
                Status
              </Text>
            </View>
            <Text
              className={`px-3 py-1 rounded-full text-xs font-montserratBold ${
                report.status?.toLowerCase() === "resolved"
                  ? "bg-emerald-100 text-emerald-700"
                  : report.status?.toLowerCase() === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-sky-100 text-sky-700"
              }`}
            >
              {report.status?.toUpperCase()}
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3 mt-4">
            <StatCard
              icon={<FontAwesome name="arrow-up" size={14} color="#0ea5e9" />}
              label="Upvotes"
              value={report.upvotes?.length || 0}
              containerClass="bg-sky-50"
            />
            <StatCard
              icon={<FontAwesome name="arrow-down" size={14} color="#f43f5e" />}
              label="Downvotes"
              value={report.downvotes?.length || 0}
              containerClass="bg-rose-50"
            />
            <StatCard
              icon={<FontAwesome name="star" size={14} color="#8b5cf6" />}
              label="XP"
              value={report.xpAwarded || 0}
              containerClass="bg-violet-50"
            />
          </View>
        </View>

        {/* Accordion sections */}
        <View className="bg-white p-5 rounded-2xl shadow-sm">
          <AccordionItem title="Issue Description" defaultOpen>
            <Text className="text-base text-slate-800 leading-6">
              {report.issueDescription}
            </Text>
          </AccordionItem>
          <AccordionItem title="Violation Type" defaultOpen>
            <Text className="text-base text-slate-800">
              {formatViolations(report.violationType)}
            </Text>
          </AccordionItem>
          <AccordionItem title="Reported By">
            <Text className="text-base text-slate-800">
              {report.reportedBy?.username} ({report.reportedBy?.email})
            </Text>
          </AccordionItem>
          <AccordionItem title="Submitted At">
            <Text className="text-base text-slate-800">
              {report?.submittedAt
                ? formatSubmittedAt(report.submittedAt)
                : "—"}
            </Text>
          </AccordionItem>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportDetails;

/* ---------- Helpers ---------- */
const AccordionItem = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View className="mb-3">
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        className="flex-row items-center justify-between py-3"
        activeOpacity={0.8}
      >
        <Text className="font-montserratBold text-base text-slate-900">
          {title}
        </Text>
        <FontAwesome
          name="chevron-down"
          size={14}
          color="#475569"
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>
      {open && (
        <View className="bg-slate-50 border border-slate-200 rounded-xl p-3">
          {children}
        </View>
      )}
    </View>
  );
};

const StatCard = ({
  icon,
  label,
  value,
  containerClass = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  containerClass?: string;
}) => (
  <View className={`flex-1 rounded-xl px-3 py-3 ${containerClass}`}>
    <View className="flex-row items-center justify-center">
      {icon}
      <Text className="ml-2 text-xs font-semibold text-slate-600">{label}</Text>
    </View>
    <Text className="mt-1.5 text-2xl text-center font-montserratBold text-slate-900">
      {value}
    </Text>
  </View>
);
