import { Feather, Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import React from 'react';
import { StyleSheet, TouchableOpacity } from "react-native";


const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          margin: 10,
          height:50,
          position: "absolute",
          borderRadius:20,
          backgroundColor: "#1e1e1e",
        },
        tabBarActiveTintColor: "#fff", // active icon color white
        tabBarInactiveTintColor: "gray", // inactive icon gray
                tabBarIconStyle:{
            margin: 5
          }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerShown:false,
        }}
      />
      <Tabs.Screen
        name="uploads"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="upload" size={size} color={color} />
          ),
          headerShown:false,
        }}
      />
      <Tabs.Screen
        name="camera-launcher"
        options={{
          title: "Camera",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={'#c8b2daff'} />
          ),
          // Intercept tab press and open /camera
          tabBarButton: ({ onPress, children }) => (
            <TouchableOpacity style={styles.cameraButton} onPress={() => router.push("/camera")}>
              {children}
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          tabBarIcon: ({color,size}) => (
              <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
          headerShown:false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerShown:false,
        }}
      />
    </Tabs>
  )
}

export default _layout

const styles = StyleSheet.create({
  cameraButton: {
    top: -25, // lift the button above tab bar
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#6c3ef4", // purple
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 6, // Android shadow
  },
});

