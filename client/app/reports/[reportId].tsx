import apiRequest from "@/lib/utils/apiRequest";
import { RootState } from "@/store/store";
import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  const { reportId } = useLocalSearchParams(); // get dynamic param from URL
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // 01 → "01, August 2025 14:07"
  const formatSubmittedAt = (dateLike: string | number | Date) => {
    const d = new Date(dateLike);
    const pad = (n: number) => n.toString().padStart(2, "0");
    const day = pad(d.getDate());
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${day}, ${month} ${year} ${hours}:${minutes}`;
  };

  // "ILLEGAL_POSTER" → "Illegal poster" (sentence case)
  const toSentence = (s: string) => {
    const t = s?.replace(/_/g, " ").toLowerCase() || "";
    return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
  };

  // For arrays or single strings → "A, B, C" in sentence case
  const formatViolations = (v: string | string[]) => {
    const arr = Array.isArray(v) ? v : v ? [v] : [];
    return arr.map(toSentence).join(", ");
  };

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

  // build a vertical list for media with captions
  const media: { uri: string; caption: string }[] = [];
  if (report?.imageURL)
    media.push({ uri: report.imageURL, caption: "Original Image" });
  if (report?.annotatedURL)
    media.push({ uri: report.annotatedURL, caption: "AI Annotation" });

  return (
    <View className="flex-1 bg-background">
      {/* Top bar with back arrow */}
      <View
        className="bg-primary-dark px-4 py-3 shadow-lg shadow-primary-dark/40 border-b border-primary-main/30"
        style={{ zIndex: 20, elevation: 12 }}
      >
        <View className="flex-row items-center">
          {/* Back arrow */}
          <TouchableOpacity
            onPress={goBackByRole}
            className="h-10 w-10 rounded-full items-center justify-center active:opacity-70 bg-white/20"
            activeOpacity={0.8}
          >
            <FontAwesome name="chevron-left" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Title */}
          <Text className="ml-3 font-montserratBold text-xl text-white tracking-widest">
            Report Details
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      >
        {/* Report ID section */}
        <View className="bg-white/80 rounded-xl px-4 py-3 mb-4 shadow-md border border-slate-200/60">
          <Text className="font-montserrat text-xs text-slate-500 uppercase tracking-wider border-b border-border">
            Report ID
          </Text>
          <Text className="font-montserratBold text-base text-slate-800 mt-1 select-all">
            {report._id}
          </Text>
        </View>

        {/* Images column with captions */}
        <View className="bg-white rounded-2xl p-4 shadow-lg mb-4">
          {/* Section title */}
          {/* Section title */}
          <Text className="font-montserratBold text-xl text-slate-900 mb-2 tracking-wide">
            Images
          </Text>
          {media.length === 0 ? (
            <Text className="font-montserrat text-sm text-slate-500 italic">
              No images available
            </Text>
          ) : (
            <View className="space-y-6">
              {media.map((m, idx) => (
                <View key={`${m.uri}-${idx}`} className="w-full">
                  <Image
                    source={{ uri: m.uri }}
                    className="w-full h-52 rounded-2xl bg-slate-200 shadow-sm my-2"
                    resizeMode="cover"
                  />
                  <Text className="font-montserrat text-md text-slate-600 mt-2 text-center">
                    {m.caption}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Status + quick stats (redesigned cards) */}
        <View className="bg-white rounded-2xl p-4 shadow-lg mb-5">
          {/* Status row */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <FontAwesome name="flag" size={16} color="#0ea5e9" />
              <Text className="ml-2 text-lg font-montserratBold tracking-wide text-slate-900">
                Status
              </Text>
            </View>

            <Text
              className={[
                "px-3 py-1 rounded-full text-xs font-montserrat",
                (report.status?.toLowerCase() === "resolved" &&
                  "bg-emerald-100 text-emerald-700") ||
                  (report.status?.toLowerCase() === "pending" &&
                    "bg-amber-100 text-amber-700") ||
                  "bg-sky-100 text-sky-700",
              ].join(" ")}
            >
              {report.status?.toUpperCase()}
            </Text>
          </View>

          <View className="h-px bg-slate-100 my-4" />

          {/* Stat cards */}
          <View className="flex-row gap-3">
            <StatCard
              icon={<FontAwesome name="arrow-up" size={14} color="#0ea5e9" />}
              label="Upvotes"
              value={report.upvotes?.length || 0}
              containerClass="bg-sky-50"
              valueClass="text-slate-900"
            />
            <StatCard
              icon={<FontAwesome name="arrow-down" size={14} color="#f43f5e" />}
              label="Downvotes"
              value={report.downvotes?.length || 0}
              containerClass="bg-rose-50"
              valueClass="text-slate-900"
            />
            <StatCard
              icon={<FontAwesome name="star" size={14} color="#8b5cf6" />}
              label="XP"
              value={report.xpAwarded}
              containerClass="bg-violet-50"
              valueClass="text-slate-900"
            />
          </View>
        </View>

        {/* Main Info */}
        <View className="bg-white p-5 rounded-2xl shadow-lg">
          <AccordionItem title="Issue Description" defaultOpen>
            <Text className="font-montserrat text-base text-slate-800 leading-6">
              {report.issueDescription}
            </Text>
          </AccordionItem>

          <AccordionItem title="Violation Type" defaultOpen>
            <Text className="font-montserrat text-base text-slate-800 leading-6">
              {formatViolations(report.violationType) || "—"}
            </Text>
          </AccordionItem>

          <AccordionItem title="Reported By">
            <Text className="font-montserrat text-base text-slate-800">
              {report.reportedBy?.username} ({report.reportedBy?.email})
            </Text>
          </AccordionItem>

          <AccordionItem title="Submitted At">
            <Text className="font-montserrat text-base text-slate-800">
              {report?.submittedAt
                ? formatSubmittedAt(report.submittedAt)
                : "—"}
            </Text>
          </AccordionItem>

          <AccordionItem title="Location">
            <View>
              <Text className="font-montserrat text-base text-slate-800">
                {report.location?.address || "N/A"}
              </Text>
              {!!report.location?.coordinates?.length && (
                <View className="flex-row items-center mt-1">
                  <FontAwesome name="map-marker" size={14} color="#334155" />
                  <Text className="font-montserrat ml-2 text-sm text-slate-600">
                    {report.location?.coordinates?.join(", ")}
                  </Text>
                </View>
              )}
            </View>
          </AccordionItem>

          <AccordionItem title="Suspected Dimensions">
            <Text className="font-montserrat text-base text-slate-800">
              Height: {report.suspectedDimensions?.height} | Width:{" "}
              {report.suspectedDimensions?.width}
            </Text>
          </AccordionItem>

          <AccordionItem title="QR Code Detected">
            <Text className="font-montserrat text-base text-slate-800">
              {report.qrCodeDetected ? "Yes" : "No"}
            </Text>
          </AccordionItem>

          <AccordionItem title="AI Analysis" defaultOpen>
            {/* Verdict row with icon */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <FontAwesome
                  name={
                    report.aiAnalysis?.verdict?.toLowerCase() === "violation"
                      ? "exclamation-circle"
                      : "check-circle"
                  }
                  size={18}
                  color={
                    report.aiAnalysis?.verdict?.toLowerCase() === "violation"
                      ? "#ef4444"
                      : "#10b981"
                  }
                />
                <Text className="ml-2 font-montserratBold text-base text-slate-900">
                  {report.aiAnalysis?.verdict || "N/A"}
                </Text>
              </View>
            </View>

            {/* Confidence gradient bar */}
            <View className="mb-4">
              <Text className="font-montserrat text-xs text-slate-500 uppercase tracking-wider mb-1">
                Confidence
              </Text>
              <View className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                <LinearGradient
                  colors={["#38bdf8", "#8b5cf6"]} // sky → violet
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(0, (report.aiAnalysis?.confidence ?? 0) * 100)
                    )}%`,
                    height: "100%",
                    borderRadius: 999,
                  }}
                />
              </View>
              <Text className="font-montserrat text-sm text-slate-700 mt-1">
                {((report.aiAnalysis?.confidence ?? 0) * 100).toFixed(2)}%
              </Text>
            </View>

            {/* Detected objects (subtle chips for readability) */}
            <View className="mt-1">
              <Text className="font-montserrat text-xs text-slate-500 uppercase tracking-wider mb-1">
                Detected Objects
              </Text>
              {Array.isArray(report.aiAnalysis?.detectedObjects) &&
              report.aiAnalysis.detectedObjects.length > 0 ? (
                <View className="flex-row flex-wrap gap-2">
                  {report.aiAnalysis.detectedObjects.map(
                    (obj: string, i: number) => (
                      <View
                        key={`${obj}-${i}`}
                        className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200"
                      >
                        <Text className="font-montserrat text-xs text-slate-700">
                          {toSentence(obj)}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              ) : (
                <Text className="font-montserrat text-base text-slate-800">
                  —
                </Text>
              )}
            </View>
          </AccordionItem>
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportDetails;

/** ---------- tiny presentational helpers (no logic change) ---------- */
const Label = ({ text }: { text: string }) => (
  <Text className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1.5">
    {text}
  </Text>
);

const Divider = () => <View className="h-px bg-slate-100 my-4" />;

const Row = ({ label, value }: { label: string; value: any }) => (
  <View className="mt-2">
    <Text className="text-sm font-semibold text-slate-600">{label}</Text>
    <Text className="text-base text-slate-800 mt-0.5">{value || "—"}</Text>
  </View>
);

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

      <View className="h-px bg-slate-100 mt-3" />
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <View className="mb-2.5">
    <Text className="font-montserrat text-xs text-slate-500 uppercase tracking-wider">
      {label}
    </Text>
    <Text className="font-montserrat text-base text-slate-800 mt-0.5">
      {value || "—"}
    </Text>
  </View>
);

const StatCard = ({
  icon,
  label,
  value,
  containerClass = "",
  valueClass = "",
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  containerClass?: string;
  valueClass?: string;
}) => (
  <View className={`flex-1 rounded-xl px-3 py-3 ${containerClass}`}>
    <View className="flex-row items-center justify-center">
      {icon}
      <Text className="ml-2 text-xs font-semibold text-slate-600 font-montserrat">
        {label}
      </Text>
    </View>
    <Text
      className={`mt-1.5 text-2xl text-center  font-montserratBold ${valueClass}`}
    >
      {value}
    </Text>
  </View>
);
