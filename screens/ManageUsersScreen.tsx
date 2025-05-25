import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
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
  isBanned: boolean;
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
        `http://10.0.2.2:3001/admin/users/${userId}/ban`,
        { isBanned: !banned },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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
    <NeonScreen showBottomBar disableScroll>
      <Text style={styles.title}>👥 Manage Users</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#00ffcc" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.nickname}>{item.nickname}</Text>
              <Text style={styles.email}>{item.email}</Text>
              <Text style={styles.status}>
                Status: {item.isBanned ? "Banned" : "Active"}
              </Text>
              <TouchableOpacity
                style={styles.banButton}
                onPress={() => toggleBan(item._id, item.isBanned)}
              >
                <Text style={styles.banText}>
                  {item.isBanned ? "Unban" : "Ban"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </NeonScreen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#00ffcc",
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 16,
  },
  card: {
    backgroundColor: "#1a1a2e",
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
  },
  nickname: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "#ccc",
  },
  status: {
    fontSize: 14,
    color: "#00ffcc",
    marginVertical: 8,
  },
  banButton: {
    backgroundColor: "#ff4444",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  banText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
