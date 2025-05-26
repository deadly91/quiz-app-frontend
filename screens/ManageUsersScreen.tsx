import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NeonScreen from "../components/NeonScreen";

interface User {
  _id: string;
  email: string;
  nickname: string;
  role: string;
  IsBanned: boolean;
  createdAt: string;
}

export default function ManageUsersScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://10.0.2.2:3001/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (userId: string, banned: boolean) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.patch(
        `http://10.0.2.2:3001/api/admin/users/${userId}/ban`,
        { IsBanned: !banned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      Alert.alert("Error", "Failed to update user status");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <NeonScreen showBottomBar>
      <Text style={styles.title}>👥 Manage Users</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.infoBlock}>
              <Text style={styles.nickname}>{item.nickname}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.detail}>Role: {item.role}</Text>
              <Text style={styles.detail}>
                <Text>
                  {" "}
                  Status: {item.IsBanned ? "❌ Banned" : "✅ Active"}{" "}
                </Text>
              </Text>
              <Text style={styles.detail}>
                Joined: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.banButton, item.IsBanned && styles.unbanButton]}
              onPress={() => toggleBan(item._id, item.IsBanned)}
            >
              <Text style={styles.banText}>
                {item.IsBanned ? "Unban" : "Ban"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
      />
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    color: "#00ffcc",
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 20,
  },
  listContent: {
    paddingBottom: 160,
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#00ffcc",
  },
  infoBlock: {
    flexShrink: 1,
    paddingRight: 16,
  },
  nickname: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 2,
  },
  banButton: {
    backgroundColor: "#ff4444",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  unbanButton: {
    backgroundColor: "#00cc66",
  },
  banText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
