
import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from 'react-native';

import colors from '../../theme/colors';
import typography from '../../theme/typography';

const Loading = ({ message = 'Please wait...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />

      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  message: {
    marginTop: 12,
    fontFamily: typography.fontFamily.medium,
    fontSize: 14,
    color: colors.textSecondary,
  },
});

export default Loading;
