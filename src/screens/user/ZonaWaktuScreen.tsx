import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Card } from '../../components/Card';

interface ZonaWaktuScreenProps {
  navigation: any;
}

interface TimeZone {
  id: string;
  name: string;
  city: string;
  offset: number; // offset from UTC in hours
  emoji: string;
}

const timeZones: TimeZone[] = [
  { id: '1', name: 'WIB (Waktu Indonesia Barat)', city: 'Jakarta, Pekanbaru', offset: 7, emoji: '🇮🇩' },
  { id: '2', name: 'WITA (Waktu Indonesia Tengah)', city: 'Makassar, Bali', offset: 8, emoji: '🇮🇩' },
  { id: '3', name: 'WIT (Waktu Indonesia Timur)', city: 'Jayapura, Maluku', offset: 9, emoji: '🇮🇩' },
  { id: '4', name: 'London (GMT)', city: 'London, UK', offset: 0, emoji: '🇬🇧' },
  { id: '5', name: 'Tokyo (JST)', city: 'Tokyo, Japan', offset: 9, emoji: '🇯🇵' },
  { id: '6', name: 'New York (EST)', city: 'New York, USA', offset: -5, emoji: '🇺🇸' },
  { id: '7', name: 'Dubai (GST)', city: 'Dubai, UAE', offset: 4, emoji: '🇦🇪' },
  { id: '8', name: 'Sydney (AEDT)', city: 'Sydney, Australia', offset: 11, emoji: '🇦🇺' },
];

export const ZonaWaktuScreen: React.FC<ZonaWaktuScreenProps> = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeForZone = (offset: number): string => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const zoneTime = new Date(utc + 3600000 * offset);
    
    const hours = zoneTime.getHours().toString().padStart(2, '0');
    const minutes = zoneTime.getMinutes().toString().padStart(2, '0');
    const seconds = zoneTime.getSeconds().toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  };

  const getDateForZone = (offset: number): string => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const zoneTime = new Date(utc + 3600000 * offset);
    
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    return `${days[zoneTime.getDay()]}, ${zoneTime.getDate()} ${months[zoneTime.getMonth()]} ${zoneTime.getFullYear()}`;
  };

  const getTimeDifference = (offset: number): string => {
    const pekanbaru = 7; // WIB offset
    const diff = offset - pekanbaru;
    
    if (diff === 0) return 'Zona waktu lokal';
    if (diff > 0) return `+${diff} jam dari Pekanbaru`;
    return `${diff} jam dari Pekanbaru`;
  };

  const isDaytime = (offset: number): boolean => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000;
    const zoneTime = new Date(utc + 3600000 * offset);
    const hours = zoneTime.getHours();
    return hours >= 6 && hours < 18;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Zona Waktu Dunia</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={styles.infoCard}>
          <Text style={styles.infoIcon}>🌍</Text>
          <Text style={styles.infoTitle}>Pembagian Zona Waktu</Text>
          <Text style={styles.infoText}>
            Bumi dibagi menjadi 24 zona waktu berdasarkan garis bujur. Setiap selisih 15° garis bujur = 1 jam perbedaan waktu.
          </Text>
          <Text style={styles.infoText}>
            Indonesia memiliki 3 zona waktu: WIB (GMT+7), WITA (GMT+8), dan WIT (GMT+9).
          </Text>
        </Card>

        <Text style={styles.sectionTitle}>⏰ Waktu Real-Time</Text>

        {timeZones.map((zone) => (
          <Card key={zone.id} style={styles.timeCard}>
            <View style={styles.timeHeader}>
              <View style={styles.zoneInfo}>
                <Text style={styles.emoji}>{zone.emoji}</Text>
                <View>
                  <Text style={styles.zoneName}>{zone.name}</Text>
                  <Text style={styles.cityName}>{zone.city}</Text>
                </View>
              </View>
              <View style={styles.timeIndicator}>
                <Text style={styles.timeIcon}>{isDaytime(zone.offset) ? '☀️' : '🌙'}</Text>
              </View>
            </View>

            <View style={styles.timeDisplay}>
              <Text style={styles.timeText}>{getTimeForZone(zone.offset)}</Text>
              <Text style={styles.dateText}>{getDateForZone(zone.offset)}</Text>
            </View>

            <View style={styles.differenceRow}>
              <Text style={styles.differenceText}>{getTimeDifference(zone.offset)}</Text>
              <Text style={styles.utcText}>UTC {zone.offset >= 0 ? '+' : ''}{zone.offset}</Text>
            </View>
          </Card>
        ))}

        <Card style={styles.factCard}>
          <Text style={styles.factTitle}>💡 Tahukah Kamu?</Text>
          <Text style={styles.factText}>
            • Pekanbaru berada di WIB (UTC+7), sama dengan Jakarta{'\n'}
            • Perbedaan waktu terbesar di Indonesia adalah 2 jam (WIB ke WIT){'\n'}
            • Garis bujur 0° (Greenwich) di London menjadi patokan GMT{'\n'}
            • Ada negara yang memiliki zona waktu dengan offset setengah jam (contoh: India UTC+5:30)
          </Text>
        </Card>
      </ScrollView>
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
    paddingBottom: 20,
    backgroundColor: Colors.mustard,
  },
  backButton: {
    width: 40,
  },
  backIcon: {
    fontSize: 28,
    color: Colors.earthBrown,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: Colors.softBlue + '20',
    alignItems: 'center',
    marginBottom: 24,
  },
  infoIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 12,
    textAlign: 'center',
  },
  infoText: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 16,
  },
  timeCard: {
    marginBottom: 16,
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  zoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  zoneName: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
  },
  cityName: {
    fontSize: Typography.sizes.caption,
    color: Colors.charcoalText,
    marginTop: 2,
  },
  timeIndicator: {
    padding: 4,
  },
  timeIcon: {
    fontSize: 24,
  },
  timeDisplay: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderSubtle,
    marginBottom: 12,
  },
  timeText: {
    fontSize: 36,
    fontWeight: Typography.weights.bold,
    color: Colors.deepTeal,
    letterSpacing: 2,
    marginBottom: 4,
  },
  dateText: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
  },
  differenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  differenceText: {
    fontSize: Typography.sizes.caption,
    color: Colors.charcoalText,
    fontStyle: 'italic',
  },
  utcText: {
    fontSize: Typography.sizes.caption,
    fontWeight: Typography.weights.semibold,
    color: Colors.softBlue,
  },
  factCard: {
    backgroundColor: Colors.warmSand + '40',
    marginTop: 8,
    marginBottom: 40,
  },
  factTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 12,
  },
  factText: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
    lineHeight: 24,
  },
});
