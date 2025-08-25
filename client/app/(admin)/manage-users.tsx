import apiRequest from "@/lib/utils/apiRequest";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ManageUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [status, setStatus] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Meta
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiRequest.get("/user/all", {
        headers: {
          Authorization: `Bearer ${await SecureStore.getItemAsync("authToken")}`,
        },
        params: { status, search, page, limit: 10 },
      });

      setUsers(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [status, page]);

  const renderUser = ({ item }: { item: any }) => {

    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=6c3ef4&color=fff`;

    return (
      <View
        style={{
          backgroundColor: "#fff",
          padding: 15,
          marginBottom: 12,
          borderRadius: 16,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        {/* Avatar */}
        <Image
          source={{ uri: avatar }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 15,
          }}
        />

        {/* User Info */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "700", fontSize: 16 }}>{item.name}</Text>
          <Text style={{ color: "#555" }}>@{item.username}</Text>
          <Text style={{ color: "#777", fontSize: 13 }}>{item.email}</Text>
          <Text
            style={{
              marginTop: 5,
              fontWeight: "600",
              fontSize: 13,
              color:
                item.status === "active"
                  ? "green"
                  : item.status === "inactive"
                    ? "orange"
                    : "red",
            }}
          >
            {item?.status?.toUpperCase()}
          </Text>
        </View>

        {/* See Details Button */}
        <TouchableOpacity
          onPress={() => router.push(`/users/${item._id}`)}
          style={{
            backgroundColor: "#6c3ef4",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Details</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f8f9fb" }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 15 }}>
        👥 Manage Users
      </Text>

      {/* Search Bar */}
      <TextInput
        placeholder="🔍 Search by name, username, or email"
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={() => {
          setPage(1);
          fetchUsers();
        }}
        style={{
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 12,
          marginBottom: 15,
          borderWidth: 1,
          borderColor: "#ddd",
        }}
      />

      {/* Filters */}
      <View style={{ flexDirection: "row", marginBottom: 15 }}>
        {["all", "active", "inactive", "deleted"].map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => {
              setStatus(s === "all" ? null : s);
              setPage(1);
            }}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 15,
              marginRight: 10,
              borderRadius: 20,
              backgroundColor:
                status === s || (s === "all" && !status) ? "#6c3ef4" : "#eee",
            }}
          >
            <Text
              style={{
                color:
                  status === s || (s === "all" && !status) ? "#fff" : "#333",
                fontWeight: "600",
              }}
            >
              {s.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* User List */}
      {loading ? (
        <ActivityIndicator size="large" color="#6c3ef4" />
      ) : error ? (
        <Text style={{ color: "red" }}>{error}</Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUser}
        />
      )}

      {/* Pagination */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 15,
          gap: 10,
        }}
      >
        <TouchableOpacity
          disabled={page === 1}
          onPress={() => setPage((p) => Math.max(1, p - 1))}
          style={{
            backgroundColor: page === 1 ? "#ccc" : "#6c3ef4",
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white" }}>Prev</Text>
        </TouchableOpacity>
        <Text
          style={{
            alignSelf: "center",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Page {page} / {totalPages}
        </Text>
        <TouchableOpacity
          disabled={page === totalPages}
          onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
          style={{
            backgroundColor: page === totalPages ? "#ccc" : "#6c3ef4",
            paddingVertical: 8,
            paddingHorizontal: 15,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white" }}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ManageUsers;
