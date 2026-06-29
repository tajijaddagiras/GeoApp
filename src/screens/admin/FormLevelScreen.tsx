import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { createLevel, updateLevel } from '../../services/firebaseService';
import { Level } from '../../types';

interface FormLevelScreenProps {
  route: any;
  navigation: any;
}

export const FormLevelScreen: React.FC<FormLevelScreenProps> = ({ route, navigation }) => {
  const { level } = route.params || {};
  const isEdit = !!level;

  const [formData, setFormData] = useState({
    nama: level?.nama || '',
    poinPerSoal: level?.poinPerSoal?.toString() || '',
    durasiMenit: level?.durasiMenit?.toString() || '',
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validate = (): boolean => {
    if (!formData.nama.trim()) {
      Alert.alert('Error', 'Nama level wajib diisi');
      return false;
    }
    if (!formData.poinPerSoal || isNaN(Number(formData.poinPerSoal)) || Number(formData.poinPerSoal) <= 0) {
      Alert.alert('Error', 'Poin per soal harus berupa angka positif');
      return false;
    }
    if (!formData.durasiMenit || isNaN(Number(formData.durasiMenit)) || Number(formData.durasiMenit) <= 0) {
      Alert.alert('Error', 'Durasi menit harus berupa angka positif');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const levelData = {
        nama: formData.nama.trim(),
        poinPerSoal: Number(formData.poinPerSoal),
        durasiMenit: Number(formData.durasiMenit),
      };

      if (isEdit) {
        await updateLevel(level.id, levelData);
        Alert.alert('Berhasil', 'Level berhasil diperbarui');
      } else {
        await createLevel({
          ...levelData,
          createdAt: new Date(),
        });
        Alert.alert('Berhasil', 'Level berhasil ditambahkan');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Save level error:', error);
      Alert.alert('Error', 'Gagal menyimpan level');
    } finally {
      setLoading(false);
    }
  };

  const poinPerSoalNum = Number(formData.poinPerSoal) || 0;
  const durasiNum = Number(formData.durasiMenit) || 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Level' : 'Tambah Level'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.label}>Nama Level *</Text>
          <Text style={styles.hint}>Contoh: Level 1, Level Mudah, Level Expert</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan nama level..."
            placeholderTextColor={Colors.gray}
            value={formData.nama}
            onChangeText={(text) => updateField('nama', text)}
          />
        </Card>

        <Card>
          <Text style={styles.label}>Poin Per Soal *</Text>
          <Text style={styles.hint}>Poin yang diperoleh untuk setiap jawaban yang benar</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 10"
            placeholderTextColor={Colors.gray}
            value={formData.poinPerSoal}
            onChangeText={(text) => updateField('poinPerSoal', text)}
            keyboardType="number-pad"
          />
        </Card>

        <Card>
          <Text style={styles.label}>Durasi Kuis (Menit) *</Text>
          <Text style={styles.hint}>Batas waktu pengerjaan kuis dalam menit</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 30"
            placeholderTextColor={Colors.gray}
            value={formData.durasiMenit}
            onChangeText={(text) => updateField('durasiMenit', text)}
            keyboardType="number-pad"
          />
        </Card>

        {/* Preview Card */}
        {(poinPerSoalNum > 0 || durasiNum > 0) && (
          <Card style={styles.previewCard}>
            <Text style={styles.previewTitle}>📊 Preview Level</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Nama Level</Text>
              <Text style={styles.previewValue}>{formData.nama || '-'}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Durasi Kuis</Text>
              <Text style={styles.previewValue}>⏱️ {durasiNum} menit</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Poin Per Soal</Text>
              <Text style={styles.previewValue}>🏆 {poinPerSoalNum} poin</Text>
            </View>
            <View style={[styles.previewRow, styles.previewRowLast]}>
              <Text style={styles.previewLabel}>Contoh (10 soal)</Text>
              <Text style={[styles.previewValue, styles.previewValueHighlight]}>
                Maks {poinPerSoalNum * 10} poin
              </Text>
            </View>
          </Card>
        )}

        <Button
          title={isEdit ? 'Perbarui Level' : 'Simpan Level'}
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
    marginBottom: 6,
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
  previewCard: {
    backgroundColor: Colors.deepTeal + '12',
    borderWidth: 1,
    borderColor: Colors.deepTeal + '40',
  },
  previewTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.bold,
    color: Colors.deepTeal,
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderSubtle,
  },
  previewRowLast: {
    borderBottomWidth: 0,
  },
  previewLabel: {
    fontSize: Typography.sizes.subheading,
    color: Colors.charcoalText,
  },
  previewValue: {
    fontSize: Typography.sizes.subheading,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
  },
  previewValueHighlight: {
    color: Colors.successGreen,
    fontSize: Typography.sizes.body,
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 40,
  },
});
