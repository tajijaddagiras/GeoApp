import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Colors } from '../../constants/colors';
import { Typography } from '../../constants/typography';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { signIn } from '../../services/firebaseService';

interface SignInScreenProps {
  navigation: any;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '' };

    if (!email.trim()) {
      newErrors.email = 'Email atau NISN wajib diisi';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password wajib diisi';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      await signIn(email, password);
      // Navigation handled by RootNavigator
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Login gagal');
    } finally {
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
          <Text style={styles.icon}>🗺️</Text>
          <Text style={styles.title}>Selamat Datang</Text>
          <Text style={styles.subtitle}>Masuk untuk melanjutkan eksplorasi</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email atau NISN"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: '' });
            }}
            placeholder="Masukkan email atau NISN"
            autoCapitalize="none"
            keyboardType="email-address"
            error={errors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: '' });
            }}
            placeholder="Masukkan password"
            secureTextEntry
            error={errors.password}
          />

          <Button
            title="Masuk"
            onPress={handleSignIn}
            loading={loading}
            style={styles.signInButton}
          />

          <Button
            title="Daftar Akun Baru"
            onPress={() => navigation.navigate('SignUp')}
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  icon: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: Typography.sizes.hero,
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
  signInButton: {
    marginBottom: 12,
  },
});
