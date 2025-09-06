import { getBillBoardFeed } from "@/lib/Slices/billBoardSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const { width } = Dimensions.get("window");

export default function Index() {
  const isFocused = useIsFocused();
  const [fontsLoaded] = useFonts({
    Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
  });
  const { user } = useSelector((state: RootState) => state.user);
  const { location } = useSelector((state: RootState) => state.location);

  const steps = [
    {
      title: "Document Evidence",
      desc: "Capture clear photos showing the billboard's violation. Include multiple angles and nearby landmarks for location context.",
      image:
        "https://images.unsplash.com/photo-1683013725711-a778f9a93835?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNvbWVvbmUlMjBjYXB0dXJpbmclMjBhJTIwYmlsbGJvYXJkJTIwd2l0aCUyMGElMjBwaG9uZXxlbnwwfDB8MHx8fDI%3D",
    },
    {
      title: "Location Details",
      desc: "Mark the exact GPS coordinates and add address details. Include information about visibility and traffic impact.",
      image:
        "https://images.unsplash.com/photo-1548345680-f5475ea5df84?q=80&w=1173&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Submit Report",
      desc: "Review all details for accuracy and submit to local authorities. You'll receive a tracking number for follow-up.",
      image:
        "https://images.unsplash.com/photo-1588170975164-67f7a6127d91?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNhZmUlMjBjaXR5JTIwY29ubmVjdGlvbnxlbnwwfDB8MHx8fDI%3D",
    },
  ];

  const progress = useSharedValue<number>(0);
  const ref = React.useRef<ICarouselInstance>(null);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      index,
      animated: true,
    });
  };

  const { status, error, billboards } = useSelector(
    (state: RootState) => state.billboard
  );

  useEffect(() => {
    dispatch(getBillBoardFeed())
      .unwrap()
      .catch((err) => {
        console.error("Error fetching billboards:", err);
      });
  }, [dispatch]);

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
              Kolkata
            </Text>
            <Ionicons name="chevron-down" size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: user?.avatar }}
          className="w-14 h-14 rounded-full border-2 border-primary-main"
        />
      </View>

      {/* Carousel */}
      <View className="px-6 mb-4">
        <Carousel
          ref={ref}
          width={width - 48}
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
                <View className="absolute inset-0 bg-black/60" />
                <Text className="absolute top-3 right-3 text-white text-5xl font-montserratBold">
                  {index + 1}
                </Text>
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
            backgroundColor: "#6C4FE0",
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

      {/* Billboards Section */}
      <View className="px-6 flex-1 mb-10">
        <Text className="text-xl font-montserratBold mb-3 text-text-primary mx-2">
          Nearby Billboard Reports
        </Text>

        {status === "loading" && (
          <ActivityIndicator size="large" color="#6C4FE0" className="mt-5" />
        )}

        {status === "failed" && (
          <Text className="text-red-500 font-montserrat text-center mt-5">
            {error ? String(error) : "Failed to load billboards."}
          </Text>
        )}

        {status === "succeeded" && billboards?.length > 0 && (
          <FlatList
            data={billboards.slice(0, 5)} // limit to 5
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              // <View className="border border-2 border-border flex-row justify-between items-center bg-surface rounded-xl px-3 py-3 mb-4 mx-2 shadow-md shadow-primary-main">
              //   <View className="flex-1 mr-3">
              //     <Text className="font-montserratBold text-text-primary">
              //       Billboard #{item.id.slice(-6)} {/* shorter id */}
              //     </Text>
              //     <Text className="font-montserrat text-text-secondary text-sm">
              //       {item.location?.address || "Unknown Location"}
              //     </Text>
              //     <Text className="font-montserrat text-text-secondary text-xs mt-1">
              //       Confidence:{" "}
              //       <Text className="text-primary-main font-montserratBold">
              //         {item.crowdConfidence
              //           ? `${item.crowdConfidence}%`
              //           : "N/A"}
              //       </Text>
              //     </Text>
              //   </View>

              //   <Image
              //     source={{
              //       uri:
              //         item.imageURL ||
              //         "https://via.placeholder.com/150?text=No+Image",
              //     }}
              //     className="w-16 h-16 rounded-lg border border-border"
              //   />
              //   <TouchableOpacity
              //     onPress={() => {
              //       router.push({
              //         pathname: "/billboards/[billboardId]",
              //         params: { billboardId: item.id },
              //       });
              //     }}
              //   >
              //     <Text className="text-primary-main font-montserratBold">
              //       View Details
              //     </Text>
              //   </TouchableOpacity>
              // </View>
              <View className="mb-4 mx-2">
                <View
                  className="flex-row bg-white rounded-xl border border-border overflow-hidden"
                  style={{
                    shadowColor: "#1A1D23",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.06,
                    shadowRadius: 16,
                    elevation: 4,
                  }}
                >
                  {/* LEFT: Billboard image spanning vertically */}
                  <Image
                    source={{
                      uri:
                        item.imageURL ||
                        "https://via.placeholder.com/200?text=No+Image",
                    }}
                    className="w-32"
                    style={{ height: "100%", resizeMode: "cover" }}
                    accessibilityLabel={`Image for billboard ${item.id.slice(-6)}`}
                  />

                  {/* RIGHT: Text + Button */}
                  <View className="flex-1 px-4 py-3 justify-between">
                    <View>
                      {/* Title */}
                      <Text
                        className="text-base font-montserratBold mb-1"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ color: "#333333" }}
                      >
                        Billboard #{item.id.slice(-6)}
                      </Text>

                      {/* Confidence */}
                      <Text
                        className="text-sm font-montserratBold mb-1"
                        style={{ color: "#4C1D95" }}
                      >
                        {item.location?.address
                          ? item.location.address
                              .split(",")
                              .slice(0, 2)
                              .join(",")
                          : "Unknown Location"}
                      </Text>

                      {/* Location */}
                      <Text className="text-xs font-montserrat text-text-secondary">
                        {item.crowdConfidence != null
                          ? `${item.crowdConfidence}% confidence`
                          : "Confidence: N/A"}
                      </Text>
                    </View>

                    {/* Button at bottom right */}
                    {/* Bottom row with button on right */}
                    <View className="flex-row items-center justify-between mt-3">
                      {/* (Optional) If you want to show something else on left later, keep a View here */}
                      <View />

                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/billboards/[billboardId]",
                            params: { billboardId: item.id },
                          })
                        }
                        activeOpacity={0.8}
                        className="flex-row items-center"
                      >
                        <Text className="font-montserratBold text-[#6C4FE0] text-sm mr-2">
                          See Details
                        </Text>
                        <Ionicons
                          name="arrow-forward-circle-outline"
                          size={20}
                          color="#6C4FE0"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        )}

        {status === "succeeded" && billboards?.length === 0 && (
          <Text className="text-text-secondary text-center font-montserrat mt-5">
            No billboard reports available.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}
