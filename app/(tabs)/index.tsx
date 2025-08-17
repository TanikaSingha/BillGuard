import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import React, { useState } from "react";

import { Dimensions, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

export default function Index() {
  const [fontsLoaded] = useFonts({
    "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold":require("../../assets/fonts/Montserrat-Bold.ttf") // adjust path
  });
  const [location, setLocation] = useState("Kolkata");
  const [name, setName] = useState("Tanika");
  const [profilePicURL, setProfilePicURL] = useState(
    "https://i.pravatar.cc/100"
  );

  const steps = [
    {
      title: "Document Evidence",
      desc: "Capture clear photos showing the billboard's violation. Include multiple angles and nearby landmarks for location context.",
      image: "https://images.unsplash.com/photo-1683013725711-a778f9a93835?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNvbWVvbmUlMjBjYXB0dXJpbmclMjBhJTIwYmlsbGJvYXJkJTIwd2l0aCUyMGElMjBwaG9uZXxlbnwwfDB8MHx8fDI%3D",
    },
    {
      title: "Location Details",
      desc: "Mark the exact GPS coordinates and add address details. Include information about visibility and traffic impact.",
      image: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Submit Report",
      desc: "Review all details for accuracy and submit to local authorities. You'll receive a tracking number for follow-up.",
      image: "https://images.unsplash.com/photo-1588170975164-67f7a6127d91?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhZmUlMjBjaXR5JTIwY29ubmVjdGlvbnxlbnwwfDB8MHx8fDI%3D",
    },
  ];

  const progress = useSharedValue<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);

  const onPressPagination = (index: number) => {
  ref.current?.scrollTo({
    index,
    animated: true,
  });
};


  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-8 py-8">
        <View>
          <Text className="text-3xl text-black font-montserratBold">
            Hello, {name}!
          </Text>
          <TouchableOpacity className="flex-row items-center mt-1">
            <Text className="text-md mr-1 text-gray-500 font-montserrat">
              {location}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#666666ff" />
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: profilePicURL }}
          className="w-14 h-14 rounded-full border-2 border-purple-500"
        />
      </View>

      {/* Carousel */}
      <View className="px-6 mb-6 gap-2">
        <Carousel
          ref={ref}
          width={width-48}
          height={220}
          data={steps}
          loop={true}
          onProgressChange={progress}
          renderItem={({ item, index }) => (
          <View style={{ marginHorizontal: 6 }}>
            <ImageBackground
              source={{ uri: item.image }}
              className="w-full h-full rounded-2xl overflow-hidden"
              resizeMode="cover"
            >
              {/* Overlay to make text readable */}
              <View className="absolute inset-0 bg-black/60" />

              {/* Top-right number */}
              <Text className="absolute top-3 right-3 text-white text-5xl font-montserratBold">
                {index + 1}
              </Text>

              {/* Bottom content */}
              <View className="absolute bottom-4 left-4 right-4">
                <Text className="text-white text-xl font-montserratBold">
                  {item.title}
                </Text>
                <Text className="text-gray-200 text-sm font-montserrat mt-1">
                  {item.desc}
                </Text>
              </View>
            </ImageBackground>
            </View>
          )}
        />




        {/* Pagination */}
        <Pagination.Custom
          progress={progress}
          data={steps}
          size={10}
          dotStyle={{
            borderRadius: 16,
            backgroundColor: "#ccc",
          }}
          activeDotStyle={{
            borderRadius: 8,
            width: 30,
            height: 10,
            backgroundColor: "#6D28D9", // purple
          }}
          containerStyle={{
            gap: 6,
            marginTop: 10,
            alignItems: "center",
            height: 20,
          }}
          horizontal
          onPress={onPressPagination}
          customReanimatedStyle={(progress, index, length) => {
            let val = Math.abs(progress - index);
            if (index === 0 && progress > length - 1) {
              val = Math.abs(progress - length);
            }
            return {
              transform: [
                {
                  scale: val < 0.5 ? 1.2 : 1,
                },
              ],
            };
          }}
        />
      </View>
    </View>
  );
}
