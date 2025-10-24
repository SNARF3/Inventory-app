import { Link } from 'expo-router';
import React from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AnimatedLogo } from '../../../components/common/AnimatedLogo';
import { ButtonPrimary } from '../../../components/common/ButtonPrimary';
import { HeaderText } from '../../../components/common/HeaderText';
import { InputField } from '../../../components/common/InputField';
import { Colors, Spacing, Typography } from '../../../constants/theme';
import { useLoginLogic } from '../../../hooks/useLoginLogic';

export default function LoginScreen() {
  const {
    formData,
    touched,
    errors,
    loading,
    loginError,
    animations,
    handleInputChange,
    handleBlur,
    handleLogin,
    isFormValid,
  } = useLoginLogic();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo Animado en header */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: animations.fadeAnim,
              transform: [{ translateY: animations.headerSlideUp }]
            }
          ]}
        >
          <AnimatedLogo size={200} />
        </Animated.View>

        {/* Header con animación */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: animations.fadeAnim,
              transform: [{ translateY: animations.headerSlideUp }]
            }
          ]}
        >
          <HeaderText variant="h1">Bienvenido</HeaderText>
          <Text style={styles.subtitle}>
            Inicia sesión en tu cuenta de EquiStock
          </Text>
        </Animated.View>

        {/* Formulario con animación */}
        <Animated.View 
          style={[
            styles.form,
            {
              opacity: animations.fadeAnim,
              transform: [{ translateY: animations.formSlideUp }]
            }
          ]}
        >
          <InputField
            label="Email"
            placeholder="tu.email@ejemplo.com"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            onBlur={() => handleBlur('email')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={touched.email ? errors.email : undefined}
            touched={touched.email}
          />

          <InputField
            label="Contraseña"
            placeholder="Ingresa tu contraseña"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            onBlur={() => handleBlur('password')}
            secureTextEntry
            autoComplete="password"
            error={touched.password ? errors.password : undefined}
            touched={touched.password}
          />

          {/* Mostrar error de login si existe */}
          {loginError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{loginError}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Botones con animación */}
        <Animated.View 
          style={[
            styles.actions,
            {
              opacity: animations.fadeAnim,
              transform: [{ translateY: animations.buttonSlideUp }]
            }
          ]}
        >
          <ButtonPrimary
            title="Iniciar Sesión"
            onPress={handleLogin}
            loading={loading}
            disabled={!isFormValid || loading}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.registerSection}>
            <Text style={styles.registerText}>
              ¿No tienes una cuenta?{' '}
            </Text>
            <Link href="/views/auth/Register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Crear cuenta</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSolid,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  // Estilos para el mensaje de error
  errorContainer: {
    backgroundColor: '#fef2f2',
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
    marginTop: Spacing.sm,
  },
  errorText: {
    ...Typography.bodySmall,
    color: '#dc2626',
    fontWeight: '500',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  forgotPasswordText: {
    ...Typography.bodySmall,
    color: Colors.primarySolid,
    fontWeight: '500',
  },
  actions: {
    marginTop: 'auto',
  },
  loginButton: {
    marginBottom: Spacing.lg,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.textDisabled,
    opacity: 0.3,
  },
  dividerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginHorizontal: Spacing.md,
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  registerText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  registerLink: {
    ...Typography.body,
    color: Colors.primarySolid,
    fontWeight: '600',
  },
});