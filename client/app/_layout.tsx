import { Slot } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "../store/store";
import "./global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Slot></Slot>
      </SafeAreaProvider>
    </Provider>
  );
}
