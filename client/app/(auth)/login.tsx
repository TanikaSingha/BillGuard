import { loginUser } from "@/lib/Slices/userSlice";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { user, status, error } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.username || !form.password) return; // guard clause
    dispatch(loginUser(form));
  };

  // redirect if user is logged in
  useEffect(() => {
    if (status === "succeeded" && user) {
      router.replace("/(tabs)"); // go to main app
    }
  }, [status, user, router]);

  return (
    <View className="flex-1 items-center justify-center bg-slate-900 p-4">
      <View className="w-full max-w-md bg-slate-800 p-8 rounded-2xl shadow-lg space-y-4">
        <Text className="text-2xl font-bold mb-6 text-center text-white">
          Login to BillGuard
        </Text>

        {/* Username */}
        <View className="space-y-1">
          <Text className="text-gray-300 text-base font-medium">Username</Text>
          <TextInput
            value={form.username}
            onChangeText={(text) => handleChange("username", text)}
            placeholder="Enter username"
            placeholderTextColor="#9CA3AF"
            className="px-3 py-2 border border-gray-600 bg-slate-700 text-white rounded-md"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View className="space-y-1">
          <Text className="text-gray-300 text-base font-medium">Password</Text>
          <TextInput
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
            placeholder="Enter password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="px-3 py-2 border border-gray-600 bg-slate-700 text-white rounded-md"
          />
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={status === "loading"}
          className={`mt-4 py-3 rounded-2xl shadow-md ${
            status === "loading"
              ? "bg-gray-600"
              : "bg-teal-700 active:bg-teal-800"
          }`}
        >
          {status === "loading" ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-white font-semibold tracking-widest">
              Login
            </Text>
          )}
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-sm text-gray-400">New to BillGuard?</Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text className="ml-2 text-blue-400 font-medium">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>

        {/* Error */}
        {status === "failed" && error && (
          <Text className="mt-4 text-red-400 text-center font-medium">
            {error}
          </Text>
        )}
      </View>
    </View>
  );
}
