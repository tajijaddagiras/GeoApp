import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { createSoal, updateSoal } from '../../services/firebaseService';

interface FormSoalScreenProps {
  route: any;
  navigation: any;
}

export const FormSoalScreen: React.FC<FormSoalScreenProps> = ({ route, navigation }) => {
  const { soal, materiId } = route.params || {};
  const isEdit = !!soal;

  const [formData, setFormData] = useState({
    pertanyaan: soal?.pertanyaan || '',
    jawabanA: soal?.jawabanA || '',
    jawabanB: soal?.jawabanB || '',
    jawabanC: soal?.jawabanC || '',
    jawabanD: soal?.jawabanD || '',
    jawabanBenar: soal?.jawabanBenar || 'A',
    order: soal?.order?.toString() || '1',
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validate = (): boolean => {
    if (!formData.pertanyaan.trim()) {
      Alert.alert('Error', 'Pertanyaan wajib diisi');
      return false;
    }
    if (!formData.jawabanA.trim() || !formData.jawabanB.trim() || 
        !formData.jawabanC.trim() || !formData.jawabanD.trim()) {
      Alert.alert('Error', 'Semua pilihan jawaban wajib diisi');
      return false;
    }
    if (!['A', 'B', 'C', 'D'].includes(formData.jawabanBenar)) {
      Alert.alert('Error', 'Jawaban benar harus A, B, C, atau D');
      return false;
    }
    if (!formData.order.trim() || isNaN(Number(formData.order))) {
      Alert.alert('Error', 'Nomor urut harus berupa angka');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (!materiId && !soal?.materiId) {
      Alert.alert('Error', 'Materi ID tidak ditemukan');
      return;
    }

    try {
      setLoading(true);

      const soalData = {
        materiId: materiId || soal.materiId,
        pertanyaan: formData.pertanyaan.trim(),
        jawabanA: formData.jawabanA.trim(),
        jawabanB: formData.jawabanB.trim(),
        jawabanC: formData.jawabanC.trim(),
        jawabanD: formData.jawabanD.trim(),
        jawabanBenar: formData.jawabanBenar,
        order: Number(formData.order),
      };

      if (isEdit) {
        await updateSoal(soal.id, soalData);
        Alert.alert('Berhasil', 'Soal berhasil diperbarui');
      } else {
        await createSoal({
          ...soalData,
          createdAt: new Date(),
        });
        Alert.alert('Berhasil', 'Soal berhasil ditambahkan');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Save soal error:', error);
      Alert.alert('Error', 'Gagal menyimpan soal');
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
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Soal' : 'Tambah Soal'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.label}>Nomor Urut Soal *</Text>
          <Text style={styles.hint}>Urutan soal dalam kuis</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: 1"
            placeholderTextColor={Colors.gray}
            value={formData.order}
            onChangeText={(text) => updateField('order', text)}
            keyboardType="number-pad"
          />
        </Card>

        <Card>
          <Text style={styles.label}>Pertanyaan *</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tuliskan pertanyaan soal..."
            placeholderTextColor={Colors.gray}
            value={formData.pertanyaan}
            onChangeText={(text) => updateField('pertanyaan', text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Pilihan Jawaban</Text>

          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>A. *</Text>
            <TextInput
              style={styles.input}
              placeholder="Pilihan A"
              placeholderTextColor={Colors.gray}
              value={formData.jawabanA}
              onChangeText={(text) => updateField('jawabanA', text)}
            />
          </View>

          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>B. *</Text>
            <TextInput
              style={styles.input}
              placeholder="Pilihan B"
              placeholderTextColor={Colors.gray}
              value={formData.jawabanB}
              onChangeText={(text) => updateField('jawabanB', text)}
            />
          </View>

          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>C. *</Text>
            <TextInput
              style={styles.input}
              placeholder="Pilihan C"
              placeholderTextColor={Colors.gray}
              value={formData.jawabanC}
              onChangeText={(text) => updateField('jawabanC', text)}
            />
          </View>

          <View style={styles.optionGroup}>
            <Text style={styles.optionLabel}>D. *</Text>
            <TextInput
              style={styles.input}
              placeholder="Pilihan D"
              placeholderTextColor={Colors.gray}
              value={formData.jawabanD}
              onChangeText={(text) => updateField('jawabanD', text)}
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.label}>Jawaban Benar *</Text>
          <Text style={styles.hint}>Pilih jawaban yang benar</Text>
          <View style={styles.answerButtonsContainer}>
            {['A', 'B', 'C', 'D'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.answerButton,
                  formData.jawabanBenar === option && styles.answerButtonSelected,
                ]}
                onPress={() => updateField('jawabanBenar', option)}
              >
                <Text
                  style={[
                    styles.answerButtonText,
                    formData.jawabanBenar === option && styles.answerButtonTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Button
          title={isEdit ? 'Perbarui Soal' : 'Simpan Soal'}
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
    marginBottom: 8,
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
  textArea: {
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
    backgroundColor: Colors.white,
    minHeight: 100,
  },
  sectionTitle: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.earthBrown,
    marginBottom: 16,
  },
  optionGroup: {
    marginBottom: 12,
  },
  optionLabel: {
    fontSize: Typography.sizes.body,
    fontWeight: Typography.weights.semibold,
    color: Colors.deepTeal,
    marginBottom: 8,
  },
  answerButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  answerButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.borderSubtle,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  answerButtonSelected: {
    borderColor: Colors.successGreen,
    backgroundColor: Colors.successGreen + '20',
  },
  answerButtonText: {
    fontSize: Typography.sizes.heading,
    fontWeight: Typography.weights.bold,
    color: Colors.charcoalText,
  },
  answerButtonTextSelected: {
    color: Colors.successGreen,
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 40,
  },
});
