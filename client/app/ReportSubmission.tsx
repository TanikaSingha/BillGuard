import { refreshLocation } from "@/lib/Slices/locationSlice";
import {
  resetReport,
  setEstimatedDistance,
  setIssueDescription,
  setUserOverrideVerdict,
  submitReport,
} from "@/lib/Slices/reportSlice";
import apiRequest from "@/lib/utils/apiRequest";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const violationOptions = [
  "size_violation",
  "illegal_location",
  "structural_hazard",
  "missing_license",
  "obscene_content",
  "political_violation",
  "other",
];

const verdictOptions = ["unauthorized", "authorized", "unsure"];

export default function ReportSubmissionDemo() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const decodedImageUrl = imageUrl ? decodeURIComponent(imageUrl) : "";
  const { location } = useSelector((state: RootState) => state.location);
  const {
    exifData,
    issueDescription,
    violationType,
    estimatedDistance,
    userOverrideVerdict,
    submitting,
  } = useSelector((state: RootState) => state.report);

  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<any | null>(null);

  // Run AI Analysis
  const handleAiAnalysis = async () => {
    try {
      setLoadingAi(true);
      setAiError(null);
      const loc = await dispatch(refreshLocation()).unwrap();
      const res = await apiRequest.post("/model/analyze", {
        url: decodedImageUrl,
        location: loc,
        exifData: exifData,
        estimatedDistance: Number(estimatedDistance) || null,
      });

      if (res.data.status === "success") {
        setVerdict(res.data.verdict);
        if (res.data.verdict?.aiAnalysis?.verdict) {
          dispatch(setUserOverrideVerdict(res.data.verdict.aiAnalysis.verdict));
        }
      } else {
        throw new Error("AI analysis failed");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "AI analysis failed");
      Alert.alert("Error", "Failed to analyze hoarding. Try again.");
    } finally {
      setLoadingAi(false);
    }
  };

  // Submit Final Report
  const handleSubmit = async () => {
    try {
      const payload = {
        imageURL: decodedImageUrl,
        annotatedURL: verdict?.annotatedImageUrl || "",
        issueDescription,
        violationType: verdict?.violations || null,
        location: location?.coords
          ? {
              type: "Point",
              coordinates: [
                location.coords.longitude,
                location.coords.latitude,
              ],
            }
          : null,
        suspectedDimensions: verdict?.details
          ? { width: verdict.details.width, height: verdict.details.height }
          : null,
        qrCodeDetected: verdict?.qrCodeDetected || false,
        aiAnalysis: {
          verdict: userOverrideVerdict,
          confidence: verdict?.aiAnalysis?.confidence || 0,
          detectedObjects: verdict?.aiAnalysis?.detectedObjects || [],
        },
      };
      console.log(payload);
      await dispatch(submitReport(payload)).unwrap();
      Alert.alert("Success", "Your report has been submitted successfully!");
      dispatch(resetReport());
      router.push({
        pathname: "/(tabs)/reports",
        params: { fromSubmission: "true" },
      });
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to submit report");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, backgroundColor: "#fff" }}
      showsVerticalScrollIndicator={false}
    >
      {decodedImageUrl ? (
        <Image
          source={{ uri: decodedImageUrl }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 10,
            marginBottom: 20,
          }}
        />
      ) : null}

      {/* 🔹 User Estimated Distance */}
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>
        Estimated Distance (m)
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
        }}
        placeholder="Enter estimated distance"
        keyboardType="numeric"
        value={
          estimatedDistance !== null && estimatedDistance !== undefined
            ? String(estimatedDistance)
            : ""
        }
        onChangeText={(text) => dispatch(setEstimatedDistance(Number(text)))}
      />

      {/* 🔹 AI Analysis Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#FF9500",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 20,
          opacity: loadingAi ? 0.7 : 1,
        }}
        onPress={handleAiAnalysis}
        disabled={loadingAi}
      >
        {loadingAi ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "white", fontWeight: "600" }}>
            Run AI Analysis
          </Text>
        )}
      </TouchableOpacity>

      {/* 🔹 Show AI Verdict */}
      {verdict && (
        <View
          style={{
            padding: 15,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 10,
            marginBottom: 20,
            backgroundColor: "#f9f9f9",
          }}
        >
          <Text style={{ fontWeight: "700", marginBottom: 10 }}>
            AI Verdict
          </Text>

          {verdict.annotatedImageUrl && (
            <Image
              source={{ uri: verdict.annotatedImageUrl }}
              style={{
                width: "100%",
                height: 200,
                borderRadius: 8,
                marginBottom: 10,
              }}
            />
          )}

          <Text>
            📍 Location: {verdict.location.latitude},{" "}
            {verdict.location.longitude}
          </Text>
          <Text>
            📐 Size: {verdict.details.width} x {verdict.details.height}
          </Text>
          <Text>↔️ Angle: {verdict.details.angle}°</Text>

          <Text style={{ marginTop: 10, fontWeight: "600" }}>Violations:</Text>
          {Array.isArray(verdict.violations) &&
            verdict.violations.map((v: string, idx: number) => (
              <Text key={idx} style={{ color: "red" }}>
                • {v}
              </Text>
            ))}

          <Text style={{ marginTop: 10, fontWeight: "600" }}>AI Verdict:</Text>
          <Text>
            Verdict: {verdict.aiAnalysis.verdict} (
            {(verdict.aiAnalysis.confidence * 100).toFixed(1)}%)
          </Text>
          <Text>
            Detected Objects: {verdict.aiAnalysis.detectedObjects.join(", ")}
          </Text>
        </View>
      )}

      {aiError && (
        <Text style={{ color: "red", marginBottom: 10 }}>{aiError}</Text>
      )}

      {/* 🔹 User Custom Verdict */}
      <Text style={{ fontWeight: "600", marginBottom: 5 }}>
        Do you agree with AI’s verdict?
      </Text>
      {verdictOptions.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={{
            padding: 10,
            marginBottom: 5,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: userOverrideVerdict === opt ? "#6c3ef4" : "#ccc",
          }}
          onPress={() =>
            dispatch(
              setUserOverrideVerdict(
                opt as "unauthorized" | "authorized" | "unsure"
              )
            )
          }
        >
          <Text
            style={{ color: userOverrideVerdict === opt ? "#6c3ef4" : "#333" }}
          >
            {opt}
          </Text>
        </TouchableOpacity>
      ))}

      {/* 🔹 Issue Description */}
      <Text style={{ fontWeight: "600", marginBottom: 5, marginTop: 15 }}>
        Issue Description
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
          minHeight: 80,
        }}
        placeholder="Describe the issue"
        multiline
        value={issueDescription}
        onChangeText={(text) => dispatch(setIssueDescription(text))}
      />

      {/* 🔹 Submit Report */}
      <TouchableOpacity
        style={{
          backgroundColor: "#6c3ef4",
          padding: 15,
          borderRadius: 10,
          alignItems: "center",
          marginBottom: 40,
          opacity: submitting ? 0.7 : 1,
        }}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={{ color: "white", fontWeight: "600" }}>
          {submitting ? "Submitting..." : "Submit Report"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
