import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import { useAuth } from "@/lib/auth-context";
import { databases, DATABASE_ID } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";
import TransactionCard from "./transactionCard";

const TRANSACTIONS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_TRANSACTIONS_COLLECTIONS_ID!;

const RecentTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          TRANSACTIONS_COLLECTION_ID,
          [
            Query.equal("user_id", user.$id),
            Query.orderDesc("$createdAt"),
            Query.limit(10),
          ]
        );
        setTransactions(res.documents);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };

    fetchTransactions();
  }, [user]);

  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Recent Transactions
      </Text>
      <ScrollView style={{ marginBottom: 25 }}>
        {transactions.map((txn) => (
          <TransactionCard
            key={txn.$id}
            id={txn.$id}
            title={txn.title}
            category={txn.category || "Uncategorized"}
            amount={txn.amount}
            createdAt={txn.created_at}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default RecentTransactions;
