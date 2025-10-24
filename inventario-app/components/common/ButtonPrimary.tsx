import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';

interface ButtonPrimaryProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' ? Colors.primarySolid : Colors.textLight
          }
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: Colors.primarySolid,
  },
  secondaryButton: {
    backgroundColor: Colors.secondarySolid,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.primarySolid,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryText: {
    ...Typography.button,
    color: Colors.textLight,
    textAlign: 'center',
  },
  secondaryText: {
    ...Typography.button,
    color: Colors.textLight,
    textAlign: 'center',
  },
  outlineText: {
    ...Typography.button,
    color: Colors.primarySolid,
    textAlign: 'center',
  },
});