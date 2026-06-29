import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { createMateri, updateMateri } from '../../services/firebaseService';

interface FormMateriScreenProps {
  route: any;
  navigation: any;
}

export const FormMateriScreen: React.FC<FormMateriScreenProps> = ({ route, navigation }) => {
  const { materi } = route.params || {};
  const isEdit = !!materi;

  const [formData, setFormData] = useState({
    title: materi?.title || '',
    kd: materi?.kd || '',
    konsep: materi?.konsep || '',
    studiKasus: materi?.studiKasus || '',
    order: materi?.order?.toString() || '1',
    imageUrl: materi?.imageUrl || '',
  });
  const [loading, setLoading] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const validate = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Judul materi wajib diisi');
      return false;
    }
    if (!formData.kd.trim()) {
      Alert.alert('Error', 'Kompetensi Dasar wajib diisi');
      return false;
    }
    if (!formData.konsep.trim()) {
      Alert.alert('Error', 'Konsep materi wajib diisi');
      return false;
    }
    if (!formData.studiKasus.trim()) {
      Alert.alert('Error', 'Studi kasus wajib diisi');
      return false;
    }
    if (!formData.order.trim() || isNaN(Number(formData.order))) {
      Alert.alert('Error', 'Urutan harus berupa angka');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const materiData = {
        title: formData.title.trim(),
        kd: formData.kd.trim(),
        konsep: formData.konsep.trim(),
        studiKasus: formData.studiKasus.trim(),
        order: Number(formData.order),
        imageUrl: formData.imageUrl.trim() || undefined,
        updatedAt: new Date(),
      };

      if (isEdit) {
        await updateMateri(materi.id, materiData);
        Alert.alert('Berhasil', 'Materi berhasil diperbarui');
      } else {
        await createMateri({
          ...materiData,
          createdAt: new Date(),
        });
        Alert.alert('Berhasil', 'Materi berhasil ditambahkan');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Save materi error:', error);
      Alert.alert('Error', 'Gagal menyimpan materi');
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
        <Text style={styles.headerTitle}>{isEdit ? 'Edit Materi' : 'Tambah Materi'}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={styles.label}>Judul Materi *</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: Dinamika Litosfer"
            placeholderTextColor={Colors.gray}
            value={formData.title}
            onChangeText={(text) => updateField('title', text)}
          />
        </Card>

        <Card>
          <Text style={styles.label}>Kompetensi Dasar (KD) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Contoh: KD 3.2"
            placeholderTextColor={Colors.gray}
            value={formData.kd}
            onChangeText={(text) => updateField('kd', text)}
          />
        </Card>

        <Card>
          <Text style={styles.label}>Urutan Materi *</Text>
          <Text style={styles.hint}>Menentukan urutan tampilan di dashboard</Text>
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
          <Text style={styles.label}>Konsep Materi *</Text>
          <Text style={styles.hint}>Penjelasan teoritis tentang materi</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tuliskan konsep materi secara lengkap..."
            placeholderTextColor={Colors.gray}
            value={formData.konsep}
            onChangeText={(text) => updateField('konsep', text)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </Card>

        <Card>
          <Text style={styles.label}>Studi Kasus Kontekstual *</Text>
          <Text style={styles.hint}>Contoh kasus nyata di Riau/Pekanbaru</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Tuliskan studi kasus yang relevan dengan Riau..."
            placeholderTextColor={Colors.gray}
            value={formData.studiKasus}
            onChangeText={(text) => updateField('studiKasus', text)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </Card>

        <Card>
          <Text style={styles.label}>URL Gambar (Opsional)</Text>
          <Text style={styles.hint}>Link URL gambar ilustrasi</Text>
          <TextInput
            style={styles.input}
            placeholder="https://example.com/image.jpg"
            placeholderTextColor={Colors.gray}
            value={formData.imageUrl}
            onChangeText={(text) => updateField('imageUrl', text)}
            autoCapitalize="none"
          />
        </Card>

        <Button
          title={isEdit ? 'Perbarui Materi' : 'Simpan Materi'}
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
    minHeight: 120,
  },
  saveButton: {
    marginTop: 24,
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 40,
  },
});
