
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';

import CustomInput from '../../../components/common/CustomInput';
import CustomButton from '../../../components/common/CustomButton';
import colors from '../../../theme/colors';
import typography from '../../../theme/typography';
import useAuthStore from '../store/authStore';
import { validateLogin } from '../utils/authValidation';

export default function LoginScreen({ navigation, route }) {
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState(route.params?.email || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value, setter) => {
    setter(value);

    setErrors((previous) => ({
      ...previous,
      [field]: '',
    }));
  };

  const handleLogin = async () => {
    const validationErrors = validateLogin({
      email,
      password,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      await login(email.trim().toLowerCase(), password);
    } catch (error) {
      Alert.alert(
        'Login Failed',
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert(
      'Google Sign-In',
      'Google authentication will be connected in the next step.'
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.emoji}>👋</Text>
        </View>

        <Text style={styles.subtitle}>
          Login to continue using your account.
        </Text>

        <View style={styles.form}>
          <CustomInput
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={(value) =>
              handleChange('email', value, setEmail)
            }
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />

          <CustomInput
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(value) =>
              handleChange('password', value, setPassword)
            }
            secureTextEntry
            error={errors.password}
          />

          <CustomButton
            title="Login"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          {/* OR Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Login */}
          <TouchableOpacity
            style={styles.googleButton}
            activeOpacity={0.8}
            onPress={handleGoogleLogin}
          >
            <Text style={styles.googleLogo}>G</Text>
            <Text style={styles.googleText}>
              Continue with Google
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
            </Text>

            <Text
              style={styles.link}
              onPress={() => navigation.navigate('Register')}
            >
              Sign Up
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    color: colors.text,
    fontFamily: typography.fontFamily.bold,
  },

  emoji: {
    fontSize: 27,
    marginLeft: 9,
  },

  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.regular,
    marginTop: 10,
    marginBottom: 35,
  },

  form: {
    width: '100%',
  },

  loginButton: {
    marginTop: 10,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },

  orText: {
    marginHorizontal: 15,
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.semiBold,
  },

  googleButton: {
    height: 55,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  googleLogo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4285F4',
    marginRight: 12,
  },

  googleText: {
    fontSize: 15,
    color: colors.text,
    fontFamily: typography.fontFamily.semiBold,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  footerText: {
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.regular,
  },

  link: {
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
  },
});
