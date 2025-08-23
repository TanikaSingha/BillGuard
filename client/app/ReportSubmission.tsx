import { refreshLocation } from "@/lib/Slices/locationSlice";
import { AppDispatch } from "@/store/store";
import { useRouter } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

const violationOptions = [
  "size_violation",
  "illegal_location",
  "structural_hazard",
  "missing_license",
  "obscene_content",
  "political_violation",
  "other",
];

export default function ReportSubmissionDemo() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const imageUrl = searchParams.get("imageUrl");
  const decodedImageUrl = imageUrl ? decodeURIComponent(imageUrl) : "";

  const [issueDescription, setIssueDescription] = useState("");
  const [violationType, setViolationType] = useState(violationOptions[0]);
  const [submitting, setSubmitting] = useState(false);

  // Hardcoded demo location
  const location = {
    latitude: 12.9716,
    longitude: 77.5946,
    address: "Demo Address",
    zoneId: "Z-01",
  };

  const handleSubmit = () => {
    // if (!issueDescription) {
    //   Alert.alert("Error", "Please enter an issue description.");
    //   return;
    // }
    // setSubmitting(true);
    // // Simulate backend submission
    // setTimeout(() => {
    //   setSubmitting(false);
    //   Alert.alert("Success", "Report submitted successfully!");
    //   router.replace("/(tabs)"); // navigate wherever
    // }, 1500);
    // console.log("Demo Report Payload:", {
    //   imageUrl: decodedImageUrl,
    //   issueDescription,
    //   violationType,
    //   location,
    // });
    dispatch(refreshLocation());
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

      <Text style={{ fontWeight: "600", marginBottom: 5 }}>
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
        onChangeText={setIssueDescription}
      />

      <Text style={{ fontWeight: "600", marginBottom: 5 }}>
        Violation Type (Demo)
      </Text>
      <Text
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
          backgroundColor: "#f5f5f5",
        }}
      >
        {violationType}
      </Text>

      <Text style={{ fontWeight: "600", marginBottom: 5 }}>
        Location (Demo)
      </Text>
      <View
        style={{
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          marginBottom: 20,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Text>Latitude: {location.latitude}</Text>
        <Text>Longitude: {location.longitude}</Text>
        <Text>Address: {location.address}</Text>
        <Text>Zone: {location.zoneId}</Text>
      </View>

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
