import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";

type MapPickerProps = {
  onLocationSelect: (coords: { latitude: number; longitude: number }) => void;
  initialLocation?: { coords: { latitude: number; longitude: number } };
  draggableMarker?: boolean;
};

export default function MapPicker({
  onLocationSelect,
  initialLocation,
  draggableMarker = true,
}: MapPickerProps) {
  const defaultRegion: Region = {
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 10,
    longitudeDelta: 10,
  };

  const [marker, setMarker] = useState(
    initialLocation?.coords || { latitude: 20.5937, longitude: 78.9629 }
  );

  const [region, setRegion] = useState<Region>(
    initialLocation?.coords
      ? { ...initialLocation.coords, latitudeDelta: 0.05, longitudeDelta: 0.05 }
      : defaultRegion
  );

  useEffect(() => {
    if (initialLocation?.coords) {
      setMarker(initialLocation.coords);
      setRegion({
        ...initialLocation.coords,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }
  }, [initialLocation]);

  const handlePress = (coords: { latitude: number; longitude: number }) => {
    setMarker(coords);
    onLocationSelect(coords);
  };

  return (
    <View style={styles.container}>
      <Text>Select Location</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        onPress={(e) => handlePress(e.nativeEvent.coordinate)}
      >
        {marker && (
          <Marker
            coordinate={marker}
            draggable={draggableMarker}
            onDragEnd={(e) => handlePress(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.5,
  },
});
