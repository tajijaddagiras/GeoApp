import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/Card';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

interface PetaInteraktifScreenProps {
  navigation: any;
  route?: any;
}

interface LocationMarker {
  id: string;
  title: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: 'city' | 'landmark' | 'educational';
}

const markers: LocationMarker[] = [
  {
    id: '1',
    title: 'Pekanbaru',
    description: 'Ibukota Provinsi Riau - Pusat pertumbuhan ekonomi',
    coordinate: { latitude: 0.5071, longitude: 101.4478 },
    type: 'city',
  },
  {
    id: '2',
    title: 'MAN 1 Pekanbaru',
    description: 'Madrasah Aliyah Negeri 1 Pekanbaru',
    coordinate: { latitude: 0.5333, longitude: 101.4500 },
    type: 'educational',
  },
  {
    id: '3',
    title: 'Sungai Siak',
    description: 'Sungai terdalam di Indonesia (300 km)',
    coordinate: { latitude: 0.5200, longitude: 101.4400 },
    type: 'landmark',
  },
  {
    id: '4',
    title: 'Lahan Gambut Riau',
    description: 'Area gambut seluas 4 juta hektar',
    coordinate: { latitude: 0.2500, longitude: 101.7000 },
    type: 'landmark',
  },
  {
    id: '5',
    title: 'Taman Nasional Tesso Nilo',
    description: 'Kawasan konservasi hutan dataran rendah',
    coordinate: { latitude: 0.1000, longitude: 101.6000 },
    type: 'landmark',
  },
];

export const PetaInteraktifScreen: React.FC<PetaInteraktifScreenProps> = ({ navigation, route }) => {
  const [selectedMarker, setSelectedMarker] = useState<LocationMarker | null>(null);
  const [region, setRegion] = useState({
    latitude: 0.5071,
    longitude: 101.4478,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  });

  const handleMarkerPress = (marker: LocationMarker) => {
    setSelectedMarker(marker);
    setRegion({
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      latitudeDelta: 0.3,
      longitudeDelta: 0.3,
    });
  };

  const getMarkerColor = (type: string): string => {
    switch (type) {
      case 'city':
        return '#FF6B6B';
      case 'educational':
        return '#4ECDC4';
      case 'landmark':
        return '#FFD93D';
      default:
        return '#95E1D3';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Peta Interaktif</Text>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Info Peta',
              '🔴 Merah: Kota\n🔵 Biru: Sekolah\n🟡 Kuning: Landmark Geografis',
              [{ text: 'OK' }]
            );
          }}
          style={styles.infoButton}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor={getMarkerColor(marker.type)}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>

      {selectedMarker && (
        <View style={styles.infoPanel}>
          <Card>
            <View style={styles.infoHeader}>
              <View>
                <Text style={styles.infoTitle}>{selectedMarker.title}</Text>
                <Text style={styles.infoType}>
                  {selectedMarker.type === 'city' && '🏙️ Kota'}
                  {selectedMarker.type === 'educational' && '🏫 Sekolah'}
                  {selectedMarker.type === 'landmark' && '📍 Landmark'}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedMarker(null)} style={styles.closeButton}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.infoDescription}>{selectedMarker.description}</Text>
            <View style={styles.coordinates}>
              <Text style={styles.coordinateText}>
                📍 {selectedMarker.coordinate.latitude.toFixed(4)}°, {selectedMarker.coordinate.longitude.toFixed(4)}°
              </Text>
            </View>
          </Card>
        </View>
      )}

      <View style={styles.legendPanel}>
        <Card style={styles.legendCard}>
          <Text style={styles.legendTitle}>Lokasi Penting</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {markers.map((marker) => (
              <TouchableOpacity
                key={marker.id}
                style={styles.legendItem}
                onPress={() => handleMarkerPress(marker)}
              >
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: getMarkerColor(marker.type) },
                  ]}
                />
                <Text style={styles.legendText} numberOfLines={1}>
                  {marker.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.softBlue,
    zIndex: 10,
  },
  backButton: {
    width: 40,
  },
  backIcon: {
    fontSize: 28,
    color: Colors.white,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
    textAlign: 'center',
  },
  infoButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  infoIcon: {
    fontSize: 24,
  },
  map: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 5,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 4,
  },
  infoType: {
    fontSize: Typography.sizes.caption,
    color: Colors.deepTeal,
    fontWeight: Typography.weights.medium,
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 20,
    color: Colors.gray,
  },
  infoDescription: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    lineHeight: 20,
    marginBottom: 8,
  },
  coordinates: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderSubtle,
  },
  coordinateText: {
    fontSize: Typography.sizes.caption,
    color: Colors.gray,
  },
  legendPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 5,
  },
  legendCard: {
    paddingVertical: 12,
  },
  legendTitle: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    maxWidth: 120,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: Typography.sizes.caption,
    color: Colors.charcoalText,
  },
});
