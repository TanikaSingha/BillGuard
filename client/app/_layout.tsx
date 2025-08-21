import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeProvider from "./context/ThemeContext";
import './global.css';

export default function RootLayout() {
  return (
    <ThemeProvider>
    <SafeAreaView style={{flex:1,backgroundColor:"#fff"}} edges={["top","bottom"]}>
      <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false, // hides the title bar for (tabs)
        }}
      />
      <Stack.Screen
        name="(modals)"
        options={{
          headerShown: false, // hides the title bar for (tabs)
        }}
      />
      <Stack.Screen
        name="camera"            // <-- app/camera.tsx
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
    </SafeAreaView>
    </ThemeProvider>
    
  );
}
