
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import useAuthStore from '../../auth/store/authStore';
import colors from '../../../theme/colors';
import typography from '../../../theme/typography';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;
  const imageAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 45,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(imageAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const profileImage =
    user?.profileImage?.url ||
    user?.profileImage ||
    user?.profileImageUrl;

  const fullName =
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    user?.name ||
    user?.fullName ||
    'User';

  const details = [
    {
      label: 'Full Name',
      value: fullName,
      icon: '♙',
    },
    {
      label: 'Email Address',
      value: user?.email,
      icon: '✉',
    },
    {
      label: 'Phone Number',
      value: user?.phone,
      icon: '☎',
    },
    {
      label: 'Date of Birth',
      value: user?.dateOfBirth
        ? String(user.dateOfBirth).slice(0, 10)
        : null,
      icon: '▦',
    },
    {
      label: 'Gender',
      value: user?.gender,
      icon: '♙',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Welcome */}
          <View style={styles.welcomeContainer}>
            <View style={styles.welcomeRow}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.emoji}>👋</Text>
            </View>

            <Text style={styles.name}>{fullName}</Text>
          </View>

          {/* Profile Image */}
          <Animated.View
            style={[
              styles.imageContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: imageAnim }],
              },
            ]}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.placeholderText}>
                  {fullName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}

            <View style={styles.onlineIndicator} />
          </Animated.View>

          {/* Personal Information */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>
              Personal Information
            </Text>

            {details.map((item) => (
              <View key={item.label} style={styles.detailCard}>
                <View style={styles.iconContainer}>
                  <Text style={styles.detailIcon}>
                    {item.icon}
                  </Text>
                </View>

                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>
                    {item.label}
                  </Text>

                  <Text style={styles.detailValue}>
                    {item.value || 'Not provided'}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={logout}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 35,
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 35,
  },

  welcomeContainer: {
    alignItems: 'flex-start',
    marginBottom: 28,
  },

  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  welcomeText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 20,
    color: colors.textSecondary,
  },

  emoji: {
    fontSize: 23,
    marginLeft: 8,
  },

  name: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 28,
    color: colors.text,
    textAlign: 'left',
    marginTop: 5,
  },

  imageContainer: {
    width: 145,
    height: 145,
    borderRadius: 75,
    backgroundColor: colors.white,
    padding: 5,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    marginBottom: 35,
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },

  imagePlaceholder: {
    flex: 1,
    borderRadius: 75,
    backgroundColor: '#E8ECFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    fontSize: 48,
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
  },

  onlineIndicator: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.white,
    position: 'absolute',
    bottom: 10,
    right: 8,
  },

  detailsContainer: {
    marginTop: 5,
  },

  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
  },

  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
  },

  iconContainer: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor: '#E4E9FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  detailIcon: {
    fontSize: 19,
    color: colors.primary,
  },

  detailTextContainer: {
    flex: 1,
  },

  detailLabel: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },

  detailValue: {
    fontFamily: typography.fontFamily.semiBold,
    fontSize: 15,
    color: colors.text,
  },

  logoutButton: {
    height: 55,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },

  logoutText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: 16,
    color: colors.error,
  },
});
