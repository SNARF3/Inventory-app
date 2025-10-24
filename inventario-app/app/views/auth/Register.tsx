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
import { useRegisterLogic } from '../../../hooks/useRegisterLogic';

export default function RegisterScreen() {
  const {
    formData,
    touched,
    errors,
    loading,
    animations,
    handleInputChange,
    handleBlur,
    handlePhoneChange,
    handleRegister,
    isFormValid,
  } = useRegisterLogic();

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
        {/* Logo Animado */}
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
          <HeaderText variant="h1">Crear Cuenta</HeaderText>
          <Text style={styles.subtitle}>
            Únete a EquiStock y comienza tu experiencia
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
          <View style={styles.nameRow}>
            <View style={styles.nameInput}>
              <InputField
                label="Nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChangeText={(value) => handleInputChange('nombre', value)}
                onBlur={() => handleBlur('nombre')}
                autoCapitalize="words"
                autoComplete="name"
                error={touched.nombre ? errors.nombre : undefined} // ✅ Agregado
                touched={touched.nombre}
              />
            </View>
            <View style={styles.nameInput}>
              <InputField
                label="Apellido"
                placeholder="Tu apellido"
                value={formData.apellido}
                onChangeText={(value) => handleInputChange('apellido', value)}
                onBlur={() => handleBlur('apellido')}
                autoCapitalize="words"
                autoComplete="name-family"
                error={touched.apellido ? errors.apellido : undefined} // ✅ Agregado
                touched={touched.apellido}
              />
            </View>
          </View>

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
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            onBlur={() => handleBlur('password')}
            secureTextEntry
            autoComplete="new-password"
            error={touched.password ? errors.password : undefined}
            touched={touched.password}
          />

          <InputField
            label="Confirmar Contraseña"
            placeholder="Repite tu contraseña"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            onBlur={() => handleBlur('confirmPassword')}
            secureTextEntry
            autoComplete="new-password"
            error={touched.confirmPassword ? errors.confirmPassword : undefined}
            touched={touched.confirmPassword}
          />

          <InputField
            label="Teléfono"
            placeholder="Tu número de teléfono"
            value={formData.telefono}
            onChangeText={handlePhoneChange}
            onBlur={() => handleBlur('telefono')}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoComplete="tel"
            error={touched.telefono ? errors.telefono : undefined}
            touched={touched.telefono}
            maxLength={8}
          />
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
            title="Crear Cuenta"
            onPress={handleRegister}
            loading={loading}
            disabled={!isFormValid || loading}
            style={styles.registerButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.loginSection}>
            <Text style={styles.loginText}>
              ¿Ya tienes una cuenta?{' '}
            </Text>
            <Link href="/views/auth/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Inicia Sesión</Text>
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
    marginBottom: Spacing.xxs,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  nameRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  nameInput: {
    flex: 1,
  },
  actions: {
    marginTop: 'auto',
  },
  registerButton: {
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
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  loginText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  loginLink: {
    ...Typography.body,
    color: Colors.primarySolid,
    fontWeight: '600',
  },
});