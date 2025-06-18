// app/dashboard.tsx
import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Appbar, useTheme } from "react-native-paper";
import { useAuth } from "@/lib/auth-context";
import { DATABASE_ID, databases } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import Card from "@/components/card";
import PieChartComponent from "@/components/PieChart";
import RecentTransactions from "@/components/recentTransaction";

const TRANSACTIONS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_TRANSACTIONS_COLLECTIONS_ID!;

export default function Dashboard() {
  const { user } = useAuth();
  const theme = useTheme();

  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchBudgetAndExpenses = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          TRANSACTIONS_COLLECTION_ID,
          [Query.equal("user_id", user.$id)]
        );

        const transactions = response.documents;

        if (transactions.length === 0) return;

        const latestBudgetDoc = transactions.reduce((latest, doc) =>
          new Date(doc.created_at) > new Date(latest.created_at) ? doc : latest
        );

        const total = latestBudgetDoc.budget || 0;
        setTotalBudget(total);

        const totalSpent = transactions.reduce(
          (sum, doc) => sum + (doc.amount || 0),
          0
        );

        setRemainingBudget(total - totalSpent);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetAndExpenses();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <Card title="Total Budget" value={`₹ ${totalBudget}`} />
        <Card title="Remaining Budget" value={`₹ ${remainingBudget}`} />
              <PieChartComponent />
              <RecentTransactions/>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
