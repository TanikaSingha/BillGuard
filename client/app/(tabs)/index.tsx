import { RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import React, { useState } from "react";
import { Dimensions, FlatList, Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const { width } = Dimensions.get("window");

export default function Index() {
  const [fontsLoaded] = useFonts({
    "Montserrat": require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold":require("../../assets/fonts/Montserrat-Bold.ttf") 
  });
  const [location, setLocation] = useState("Kolkata");
  const [name, setName] = useState("Tanika");
  const [profilePicURL, setProfilePicURL] = useState(
    "https://i.pravatar.cc/100"
  );
  const {user}=useSelector((state:RootState)=>state.user);

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
  const reports = [
  {
    id: "1",
    title: "Vulgar content",
    icon: "alert-circle", // warning icon
    location: "Park Street, Kolkata",
    distance: "0.3 km",
  },
  {
    id: "2",
    title: "Blocking road view",
    icon: "eye-off", // blocked visibility
    location: "Esplanade, Kolkata",
    distance: "0.8 km",
  },
  {
    id: "3",
    title: "Billboard stand broken",
    icon: "construct", // tools / broken
    location: "Salt Lake, Kolkata",
    distance: "1.2 km",
  },
  {
    id: "4",
    title: "Unauthorized billboard",
    icon: "ban", // prohibition
    location: "Gariahat, Kolkata",
    distance: "2.1 km",
  },
  {
    id: "5",
    title: "Lights not working",
    icon: "bulb", // bulb/light
    location: "New Town, Kolkata",
    distance: "3.4 km",
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

    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-8 mb-4">
        <View>
          <Text className="text-3xl text-text-primary font-montserratBold">
            Hello, {user?.name.split(" ")[0]}!
          </Text>
          <TouchableOpacity className="flex-row items-center mt-1">
            <Text className="text-md mr-1 text-text-secondary font-montserrat">
              {location}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <Image
          source={require("../../assets/images/profile.png")}
          className="w-14 h-14 rounded-full border-2 border-primary-main"
        />
      </View>

      {/* Carousel */}
      <View className="px-6 mb-4">
        <Carousel
          ref={ref}
          width={width-48}
          height={205}
          data={steps}
          loop={true}
          onProgressChange={progress}
          renderItem={({ item, index }) => (
          <View style={{ marginHorizontal: 6 }}>
            <ImageBackground
              source={{ uri: item.image }}
              className="w-full h-full rounded-2xl overflow-hidden border border-2 border-border "
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
                <Text className="text-white text-sm font-montserrat mt-1">
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
            backgroundColor: "#A78BFA",
          }}
          activeDotStyle={{
            borderRadius: 8,
            width: 30,
            height: 10,
            backgroundColor: "#6C4FE0", // purple
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

      {/* Recent Reports Section */}
      <View className="px-6 flex-1 mb-10">
        <Text className="text-xl font-montserratBold mb-3 text-text-primary">
          Reports By Others
        </Text>
        <FlatList
          data={reports}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="border border-2 border-border flex-row justify-between items-center bg-surface rounded-xl px-3 py-3 mb-4 mx-2 shadow-md shadow-primary-main">
              <View className="flex-row items-center">
                <Ionicons
                  name={item.icon as any}
                  size={22}
                  color={"#6C4FE0"}
                  style={{ marginRight: 10 }}
                />
                <View>
                  <Text className="font-montserratBold text-text-primary">
                    {item.title}
                  </Text>
                  <Text className="font-montserrat text-text-secondary text-sm">
                    {item.location}
                  </Text>
                </View>
              </View>
              <Text className="font-montserrat text-text-primary text-sm">
                {item.distance}
              </Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>

  );
}
