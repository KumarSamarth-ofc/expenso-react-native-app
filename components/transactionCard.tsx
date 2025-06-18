import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

interface TransactionCardProps {
  title: string;
  category: string;
  amount: number;
  createdAt: string;
  id: string; // Appwrite document ID
}

const CATEGORY_COLORS: { [key: string]: string } = {
  Food: "#FF6B6B",
  Transport: "#4ECDC4",
  Entertainment: "#FFD93D",
  Groceries: "#5F27CD",
  Shopping: "#48DBFB",
  Health: "#1DD1A1",
  Utilities: "#FF9F43",
  Miscellaneous: "#A29BFE",
  Uncategorized: "#D3D3D3",
};

const TransactionCard: React.FC<TransactionCardProps> = ({
  title,
  category,
  amount,
  createdAt,
  id,
}) => {
  const router = useRouter();

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const categoryColor = CATEGORY_COLORS[category] || "#ccc";

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/[detail]",
          params: { id }, // pass id in URL
        })
      }
    >
      <View style={styles.card}>
        <View style={styles.left}>
          <View
            style={[styles.indicator, { backgroundColor: categoryColor }]}
          />
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.category}>{category}</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Text style={styles.amount}>- ₹{amount}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    height: 100,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    paddingBottom: 20,
  },
  category: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  right: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E53935",
    paddingBottom: 20,
  },
  date: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});

export default TransactionCard;
