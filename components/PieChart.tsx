// components/PieChart.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import PieChart from "react-native-svg-charts/src/pie-chart";


import { Circle, G, Line } from "react-native-svg";
import { useAuth } from "@/lib/auth-context";
import { DATABASE_ID, databases } from "@/lib/appwrite";
import { Query } from "react-native-appwrite";

const TRANSACTIONS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_TRANSACTIONS_COLLECTIONS_ID!;

interface Slice {
  key: string;
  value: number;
  svg: { fill: string };
  arc: { outerRadius: string };
}

const COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFD93D",
  "#5F27CD",
  "#48DBFB",
  "#1DD1A1",
  "#FF9F43",
  "#A29BFE",
  "#00B894",
  "#E17055",
];

const PieChartComponent = () => {
  const { user } = useAuth();
  const [categoryData, setCategoryData] = useState<Slice[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          TRANSACTIONS_COLLECTION_ID,
          [Query.equal("user_id", user.$id)]
        );

        const transactions = res.documents;

        const categoryMap: { [key: string]: number } = {};

        transactions.forEach((doc) => {
          const category = doc.category || "Uncategorized";
          const amount = doc.amount || 0;

          if (!categoryMap[category]) {
            categoryMap[category] = 0;
          }
          categoryMap[category] += amount;
        });

        const chartData = Object.entries(categoryMap).map(
          ([cat, amt], index) => ({
            key: cat,
            value: amt,
            svg: { fill: COLORS[index % COLORS.length] },
            arc: { outerRadius: "100%" },
          })
        );

        setCategoryData(chartData);
        setLabels(Object.keys(categoryMap));
      } catch (err) {
        console.error("Error fetching category pie data", err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spending Overview</Text>
      {categoryData.length === 0 ? (
        <Text>No data to display</Text>
      ) : (
        <PieChart
          style={{ height: 200 }}
          data={categoryData}
          innerRadius={30}
          outerRadius={80}
          labelRadius={110}
        />
      )}
      <View style={styles.legend}>
        {categoryData.map((slice, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View
              style={[styles.colorBox, { backgroundColor: slice.svg.fill }]}
            />
            <Text>{slice.key}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  legend: {
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  colorBox: {
    width: 12,
    height: 12,
    marginRight: 8,
    borderRadius: 2,
  },
});

export default PieChartComponent;
