import { registerUser } from "@/lib/Slices/userSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

type FormField = "name" | "username" | "email" | "password" | "role";

const RegisterScreen = () => {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "NormalUser",
  });

  const { status, error } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleChange = (field: FormField, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await dispatch(registerUser(form)).unwrap();
      router.replace("/login");
    } catch (err) {
      // error is already in Redux, but you can log/debug here if needed
      console.log("Registration failed:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {(["name", "username", "email", "password"] as FormField[]).map(
        (field) => (
          <View key={field} style={styles.inputGroup}>
            <Text style={styles.label}>{field.toUpperCase()}</Text>
            <TextInput
              style={[
                styles.input,
                status === "loading" && { backgroundColor: "#f3f4f6" }, // gray out inputs while loading
              ]}
              placeholder={`Enter your ${field}`}
              placeholderTextColor="#aaa"
              secureTextEntry={field === "password"}
              keyboardType={field === "email" ? "email-address" : "default"}
              autoCapitalize="none"
              editable={status !== "loading"}
              value={form[field]}
              onChangeText={(val) => handleChange(field, val)}
            />
          </View>
        )
      )}

      {/* Role Selection */}
      <View style={styles.roleContainer}>
        {["NormalUser", "AdminUser"].map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.roleButton,
              form.role === role && styles.selectedRole,
            ]}
            disabled={status === "loading"}
            onPress={() =>
              handleChange("role", role as "NormalUser" | "AdminUser")
            }
          >
            <Text
              style={[
                styles.roleText,
                form.role === role && styles.selectedRoleText,
              ]}
            >
              {role === "NormalUser" ? "Normal User" : "Admin"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          status === "loading" && { backgroundColor: "#9ca3af" },
        ]}
        disabled={status === "loading"}
        onPress={handleSubmit}
      >
        {status === "loading" ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Register</Text>
        )}
      </TouchableOpacity>

      {/* Error Message */}
      {status === "failed" && error && (
        <Text style={styles.error}>{error}</Text>
      )}

      <TouchableOpacity
        disabled={status === "loading"}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  roleButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#888",
    alignItems: "center",
  },
  selectedRole: { backgroundColor: "#4f46e5", borderColor: "#4f46e5" },
  roleText: { color: "#333", fontWeight: "500" },
  selectedRoleText: { color: "#fff", fontWeight: "700" },
  submitButton: {
    backgroundColor: "#4f46e5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  error: { marginTop: 10, color: "red", textAlign: "center" },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#4f46e5",
    fontWeight: "600",
  },
});
