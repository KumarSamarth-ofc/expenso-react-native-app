import { DATABASE_ID, databases } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import {
  Appbar,
  Button,
  Menu,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

const CATEGORIES = [
  "Books",
  "Business",
  "Cafes",
  "Car Insurance",
  "Car Maintenance",
  "Charity",
  "Clothing",
  "Concerts",
  "Courses",
  "Credit Card",
  "Doctor",
  "Education",
  "Electricity",
  "Emergency",
  "Entertainment",
  "Events",
  "Flights",
  "Food",
  "Freelance Costs",
  "Fuel",
  "Games",
  "Gas",
  "Gifts",
  "Gifts & Donations",
  "Groceries",
  "Gym",
  "Health",
  "Health Insurance",
  "Home Insurance",
  "Home Maintenance",
  "Hotels",
  "Internet",
  "Investments",
  "Loan Payments",
  "Luggage",
  "Medicines",
  "Miscellaneous",
  "Mobile Phone",
  "Mortgage",
  "Movies",
  "Office Supplies",
  "Parking",
  "Personal",
  "Pet Food",
  "Pet Insurance",
  "Pets",
  "Pharmacy",
  "Public Transport",
  "Rent",
  "Restaurants",
  "Salon",
  "Savings",
  "School Fees",
  "Shoes",
  "Snacks",
  "Software Tools",
  "Special Occasions",
  "Stationery",
  "Stocks",
  "Streaming Services",
  "Subscriptions",
  "Taxi/Rideshare",
  "Taxes",
  "Therapy",
  "Tours",
  "Transport",
  "Uncategorized",
  "Utilities",
  "Vet",
  "Visa/Passport",
  "Water",
  "Work Expenses",
] as const;
type CategoryOption = (typeof CATEGORIES)[number];

const TRANSACTIONS_COLLECTION_ID =
  process.env.EXPO_PUBLIC_TRANSACTIONS_COLLECTIONS_ID!;

export default function AddTransaction() {
    const [title, setTitle] = useState<string>("");

  const [category, setCategory] = useState<CategoryOption>("Food");
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [budget, setBudget] = useState<string>("");
  const [budgetLocked, setBudgetLocked] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string>("");

  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  // 🔍 On mount, fetch the user's latest transaction to get total budget
  useEffect(() => {
    if (!user) return;

    const fetchBudget = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          TRANSACTIONS_COLLECTION_ID,
          [
            Query.equal("user_id", user.$id),
            Query.orderDesc("$createdAt"),
            Query.limit(1),
          ]
        );

        if (res.documents.length > 0) {
          const latest = res.documents[0];
          if (latest.budget) {
            setBudget(String(latest.budget));
            setBudgetLocked(true);
            setDocumentId(latest.$id);
          }
        }
      } catch (err) {
        console.log("Error fetching budget:", err);
      }
    };

    fetchBudget();
  }, [user]);

  const handleBudgetChange = (newBudget: string) => {
    if (budgetLocked && newBudget !== budget) {
      Alert.alert(
        "Update Budget?",
        "Your total budget is already set. Do you want to update it?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setBudget(budget),
          },
          {
            text: "Update",
            onPress: () => {
              setBudget(newBudget);
              updateBudgetInDatabase(newBudget);
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      setBudget(newBudget);
    }
  };

  const updateBudgetInDatabase = async (newBudget: string) => {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        TRANSACTIONS_COLLECTION_ID,
        documentId,
        { budget: parseInt(newBudget) }
      );
    } catch (err) {
      console.log("Error updating budget:", err);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    const numericAmount = parseInt(amount);
    const numericBudget = parseInt(budget);

    if (isNaN(numericAmount) || isNaN(numericBudget)) {
      setError("Amount and Budget must be valid numbers");
      return;
    }

    try {
      await databases.createDocument(
        DATABASE_ID,
        TRANSACTIONS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          category,
          title,
          amount: numericAmount,
          budget: numericBudget,
          optional: note,
          created_at: new Date().toISOString(),
        }
      );

      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TextInput
          label="Total Budget"
          mode="outlined"
          value={budget}
          onChangeText={handleBudgetChange}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Transaction Title"
          mode="outlined"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <Menu
          visible={categoryMenuVisible}
          onDismiss={() => setCategoryMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setCategoryMenuVisible(true)}
              style={styles.dropdown}
            >
              {category}
            </Button>
          }
        >
          {CATEGORIES.map((cat) => (
            <Menu.Item
              key={cat}
              onPress={() => {
                setCategory(cat);
                setCategoryMenuVisible(false);
              }}
              title={cat}
            />
          ))}
        </Menu>

        <TextInput
          label="Amount"
          mode="outlined"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
          style={styles.input}
        />

        <TextInput
          label="Note (optional)"
          mode="outlined"
          value={note}
          onChangeText={setNote}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!amount || isNaN(parseInt(amount)) || !budget}
        >
          Add Transaction
        </Button>

        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    gap: 16,
  },
  input: {
    marginBottom: 8,
  },
  dropdown: {
    marginBottom: 16,
  },
});
