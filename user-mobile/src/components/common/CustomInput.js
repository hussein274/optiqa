
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import colors from '../../theme/colors';
import typography from '../../theme/typography';

const CustomInput = ({
  label,
  error,
  style,
  secureTextEntry = false,
  value,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry;
  const shouldFloat = isFocused || Boolean(value);

  const labelAnimation = useRef(
    new Animated.Value(shouldFloat ? 1 : 0)
  ).current;

  useEffect(() => {
    Animated.timing(labelAnimation, {
      toValue: shouldFloat ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [shouldFloat, labelAnimation]);

  const labelTop = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [17, -8],
  });

  const labelSize = labelAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [15, 11],
  });

  const labelColor = error
    ? colors.error
    : isFocused
      ? colors.primary
      : colors.secondary;

  const handleFocus = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {label ? (
          <Animated.Text
            pointerEvents="none"
            style={[
              styles.label,
              {
                top: labelTop,
                fontSize: labelSize,
                color: labelColor,
              },
            ]}
          >
            {label}
          </Animated.Text>
        ) : null}

        <TextInput
          {...props}
          value={value}
          onChangeText={props.onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={isPassword && !isPasswordVisible}
          keyboardType="default"
          keyboardAppearance="dark"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={label ? '' : props.placeholder}
          placeholderTextColor={colors.secondary}
          style={styles.input}
          blurOnSubmit={false}
          editable={true}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() =>
              setIsPasswordVisible((previous) => !previous)
            }
            style={styles.eyeButton}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              isPasswordVisible ? 'Hide password' : 'Show password'
            }
          >
            <Ionicons
              name={
                isPasswordVisible
                  ? 'eye-off-outline'
                  : 'eye-outline'
              }
              size={22}
              color={colors.secondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  inputContainer: {
    height: 56,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    position: 'relative',
  },

  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 1.3,
  },

  inputError: {
    borderColor: colors.error,
    borderWidth: 1.5,
  },

  label: {
    position: 'absolute',
    left: 11,
    zIndex: 2,
    backgroundColor: colors.surface,
    paddingHorizontal: 4,
    fontFamily: typography.fontFamily.semiBold,
    elevation: 0,
  },

  input: {
    flex: 1,
    height: '100%',
    fontFamily: typography.fontFamily.regular,
    fontSize: 15,
    color: colors.text,
    padding: 0,
    paddingTop: 5,
  },

  eyeButton: {
    paddingLeft: 12,
    paddingVertical: 8,
  },

  errorText: {
    color: colors.error,
    fontFamily: typography.fontFamily.medium,
    fontSize: 12,
    marginTop: 6,
  },
});

export default CustomInput;
