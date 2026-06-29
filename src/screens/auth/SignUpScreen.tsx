import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { signUp } from '../../services/firebaseService';
import { useAuthStore } from '../../store/authStore';

interface SignUpScreenProps {
  navigation: any;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    nisn: '',
    kelas: '',
    email: '',
    password: '',
    confirmPassword: '',
    kodeAktivasi: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const validate = () => {
    let valid = true;
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama wajib diisi';
      valid = false;
    }

    if (!formData.nisn.trim()) {
      newErrors.nisn = 'NISN wajib diisi';
      valid = false;
    }

    if (!formData.kelas.trim()) {
      newErrors.kelas = 'Kelas wajib diisi';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password wajib diisi';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const { setUser } = useAuthStore();

  const handleSignUp = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      const newUser = await signUp({
        name: formData.name,
        nisn: formData.nisn,
        kelas: formData.kelas,
        email: formData.email,
        password: formData.password,
        kodeAktivasi: formData.kodeAktivasi,
      });
      setUser(newUser);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Pendaftaran gagal');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.icon}>✨</Text>
          <Text style={styles.title}>Daftar Akun</Text>
          <Text style={styles.subtitle}>Bergabung sebagai explorer baru</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Nama Lengkap"
            value={formData.name}
            onChangeText={(text) => updateField('name', text)}
            placeholder="Masukkan nama lengkap"
            error={errors.name}
          />

          <Input
            label="NISN"
            value={formData.nisn}
            onChangeText={(text) => updateField('nisn', text)}
            placeholder="Masukkan NISN"
            keyboardType="number-pad"
            error={errors.nisn}
          />

          <Input
            label="Kelas"
            value={formData.kelas}
            onChangeText={(text) => updateField('kelas', text)}
            placeholder="Contoh: X IPA 1"
            error={errors.kelas}
          />

          <Input
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            placeholder="Masukkan email"
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Password"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            placeholder="Minimal 6 karakter"
            secureTextEntry
            error={errors.password}
          />

          <Input
            label="Konfirmasi Password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            placeholder="Ketik ulang password"
            secureTextEntry
            error={errors.confirmPassword}
          />

          <Input
            label="Kode Aktivasi (Opsional)"
            value={formData.kodeAktivasi}
            onChangeText={(text) => updateField('kodeAktivasi', text)}
            placeholder="Jika ada dari admin"
          />

          <Button
            title="Daftar"
            onPress={handleSignUp}
            loading={loading}
            style={styles.signUpButton}
          />

          <Button
            title="Sudah Punya Akun? Masuk"
            onPress={() => navigation.goBack()}
            variant="secondary"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.creamWhite,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 50,
    marginBottom: 12,
  },
  title: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.earthBrown,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Typography.sizes.body,
    color: Colors.charcoalText,
    opacity: 0.7,
  },
  form: {
    width: '100%',
  },
  signUpButton: {
    marginTop: 8,
    marginBottom: 12,
  },
});
