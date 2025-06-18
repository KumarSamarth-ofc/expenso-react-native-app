// components/transactionDetails.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { databases, DATABASE_ID } from "@/lib/appwrite";

const TRANSACTIONS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_TRANSACTIONS_COLLECTIONS_ID!;

const TransactionDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchTransaction = async () => {
      try {
        const res = await databases.getDocument(
          DATABASE_ID,
          TRANSACTIONS_COLLECTION_ID,
          id as string
        );
        setTransaction(res);
      } catch (err) {
        console.error("Error fetching transaction:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert("Delete", "Are you sure you want to delete this transaction?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await databases.deleteDocument(
              DATABASE_ID,
              TRANSACTIONS_COLLECTION_ID,
              id as string
            );
            router.back();
          } catch (err) {
            console.error("Delete failed:", err);
          }
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  if (!transaction) {
    return <Text style={{ padding: 20 }}>Transaction not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Transaction Details</Text>
      <Text style={styles.label}>
        Title: <Text style={styles.value}>{transaction.title}</Text>
      </Text>
      <Text style={styles.label}>
        Category: <Text style={styles.value}>{transaction.category}</Text>
      </Text>
      <Text style={styles.label}>
        Amount: <Text style={styles.value}>₹{transaction.amount}</Text>
      </Text>
      <Text style={styles.label}>
        Date:{" "}
        <Text style={styles.value}>
          {new Date(transaction.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </Text>
      <Text style={styles.label}>
        Notes:{" "}
        <Text style={styles.value}>
                  { transaction.optional}
        </Text>
      </Text>

      <View style={styles.buttonWrapper}>
        <Button
          title="Delete Transaction"
          onPress={handleDelete}
          color="#E53935"
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
  },
  value: {
    fontWeight: "500",
  },
  buttonWrapper: {
    marginTop: 30,
  },
  backButton: {
    marginTop: 20,
  },
});

export default TransactionDetails;
