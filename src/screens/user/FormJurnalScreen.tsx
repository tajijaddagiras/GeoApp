import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { createJurnal, updateJurnal } from '../../services/firebaseService';
import { useAuthStore } from '../../store/authStore';
import { MoodType } from '../../types';

interface FormJurnalScreenProps {
  route: any;
  navigation: any;
}

const moods: { type: MoodType; emoji: string; label: string; color: string }[] = [
  { type: 'senang', emoji: '😊', label: 'Senang', color: Colors.successGreen },
  { type: 'semangat', emoji: '🔥', label: 'Semangat', color: Colors.mustard },
  { type: 'netral', emoji: '😐', label: 'Netral', color: Colors.softBlue },
  { type: 'bingung', emoji: '🤔', label: 'Bingung', color: Colors.lightGray },
  { type: 'sedih', emoji: '😢', label: 'Sedih', color: Colors.coral },
];

export const FormJurnalScreen: React.FC<FormJurnalScreenProps> = ({ route, navigation }) => {
  const { jurnal } = route.params || {};
  const { user } = useAuthStore();
  const isEdit = !!jurnal;

  const [judul, setJudul] = useState(jurnal?.judul || '');
  const [isi, setIsi] = useState(jurnal?.isi || '');
  const [selectedMood, setSelectedMood] = useState<MoodType>(jurnal?.mood || 'netral');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!judul.trim()) {
      Alert.alert('Error', 'Judul jurnal wajib diisi');
      return;
    }

    if (!isi.trim()) {
      Alert.alert('Error', 'Isi jurnal wajib diisi');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'User tidak ditemukan');
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updateJurnal(jurnal.id, {
          judul: judul.trim(),
          isi: isi.trim(),
          mood: selectedMood,
        });
        Alert.alert('Berhasil', 'Jurnal berhasil diperbarui');
      } else {
        await createJurnal({
          userId: user.id,
          judul: judul.trim(),
          isi: isi.trim(),
          mood: selectedMood,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        Alert.alert('Berhasil', 'Jurnal berhasil disimpan');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Save jurnal error:', error);
      Alert.alert('Error', 'Gagal menyimpan jurnal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Jurnal' : 'Tulis Jurnal'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.label}>Judul Jurnal</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Belajar tentang Litosfer"
            placeholderTextColor={Colors.gray}
            value={judul}
            onChangeText={setJudul}
            maxLength={100}
          />
        </Card>

        <Card>
          <Text style={styles.label}>Bagaimana perasaanmu hari ini?</Text>
          <View style={styles.moodContainer}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.type}
                style={[
                  styles.moodButton,
                  selectedMood === mood.type && styles.moodButtonSelected,
                  { borderColor: mood.color },
                ]}
                onPress={() => setSelectedMood(mood.type)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood === mood.type && styles.moodLabelSelected,
                  ]}
                >
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={styles.label}>Ceritakan pengalaman belajarmu</Text>
          <Text style={styles.hint}>
            Apa yang kamu pelajari? Apa yang menarik? Apa kesulitannya?
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tulis refleksi belajarmu di sini..."
            placeholderTextColor={Colors.gray}
            value={isi}
            onChangeText={setIsi}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
            maxLength={1000}
          />
          <Text style={styles.charCount}>{isi.length}/1000 karakter</Text>
        </Card>

        <Button
          title={isEdit ? 'Perbarui Jurnal' : 'Simpan Jurnal'}
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />

        <Button
          title="Batal"
          onPress={() => navigation.goBack()}
          variant="secondary"
          style={styles.cancelButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: Colors.earthBrown,
  },
  backButton: {
    width: 40,
  },
  backIcon: {
    fontSize: 28,
    color: Colors.creamWhite,
  },
  headerTitle: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.bold,
    color: Colors.creamWhite,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 12,
  },
  hint: {
    fontSize: Typography.sizes.caption,
    color: Colors.charcoalText,
    opacity: 0.7,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
    backgroundColor: Colors.white,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  moodButton: {
    flex: 1,
    minWidth: 90,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: Colors.white,
  },
  moodButtonSelected: {
    backgroundColor: Colors.creamWhite,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: Typography.sizes.caption,
    color: Colors.charcoalText,
  },
  moodLabelSelected: {
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
  },
  textArea: {
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
    backgroundColor: Colors.white,
    minHeight: 200,
  },
  charCount: {
    fontSize: Typography.sizes.caption,
    color: Colors.gray,
    textAlign: 'right',
    marginTop: 8,
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 40,
  },
});
