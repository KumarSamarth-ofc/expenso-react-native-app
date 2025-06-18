// components/Card.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";

interface CardProps {
  title: string;
  value: string;
}

export default function Card({ title, value }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: theme.colors.elevation.level2 }]}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontSize: 16,
    color: "#666",
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 8,
    color: "#333",
  },
});
