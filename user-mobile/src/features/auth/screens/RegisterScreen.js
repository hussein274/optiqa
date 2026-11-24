
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import CustomInput from '../../../components/common/CustomInput';
import CustomButton from '../../../components/common/CustomButton';
import colors from '../../../theme/colors';
import typography from '../../../theme/typography';

import useAuthStore from '../store/authStore';
import { validateRegister } from '../utils/authValidation';

export default function RegisterScreen({ navigation }) {
  const register = useAuthStore((state) => state.register);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date(2000, 0, 1)
  );

  const handleChange = (field, value) => {
    const setters = {
      firstName: setFirstName,
      lastName: setLastName,
      email: setEmail,
      password: setPassword,
      confirmPassword: setConfirmPassword,
      phone: setPhone,
      gender: setGender,
    };

    setters[field]?.(value);

    setErrors((prev) => ({
      ...prev,
      [field]: '',
    }));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      setDateOfBirth(formatDate(date));

      setErrors((prev) => ({
        ...prev,
        dateOfBirth: '',
      }));
    }
  };

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'Please allow photo library access.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0]);
    }
  };

  const handleRegister = async () => {
    const validationErrors = validateRegister({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      dateOfBirth,
      gender,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append('firstName', firstName.trim());
      formData.append('lastName', lastName.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('password', password);
      formData.append('phone', phone.trim());
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('gender', gender);

      if (profileImage) {
        formData.append('profileImage', {
          uri: profileImage.uri,
          name: profileImage.fileName || 'profile.jpg',
          type: profileImage.mimeType || 'image/jpeg',
        });
      }

      await register(formData);

      Alert.alert(
        'Success',
        'Your account has been created successfully.',
        [
          {
            text: 'Login',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      console.log('REGISTER ERROR:', error.message);
      console.log('SERVER RESPONSE:', error.response?.data);

      const message =
        error.response?.data?.message ||
        'Something went wrong. Please try again.';

      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>

            <Text style={styles.subtitle}>
              Create an account to get started
            </Text>

            <TouchableOpacity
              style={styles.imageContainer}
              onPress={pickImage}
              activeOpacity={0.8}
            >
              {profileImage ? (
                <Image
                  source={{ uri: profileImage.uri }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons
                    name="camera-outline"
                    size={30}
                    color={colors.primary}
                  />
                </View>
              )}

              <View style={styles.cameraIcon}>
                <Ionicons
                  name="add"
                  size={18}
                  color={colors.white}
                />
              </View>
            </TouchableOpacity>

            <Text style={styles.uploadText}>
              Upload Profile Picture
            </Text>

            <View style={styles.form}>
              {/* First Name */}
              <CustomInput
                label="First Name"
                value={firstName}
                onChangeText={(value) =>
                  handleChange('firstName', value)
                }
                autoCapitalize="words"
                error={errors.firstName}
              />

              {/* Last Name */}
              <CustomInput
                label="Last Name"
                value={lastName}
                onChangeText={(value) =>
                  handleChange('lastName', value)
                }
                autoCapitalize="words"
                error={errors.lastName}
              />

              {/* Email */}
              <CustomInput
                label="Email Address"
                value={email}
                onChangeText={(value) =>
                  handleChange('email', value)
                }
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              {/* Password */}
              <CustomInput
                label="Password"
                value={password}
                onChangeText={(value) =>
                  handleChange('password', value)
                }
                secureTextEntry
                error={errors.password}
              />

              {/* Confirm Password */}
              <CustomInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={(value) =>
                  handleChange('confirmPassword', value)
                }
                secureTextEntry
                error={errors.confirmPassword}
              />

              {/* Phone */}
              <CustomInput
                label="Phone Number"
                value={phone}
                onChangeText={(value) =>
                  handleChange('phone', value)
                }
                keyboardType="phone-pad"
                error={errors.phone}
              />

              {/* Date of Birth */}
              <Text style={styles.dateLabel}>Date of Birth</Text>

              <View style={styles.dateWrapper}>
                <TouchableOpacity
                  style={[
                    styles.dateInput,
                    errors.dateOfBirth && styles.dateInputError,
                  ]}
                  onPress={() =>
                    setShowDatePicker((prev) => !prev)
                  }
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.dateText,
                      !dateOfBirth && styles.datePlaceholder,
                    ]}
                  >
                    {dateOfBirth || 'Select your date of birth'}
                  </Text>

                  <Ionicons
                    name="calendar-outline"
                    size={21}
                    color={colors.primary}
                  />
                </TouchableOpacity>

                {showDatePicker && (
                  <View style={styles.datePickerPopup}>
                    <View style={styles.datePickerHeader}>
                      <Text style={styles.datePickerTitle}>
                        Select Date
                      </Text>

                      <TouchableOpacity
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Ionicons
                          name="close"
                          size={21}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>

                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display={
                        Platform.OS === 'ios' ? 'compact' : 'calendar'
                      }
                      maximumDate={new Date()}
                      onChange={handleDateChange}
                      themeVariant="light"
                    />

                    {Platform.OS === 'ios' && (
                      <TouchableOpacity
                        style={styles.dateDoneButton}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={styles.dateDoneText}>Done</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {errors.dateOfBirth ? (
                <Text style={styles.errorText}>
                  {errors.dateOfBirth}
                </Text>
              ) : null}

              {/* Gender */}
              <Text style={styles.genderLabel}>Gender</Text>

              <View style={styles.genderContainer}>
                {['Male', 'Female'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.genderOption,
                      gender === item && styles.genderSelected,
                      errors.gender && styles.genderError,
                    ]}
                    onPress={() => handleChange('gender', item)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={
                        item === 'Male'
                          ? 'male-outline'
                          : 'female-outline'
                      }
                      size={19}
                      color={
                        gender === item
                          ? colors.primary
                          : colors.textSecondary
                      }
                    />

                    <Text
                      style={[
                        styles.genderText,
                        gender === item && styles.genderSelectedText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {errors.gender ? (
                <Text style={styles.errorText}>
                  {errors.gender}
                </Text>
              ) : null}

              <CustomButton
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={styles.registerButton}
              />

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Already have an account?
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginLink}> Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 27,
    color: colors.text,
    textAlign: 'center',
  },

  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.regular,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 20,
  },

  imageContainer: {
    alignSelf: 'center',
    width: 82,
    height: 82,
    marginBottom: 7,
  },

  imagePlaceholder: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  profileImage: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },

  cameraIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
  },

  form: {
    width: '100%',
  },

  dateLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.size.regular,
    color: colors.text,
    marginBottom: 9,
  },

  dateWrapper: {
    position: 'relative',
    zIndex: 10,
  },

  dateInput: {
    height: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
  },

  dateInputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },

  dateText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.regular,
    color: colors.text,
  },

  datePlaceholder: {
    color: colors.textSecondary,
  },

  datePickerPopup: {
    position: 'absolute',
    bottom: 62,
    left: 0,
    zIndex: 100,
    elevation: 10,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    minWidth: 220,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  datePickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 5,
  },

  datePickerTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
    color: colors.text,
  },

  dateDoneButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 7,
  },

  dateDoneText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
    fontSize: 14,
  },

  genderLabel: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: typography.size.regular,
    color: colors.text,
    marginTop: 18,
    marginBottom: 10,
  },

  genderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 5,
  },

  genderOption: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
  },

  genderSelected: {
    borderColor: colors.primary,
    backgroundColor: '#F3F5FF',
  },

  genderError: {
    borderColor: colors.error,
  },

  genderText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.size.regular,
    color: colors.textSecondary,
  },

  genderSelectedText: {
    color: colors.primary,
  },

  errorText: {
    color: colors.error,
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    marginTop: 5,
    marginBottom: 8,
  },

  registerButton: {
    marginTop: 22,
    height: 50,
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15,
  },

  loginText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 13,
    color: colors.textSecondary,
  },

  loginLink: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 13,
    color: colors.primary,
  },
});
