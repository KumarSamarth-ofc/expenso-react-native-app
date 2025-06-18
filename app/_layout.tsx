import { Stack } from "expo-router";
import {
  Provider as PaperProvider,
  Appbar,
  Menu,
  useTheme,
} from "react-native-paper";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "expo-router";

// ✅ Header component with 3-dot menu
function DashboardHeaderRight() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();
  const theme = useTheme();

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogout = async () => {
    closeMenu();
    await signOut();
    router.replace("/");
  };

  const handleAddTransaction = () => {
    closeMenu();
    
    console.log("Navigate to Add Transaction screen");
  };

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <Appbar.Action
          icon="dots-vertical"
          color="black"// ensures visibility based on theme
          onPress={openMenu}
        />
      }
    >
      <Menu.Item onPress={handleAddTransaction} title="Add Transaction" />
      <Menu.Item onPress={handleLogout} title="Logout" />
    </Menu>
  );
}

// ✅ RootLayout wrapping AuthProvider and PaperProvider
export default function RootLayout() {
  return (
    <PaperProvider>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ title: "Expenso" }} />
          <Stack.Screen
            name="dashboard"
            options={{
              title: "Dashboard",
              headerRight: () => <DashboardHeaderRight />,
            }}
          />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
