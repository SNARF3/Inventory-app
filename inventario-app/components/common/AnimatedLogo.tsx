import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

interface AnimatedLogoProps {
  size?: number;
  style?: any;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 250,  // Tamaño más grande por defecto
  style 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current; // Empezamos más cerca del tamaño final
  const translateYAnim = useRef(new Animated.Value(10)).current; // Reducido para bajar aún más el margen superior inicial

  useEffect(() => {
    // Animación más simple y directa
    Animated.parallel([
      // Fade in suave
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Escala directa al tamaño final (sin efectos de respiración)
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Subida desde abajo
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },        // Se queda en 1 permanentemente
            { translateY: translateYAnim } // Se queda en 0 permanentemente
          ],
        },
        style,
      ]}
    >
      <Image
        source={require('../../assets/estancia360/logo.png')}
        style={[
          styles.logo,
          {
            width: size,
            height: size,
          },
        ]}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    borderRadius: 20,
  },
});